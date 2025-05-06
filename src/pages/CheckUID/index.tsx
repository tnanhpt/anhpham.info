import { useMemo, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import TextArea from "antd/es/input/TextArea";
import { Button, Col, Flex, Progress, Row } from "antd";
import _ from "lodash";
import axios from "axios";
import NumberFormatter from "../../components/NumberFormatter";
import { showError } from "../../helpers/show-error";
import AppLayout from "../../layouts/AppLayout";

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
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastTotalAccount, setLastTotalAccount] = useState(0);

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

  const reset = () => {
    setLive("");
    setDie("");
    setError("");
    setPercent(0);
  };
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    reset();
    setLoading(true);
    setLastTotalAccount(accountLength);

    try {
      let accountStr = data.account;
      let splitChar = /\t/gm;
      if (accountStr.includes("|")) {
        splitChar = /\|/gm;
      }
      let accountLines = accountStr
        .split(/\n/)
        ?.filter((item) => item.trim() != "");

      const totalAccount = accountLines.length;
      const accountLinesChunk = _.chunk(accountLines, 100);
      let totalChecked = 0;
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
              setError(
                (old) =>
                  `${old}${line}|${
                    error?.response?.data?.error?.message || error.message
                  }\r\n`
              );
            }
          })
        );
        totalChecked += accountLinesItem.length;
        const currentPercent = Math.floor((totalChecked / totalAccount) * 100);
        setPercent(currentPercent);
      }
    } catch (error) {
      showError({ message: "Có lỗi xảy ra " + error?.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <MainLayout>
        <h1 className="text-2xl text-blue-600 dark:text-blue-400">
          Kiểm tra live/ die tài khoản Facebook
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-1">
            <p className="text-md font-medium text-gray-600 dark:text-gray-300 mb-2">
              <span>
                Danh sách tài khoản cần kiểm tra (định dạng uid hoặc
                uid|xxx|...)
              </span>
            </p>
            <div className="relative bg-blue-50 dark:bg-slate-800 p-4 rounded-lg shadow-md">
              <span className="absolute z-10 ml-2 top-3 right-3 text-white text-sm bg-blue-500 px-2 rounded-full">
                <NumberFormatter number={accountLength} />
              </span>
              <Controller
                render={({ field }) => (
                  <TextArea
                    {...field}
                    defaultValue=""
                    className="mt-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm"
                    rows={8}
                    placeholder="Mỗi dòng một UID"
                  />
                )}
                name="account"
                control={control}
                defaultValue=""
              />
              {errors?.account?.message && (
                <p className="text-red-400 mt-1">{errors?.account?.message}</p>
              )}
            </div>
            <div className="h-5 mt-1">
              {(loading || percent === 100) && (
                <Flex align="center">
                  <p className="mr-2 w-16 text-gray-700 dark:text-gray-300">
                    Tiến độ:
                  </p>
                  <Progress percent={percent} />
                </Flex>
              )}
            </div>
            <Button
              htmlType="submit"
              type="primary"
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
              loading={loading}
            >
              Kiểm tra
            </Button>
          </div>
          <Row className="w-full" gutter={8}>
            <Col xs={24} md={12} className="mt-5">
              <p className="text-lg text-green-600 font-medium">
                <span>Live:</span>
              </p>
              <div className="relative bg-green-50 dark:bg-slate-800 p-4 rounded-lg shadow-md">
                <span className="absolute z-10 ml-2 top-3 right-3 text-white text-sm bg-green-500 px-2 rounded-full">
                  <NumberFormatter number={liveLength} />
                  {lastTotalAccount > 0 && (
                    <span>
                      /<NumberFormatter number={lastTotalAccount} />
                    </span>
                  )}
                </span>
                <TextArea
                  value={live}
                  onChange={(e) => setLive(e.target.value)}
                  className="mt-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm"
                  rows={8}
                />
              </div>
            </Col>
            <Col xs={24} md={12} className="mt-5">
              <p className="text-lg text-red-600 font-medium">
                <span>Die:</span>
              </p>
              <div className="relative bg-red-50 dark:bg-slate-800 p-4 rounded-lg shadow-md">
                <span className="absolute z-10 ml-2 top-3 right-3 text-white text-sm bg-red-500 px-2 rounded-full">
                  <NumberFormatter number={dieLength} />
                  {lastTotalAccount > 0 && (
                    <span>
                      /<NumberFormatter number={lastTotalAccount} />
                    </span>
                  )}
                </span>
                <TextArea
                  value={die}
                  onChange={(e) => setDie(e.target.value)}
                  className="mt-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm"
                  rows={8}
                />
              </div>
            </Col>
          </Row>
          {errorLength > 0 && (
            <div className="mt-5 w-full">
              <p className="text-lg text-red-600 font-medium">
                <span>Kiểm tra lỗi:</span>
              </p>
              <div className="relative bg-red-50 dark:bg-slate-800 p-4 rounded-lg shadow-md">
                <span className="absolute z-10 ml-2 top-3 right-3 text-white text-sm bg-red-500 px-2 rounded-full">
                  <NumberFormatter number={errorLength} />
                  {lastTotalAccount > 0 && (
                    <span>
                      /<NumberFormatter number={lastTotalAccount} />
                    </span>
                  )}
                </span>
                <TextArea
                  value={error}
                  onChange={(e) => setError(e.target.value)}
                  className="mt-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm"
                  rows={6}
                />
              </div>
            </div>
          )}
        </form>
      </MainLayout>
    </AppLayout>
  );
};

export default CheckUID;
