import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useState, useCallback } from "react";
import { githubLight } from "@uiw/codemirror-theme-github";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useDebounce } from "use-debounce";
import DarkModeSw from "../../components/DarkModeSw";
import NoteAPI from "../../apis/notes.api";
import { showError, showSuccess } from "../../helpers/show-error";
import { useNavigate, useParams } from "react-router-dom";
import { sleep } from "../../helpers/func";
import { Button, Input } from "antd";
import { PlusCircleOutlined, ShareAltOutlined } from "@ant-design/icons";


const Note = () => {
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");

  const [valueDebounce] = useDebounce(note, 300);
  const [titleDebounce] = useDebounce(title, 300);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitital, setIsInitital] = useState(true);
  const [lastSavedValue, setLastSavedValue] = useState("");
  const [lastSaveTitle, setLastSavedTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const url = useParams()?.id;
  const navigate = useNavigate();

  // Xử lý chế độ sáng/tối
  const handleDarkMode = useCallback(() => {
    const storedDarkMode = localStorage.getItem("isDarkMode");
    if (storedDarkMode === null) {
      const currentHour = new Date().getHours();
      const isDayTime = currentHour >= 6 && currentHour < 18;
      setIsDarkMode(!isDayTime);
      document.documentElement.classList.toggle("dark", !isDayTime);
    } else {
      const isDark = storedDarkMode === "true";
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, []);

  // Lấy ghi chú từ API
  const getNote = useCallback(async (url: string) => {
    setLoading(true);
    try {
      const response = await NoteAPI.getNote(url);
      if (response?.data?.content || response?.data?.title) {
        setNote(response?.data?.content);
        setTitle(response?.data?.title);
        setLastSavedValue(response?.data?.content);
        setLastSavedTitle(response?.data?.title);
      }
      setIsDisabled(false);
    } catch (error: any) {
      showError({ message: error?.message ?? "Failed to fetch note!" });
      setIsDisabled(true);
    } finally {
      await sleep(500);

      setLoading(false);
      setIsInitital(false);
    }
  }, []);

  // Tạo ghi chú mới
  const onCreateNote = useCallback(async () => {
    setLoading(true);
    try {
      const response = await NoteAPI.createNote();
      if (!response?.data?.url) {
        throw new Error("Cannot get URL for note!");
      }
      return response?.data?.url;
    } catch (error: any) {
      showError({ message: error?.message ?? "Failed to create note!" });
    } finally {
      setLoading(false);
    }
  }, []);

  // Cập nhật ghi chú
  const onUpdateNote = useCallback(
    async (value: string, title: string) => {
      setIsSaving(true);
      try {
        await NoteAPI.updateNote({ content: value, title, url });
        setLastSavedValue(value);
        setLastSavedTitle(value);
      } catch (error: any) {
        showError({ message: error?.message ?? "Failed to update note!" });
      } finally {
        setIsSaving(false);
      }
    },
    [url]
  );

  const createNote = useCallback(async () => {
    const url = await onCreateNote();
    setTitle("");
    setNote("");
    if (url) {
      navigate(`/${url}`);
    }
  }, [onCreateNote, navigate]);

  const onNewNote = async () => {
    const url = await onCreateNote();
    navigate(`/${url}`, { replace: true });
    window.location.reload();
  };

  // Xử lý khi giá trị thay đổi
  const onChangeNote = useCallback((val: string) => {
    setNote(val);
  }, []);
  // Xử lý khi giá trị thay đổi
  const onChangeTitle = useCallback((val: string) => {
    setTitle(val);
  }, []);

  // Xử lý khi tải trang
  useEffect(() => {
    if (!url) {
      createNote();
    } else {
      getNote(url);
    }
  }, [url, createNote, getNote]);

  // Xử lý cập nhật ghi chú khi giá trị thay đổi
  useEffect(() => {
    if (
      (!isInitital && valueDebounce !== lastSavedValue) ||
      titleDebounce != lastSaveTitle
    ) {
      onUpdateNote(valueDebounce, titleDebounce);
    }
  }, [valueDebounce, isInitital, lastSavedValue, onUpdateNote, titleDebounce]);

  // Xử lý chế độ sáng/tối khi tải trang
  useEffect(() => {
    handleDarkMode();
  }, [handleDarkMode]);

  // Chuyển đổi chế độ sáng/tối
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("isDarkMode", newMode.toString());
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  const onCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showSuccess({ message: "URL copied to clipboard!" });
    });
  };

  // Tạo ghi chú mới
  const onDeleteNote = useCallback(async () => {
    setLoading(true);
    try {
      await NoteAPI.deleteNote(url);
      showSuccess({ message: "Note deleted!" });
      navigate("/");
      window.location.reload();
      // setNote("");
      // setLastSavedValue("");
    } catch (error: any) {
      showError({ message: error?.message ?? "Failed to delete note!" });
    } finally {
      setLoading(false);
    }
  }, [url, navigate]);
  console.log(title);

  return (
    <div
      className={`flex flex-col h-screen text-left transition-colors duration-300 dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-700 dark:to-slate-900 dark:text-gray-200 bg-gradient-to-br from-blue-100 via-blue-50 to-teal-100 text-gray-800`}
    >
      <div
        className={`flex flex-col h-screen p-4 text-left container mx-auto transition-colors"`}
      >
        <div className="absolute top-0 right-0 p-4 z-10">
          <DarkModeSw isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>

        <div className="flex-0 mb-4">
          <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">
            NOTEPAD ONLINE
          </h1>
          <p className=" font-medium text-gray-600 dark:text-gray-300">
            <span>Save your notes - Safe your notes</span>
          </p>
        </div>
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-slate-700 opacity-50 flex items-center justify-center rounded-lg z-20" />
        )}
        {/* CodeMirror auto-expand and scroll */}

        <div className="flex justify-between items-center">
          <div className="flex items-center mb-4">
            <Button
              type="primary"
              className="ml-2"
              onClick={onNewNote}
              icon={<PlusCircleOutlined />}
            >
              New note
            </Button>
            {/* <button
            onClick={() => onCopyUrl()}
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300"
          >
            <Button type="primary" shape="circle" icon={<SearchOutlined />} />
          </button> */}
            <Button
              color="cyan"
              variant="solid"
              className="ml-2"
              onClick={onCopyUrl}
              icon={<ShareAltOutlined />}
            >
              Share URL
            </Button>
            <Button
              color="danger"
              variant="solid"
              className="ml-2"
              onClick={onDeleteNote}
              icon={<ShareAltOutlined />}
            >
              Delete Note
            </Button>
          </div>
          <div
            className="text-right"
            style={{
              visibility: isSaving ? "visible" : "hidden",
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            Saving...
          </div>
        </div>
        <div className="title mb-5">
          <Input
            size="large"
            className="dark:bg-slate-800 dark:!text-white input_title"
            value={title}
            style={{
              height: 50,
              fontSize: 20,
              fontFamily: "Consolas",
              color: "#EEEEEE !important",
            }}
            placeholder="Title"
            onChange={(v) => onChangeTitle(v.target.value)}
          />
        </div>
        <div className="flex-1 overflow-auto  text-base bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-fix">
          {!isDisabled && (
            <CodeMirror
              placeholder="Write your notes here..."
              value={note}
              height="100%"
              style={{ fontSize: 20 }}
              onChange={(v) => onChangeNote(v)}
              theme={isDarkMode ? dracula : githubLight}
            />
          )}
        </div>
        <div className="footer mt-4 text-center py-4 bg-gradient-to-r from-teal-200 to-blue-200 dark:from-slate-700 dark:to-slate-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-md">
          <p className="text-sm">
            © 2025{" "}
            <a
              href="https://anhpham.info"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline dark:text-blue-400"
            >
              AnhPham.Info
            </a>{" "}
            - Built with ❤️ by{" "}
            <a
              href="https://facebook.com/tnanhpt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline dark:text-blue-400"
            >
              TNANHPT
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Note;
