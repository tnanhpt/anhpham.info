import { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import TextArea from "antd/es/input/TextArea";
import { Button, Checkbox, Col, Input, Row, Typography } from "antd";
import NumberFormatter from "../../components/NumberFormatter";
import { showError } from "../../helpers/show-error";
import AppLayout from "../../layouts/AppLayout";
import { detectSeparator } from "../../helpers/func";

type Inputs = {
  input: string;
  quantity_link: string;
  result: string;
};

const LOCAL_STORAGE_KEY = "MERGE_ANHPHAMINFO";

const MergeStr = () => {
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {},
  });
  const watchField: Inputs = watch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const splitStr = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!splitStr) return;

      const json = JSON.parse(splitStr);
      setValue("quantity_link", json?.quantity_link || 3);
    } catch (error) {
      console.log("Existed error when parse default data");
    }
  }, []);

  useEffect(() => {}, [watchField?.input]);

  const inputLength = useMemo(() => {
    if (!watchField.input?.trim()) {
      return 0;
    }
    return watchField?.input?.split(/\n/)?.filter((item) => item.trim() != "")
      .length;
  }, [watchField?.input]);

  const resultLength = useMemo(() => {
    if (!watchField.result?.trim()) {
      return 0;
    }
    return watchField?.result?.split(/\n/)?.filter((item) => item.trim() != "")
      .length;
  }, [watchField?.result]);

  const reset = () => {};

  const hanldeMergeLink = (str: any, maxLinks = 2) => {
    const lines = str.split(/\r?\n/).filter(Boolean);

    const obj = {}; // lưu link theo uid
    const meta = {}; // lưu acc|time theo uid nếu có

    lines.forEach((line) => {
      const parts = line.split("|").map((s) => s.trim());
      const [uid, link, acc, time] = parts;

      if (!uid || !link) return;

      // Khởi tạo
      if (!obj[uid]) obj[uid] = [];

      // Lưu link nếu chưa vượt quá maxLinks
      if (obj[uid].length < maxLinks) {
        obj[uid].push(link);
      }

      // Lưu acc|time nếu có
      if (acc && !meta[uid]) {
        meta[uid] = { acc };
      }

      if (time && !meta[uid]) {
        meta[uid] = { ...meta[uid], time };
      }
    });

    // Tạo output
    const result = Object.entries(obj)
      .map((item: any) => {
        // Bổ sung "" nếu chưa đủ 2 link
        const [uid, links] = item;
        while (links.length < maxLinks) {
          links.push("");
        }

        let line = `${uid}|${links.join("|")}`;
        if (meta[uid]) {
          const { acc, time } = meta[uid];
          if (acc) {
            line += `|${acc}`;
          }
          if (time) {
            line += `|${time}`;
          }
        }
        return line;
      })
      .join("\r\n");

    return result;
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    reset();
    setLoading(true);

    try {
      const input = data?.input?.trim();
      if (!input) {
        return;
      }

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      const result = hanldeMergeLink(input, data.quantity_link);
      setValue("result", result);
    } catch (error) {
      showError({ message: "Có lỗi xảy ra " + error?.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Cắt chuỗi theo dòng">
      <MainLayout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-1">
            <div className="relative bg-blue-50 dark:bg-slate-800 p-4 rounded-lg shadow-md">
              <Typography.Title level={5}>Dữ liệu đầu vào</Typography.Title>

              <Controller
                render={({ field }) => (
                  <div className="relative bg-blue-50 dark:bg-slate-800 rounded-lg shadow-md w-full">
                    <span className="absolute z-10 ml-2 top-3 right-3 text-white text-sm bg-blue-500 px-2 rounded-full">
                      <NumberFormatter number={inputLength} />
                    </span>
                    <TextArea
                      {...field}
                      defaultValue=""
                      className="mt-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm"
                      rows={8}
                      placeholder="Nhập chuỗi"
                    />
                  </div>
                )}
                name="input"
                control={control}
                defaultValue=""
                rules={{
                  required: "Trường bắt buộc",
                }}
              />
              {errors?.input?.message && (
                <p className="text-red-400 mt-1">{errors?.input?.message}</p>
              )}

              <Row className="w-full mt-4" gutter={8}>
                <Typography.Title level={5}>Số link</Typography.Title>
                <Controller
                  render={({ field }) => (
                    <Input {...field} placeholder="Số link" type="number" />
                  )}
                  name="quantity_link"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Trường bắt buộc",
                  }}
                />
                {errors?.quantity_link?.message && (
                  <p className="text-red-400 mt-1">
                    {errors?.quantity_link?.message}
                  </p>
                )}
              </Row>

              <Button
                htmlType="submit"
                type="primary"
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
                loading={loading}
              >
                Bắt đầu
              </Button>
              <Row className="w-full mt-4" gutter={8}>
                <Typography.Title level={5}>Kết quả</Typography.Title>
                <Controller
                  render={({ field }) => (
                    <div className="relative bg-blue-50 dark:bg-slate-800 rounded-lg shadow-md w-full">
                      <span className="absolute z-10 ml-2 top-3 right-3 text-white text-sm bg-blue-500 px-2 rounded-full">
                        <NumberFormatter number={resultLength} />
                      </span>
                      <TextArea
                        {...field}
                        defaultValue=""
                        className="mt-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm"
                        rows={24}
                      />
                    </div>
                  )}
                  name="result"
                  control={control}
                  defaultValue=""
                />
              </Row>
            </div>
          </div>
        </form>
      </MainLayout>
    </AppLayout>
  );
};

export default MergeStr;
