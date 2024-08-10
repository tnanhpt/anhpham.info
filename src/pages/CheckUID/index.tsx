import { useMemo, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import TextArea from "antd/es/input/TextArea";
import { Button } from "antd";
import _ from "lodash";
import axios from "axios";

type Inputs = {
  account: string;
};

const CheckUID = () => {
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Inputs>();
  const watchField: Inputs = watch();
  const [live, setLive] = useState("");
  const [die, setDie] = useState("");
  const [error, setError] = useState("");

  const accountLength = useMemo(() => {
    if (!watchField.account?.trim()) {
      return 0;
    }
    return watchField?.account?.split(/\n/)?.filter((item) => item.trim() != "")
      .length;
  }, [watchField?.account]);

  const liveLength = useMemo(() => {
    if (!live?.trim()) {
      return 0;
    }
    return live.split(/\n/)?.filter((item) => item.trim() != "").length;
  }, [live]);

  const dieLength = useMemo(() => {
    if (!die?.trim()) {
      return 0;
    }
    return die.split(/\n/)?.filter((item) => item.trim() != "").length;
  }, [die]);

  const errorLength = useMemo(() => {
    if (!error?.trim()) {
      return 0;
    }
    return error.split(/\n/)?.filter((item) => item.trim() != "").length;
  }, [error]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLive("");
    setDie("");
    try {
      let accountStr = data.account;
      let splitChar = /\t/gm;
      if (accountStr.includes("|")) {
        splitChar = /\|/gm;
      }
      let accountLines = accountStr
        .split(/\n/)
        ?.filter((item) => item.trim() != "");
      const accountLinesChunk = _.chunk(accountLines, 100);

      for (let i = 0; i < accountLinesChunk.length; i++) {
        let accountLinesItem = accountLinesChunk[i];

        await Promise.all(
          accountLinesItem.map(async (line) => {
            const account = line
              ?.split(splitChar)
              ?.filter((item) => item?.length > 0);
            try {
              const uid = account[0]?.trim();
              const response = await axios.get(
                `https://graph.facebook.com/${uid}/picture?type=normal`
              );
              const redirectUrl = response.request.responseURL;
              if (redirectUrl.includes("100x100")) {
                setLive((old) => `${old}${line}\r\n`);
              } else {
                setDie((old) => `${old}${line}\r\n`);
              }
            } catch (error: any) {
              setError((old) => `${old}${line}|${error?.response?.data?.error?.message || error.message}\r\n`);
            }
          })
        );
      }
    } catch (error) {}
  };

  return (
    <MainLayout>
      <h1 className="text-3xl text-medium">Check Live UID</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5">
          <p className="text-lg font-normal mb-2">
            <span> Danh sách tài khoản cần check (uid, uid|xxx|...)</span>
            <span className="ml-2 text-white text-sm bg-gray-500 px-2 rounded-full">
              {accountLength}
            </span>
          </p>
          <Controller
            render={({ field }) => (
              <TextArea
                {...field}
                defaultValue=""
                className="mt-2"
                rows={6}
                placeholder="Nhập tài khoản cần check"
              />
            )}
            name="account"
            control={control}
            defaultValue=""
          />

          {errors?.account?.message && (
            <p className="text-red-400 mt-1">{errors?.account?.message}</p>
          )}
          <Button htmlType="submit" type="primary" className="mt-2">
            Check
          </Button>
        </div>
        <div className="flex align-middle w-full space-x-4">
          <div className="mt-5  w-full">
            <p className="text-lg text-green-500 font-medium">
              <span>Live</span>
              <span className="ml-2 text-white text-sm bg-green-500 px-2 rounded-full">
                {liveLength}
              </span>
            </p>
            <TextArea
              value={live}
              onChange={(e) => setLive(e.target.value)}
              className="mt-2"
              rows={6}
            />
          </div>
          <div className="mt-5 w-full">
            <p className="text-lg text-red-500 font-medium m-0">
              <span>Die</span>
              <span className="ml-2  text-white text-sm bg-red-500 px-2 rounded-full">
                {dieLength}
              </span>
            </p>
            <TextArea
              value={die}
              onChange={(e) => setDie(e.target.value)}
              className="mt-2"
              rows={6}
            />
          </div>
        </div>

        <div className="mt-5 w-full">
          <p className="text-lg text-red-500 font-medium m-0">
            <span>Lỗi</span>
            <span className="ml-2  text-white text-sm bg-red-500 px-2 rounded-full">
              {errorLength}
            </span>
          </p>
          <TextArea
            value={error}
            onChange={(e) => setError(e.target.value)}
            className="mt-2"
            rows={6}
          />
        </div>
      </form>
    </MainLayout>
  );
};

export default CheckUID;
