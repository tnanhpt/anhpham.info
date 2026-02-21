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
  split_char: string;
  result: string;
  from: string;
  to: string;
  remove_duplicate: boolean;
  is_replace_sperator: boolean;
  replace_value: string;
};

const SplitStr = () => {
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
      const splitStr = localStorage.getItem("SPLIT_ANHPHAMINFO");
      if (!splitStr) return;

      const json = JSON.parse(splitStr);
      console.log("🚀 ~ SplitStr ~ json:", json);
      setValue("split_char", json?.split_char || "|");
      setValue("from", json?.from || 1);
      setValue("to", json?.to || 2);
      setValue("remove_duplicate", json?.remove_duplicate || false);
      setValue("replace_value", json?.replace_value || false);
      setValue("is_replace_sperator", json?.is_replace_sperator || "");
    } catch (error) {
      console.log("Existed error when parse default data");
    }
  }, []);

  useEffect(() => {
    if (!watchField?.input) return;
    const split_char = detectSeparator(watchField.input);
    if (split_char) {
      setValue("split_char", split_char);
    }
    return () => {};
  }, [watchField?.input]);

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

  const enableReplace = watch("is_replace_sperator");

  const reset = () => {};
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    reset();
    setLoading(true);

    try {
      const input = data?.input?.trim();
      if (!input) {
        return;
      }

      localStorage.setItem("SPLIT_ANHPHAMINFO", JSON.stringify(data));
      const lines = input.split("\n");

      const splited = lines.map((line) => line?.trim()?.split(data.split_char));

      let resultSplited = splited.map((arr) => {
        const arrSplited = arr.slice(Number(data.from) - 1, Number(data.to));
        return arrSplited.join(
          data?.is_replace_sperator ? data?.replace_value : data.split_char,
        );
      });
      // ✅ remove duplicate
      if (data.remove_duplicate) {
        resultSplited = [...new Set(resultSplited)];
      }

      const result = resultSplited.join("\r\n");

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
              <Typography.Title level={5}>Chuỗi ban đầu</Typography.Title>

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
                  required: "Cần nhập input đầu vào",
                }}
              />
              {errors?.input?.message && (
                <p className="text-red-400 mt-1">{errors?.input?.message}</p>
              )}

              <Row className="w-full mt-4" gutter={8}>
                <Typography.Title level={5}>Ngăn cách bởi</Typography.Title>
                <Controller
                  render={({ field }) => (
                    <Input {...field} placeholder="Nhập kí tự ngăn cách hoặc tự động nhận diện" />
                  )}
                  name="split_char"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Cần nhập kí tự ngăn cách",
                  }}
                />
                {errors?.split_char?.message && (
                  <p className="text-red-400 mt-1">
                    {errors?.split_char?.message}
                  </p>
                )}
              </Row>

              <Row className="w-full mt-4" gutter={12} align={"middle"}>
                <Col xs={24} md={6}>
                  <Typography.Title level={5}>Bắt đầu cắt</Typography.Title>
                  <Controller
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Bắt đầu cắt"
                        type="number"
                      />
                    )}
                    name="from"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Trường bắt buộc",
                    }}
                  />
                  {errors?.from?.message && (
                    <p className="text-red-400 mt-1">{errors?.from?.message}</p>
                  )}
                </Col>
                <Col xs={24} md={6}>
                  <Typography.Title level={5}>Đến cụm</Typography.Title>
                  <Controller
                    render={({ field }) => (
                      <Input {...field} placeholder="Đến cụm" type="number" />
                    )}
                    name="to"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Trường bắt buộc",
                    }}
                  />
                  {errors?.to?.message && (
                    <p className="text-red-400 mt-1">{errors?.to?.message}</p>
                  )}
                </Col>
                <Col xs={24} md={6} className="mt-7">
                  <Controller
                    render={({ field }) => (
                      <Checkbox
                        className="mt-0 md:mt-1"
                        {...field}
                        checked={field.value}
                      >
                        Lọc trùng lặp
                      </Checkbox>
                    )}
                    name="remove_duplicate"
                    control={control}
                  />
                </Col>
                <Col xs={24} md={6} className="mt-7">
                  <Row className="w-full" gutter={12} align={"middle"}>
                    <Col className="align-middle">
                      <Controller
                        render={({ field }) => (
                          <Checkbox
                            className="mt-0 md:mt-1"
                            {...field}
                            checked={field.value}
                          >
                            Thay thế ký tự
                          </Checkbox>
                        )}
                        name="is_replace_sperator"
                        control={control}
                      />
                    </Col>
                    <Col>
                      <Controller
                        name="replace_value"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Nhập ký tự thay thế"
                            disabled={!enableReplace}
                          />
                        )}
                      />
                      {errors?.from?.message && (
                        <p className="text-red-400 mt-1">
                          {errors?.replace_value?.message}
                        </p>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Button
                htmlType="submit"
                type="primary"
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
                loading={loading}
              >
                Tiến hành cắt
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
                        rows={8}
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

export default SplitStr;
