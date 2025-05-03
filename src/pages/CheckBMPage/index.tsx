import { Button, Col, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import _ from "lodash";

type Inputs = {
  bms: string;
};
var token =
  "EAAGNO4a7r2wBO7TJZAk8Brr67V2G79aDqGttxZBgxxjPGmJmTc1EPkDIKgLNj6OEm4nXMl0ogPPc4xfcu0fuXxsBVXXGwcDlpD5qAdoenbrrt7Et6ryv8BLkboAYaZA0O86OFZCUhQR3pa8MWOZCnCZASQj9BTZARcSPBZBD1XpsayT37CIQTIUkyI00ZAQuf0AfQIN3NskCuiQZDZD";
const CheckBMPage = () => {
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

  const bmsLength = useMemo(() => {
    if (!watchField.bms?.trim()) {
      return 0;
    }
    return watchField?.bms?.split(/\n/)?.filter((item) => item.trim() != "")
      .length;
  }, [watchField?.bms]);

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
    setError("");
    try {
      let bmsStr = data.bms;
      let splitChar = /\t/gm;
      if (bmsStr.includes("|")) {
        splitChar = /\|/gm;
      }
      let bmsLines = bmsStr.split(/\n/)?.filter((item) => item.trim() != "");
      const bmsLinesChunk = _.chunk(bmsLines, 10);
      for (let i = 0; i < bmsLinesChunk.length; i++) {
        let bmsLinesItem = bmsLinesChunk[i];

        await Promise.all(
          bmsLinesItem.map(async (line) => {
            const bms = line
              ?.split(splitChar)
              ?.filter((item) => item?.length > 0);
            try {
              const bmId = bms[0]?.trim();
              const response: any = await axios.get(
                `https://graph.facebook.com/${bmId}?access_token=${token}&_reqName=object:brand&_reqSrc=BrandResourceRequests.brands&date_format=U&fields=%5B%22allow_page_management_in_www,verification_status,name%22%5D`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    "Cookie": `sb=mv6qZHZ0JW9cdT1TXtx7-Wtz; oo=v1; ps_l=1; ps_n=1; datr=AqMEZ8I4Cdo29Z3gfnFOCDP6; c_user=100006533077465; ar_debug=1; b_user=61560459536141; usida=eyJ2ZXIiOjEsImlkIjoiQXNuNHd2ZzE4cGtkeWUiLCJ0aW1lIjoxNzMxOTEzMzI0fQ%3D%3D; locale=vi_VN; fbl_st=100425769%3BT%3A28865245; vpd=v1%3B667x375x2; wl_cbv=v2%3Bclient_version%3A2675%3Btimestamp%3A1731914755%3BCRCM%3A1459339832; presence=C%7B%22lm3%22%3A%22sc.25052368297739916%22%2C%22t3%22%3A%5B%7B%22o%22%3A0%2C%22i%22%3A%22sc.7341316682640053%22%7D%5D%2C%22utc3%22%3A1731914843473%2C%22v%22%3A1%7D; fr=1nh5JSDDkngXnSaBB.AWW92vkn0C9rqeUYA0HEnDv9tmA.BnOu6A..AAA.0.0.BnOu6A.AWXN6iEk7I8; xs=12%3AILSgqi-C4TuVvA%3A2%3A1730973685%3A-1%3A6381%3AwPiOB4ohtu758w%3AAcWr8l91xFvxKQVrATsBdrNaUM3CnJOagAU-XoP3fP4z; wd=375x667; dpr=2`,
                    "origin": "https://www.facebook.com",
                  },
                }
              );
              const bmInfo = response.data;
              if (bmInfo.allow_page_management_in_www) {
                setLive((old) => `${old}${line}|${bmInfo.name}\r\n`);
              } else {
                setDie((old) => `${old}${line}|${bmInfo.name}\r\n`);
              }
            } catch (error: any) {
              console.log("🚀 ~ bmsLinesItem.forEach ~ error:", error);
              setError(
                (old) =>
                  `${old}${line}|${
                    error?.response?.data?.error?.message || ""
                  }\r\n`
              );
            }
          })
        );
      }
    } catch (error) {}
  };

  return (
    <div className="border rounded-md	p-3 shadow-lg text-left">
      {/* <h3 className="font-medium text-lg">Check BM</h3> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-0 shadow-sm">
          <p className="text-lg font-normal mt-2 mb-3">
            <span>List of BMs to check (uid, uid|link|...)</span>
            <span className="ml-2 text-white text-sm bg-gray-500 px-2 rounded-full">
              {bmsLength}
            </span>
          </p>
          <Controller
            render={({ field }) => (
              <TextArea
                {...field}
                defaultValue=""
                className="mt-2"
                rows={6}
                placeholder="Input here"
              />
            )}
            name="bms"
            control={control}
            defaultValue=""
          />

          {errors?.bms?.message && (
            <p className="text-red-400 mt-1">{errors?.bms?.message}</p>
          )}
          <Button htmlType="submit" type="primary" className="mt-2">
            Check
          </Button>
        </div>
        <Row gutter={8}>
          <Col xs={24} md={12} className="mt-5">
            <p className="text-lg text-green-500 font-medium">
              <span>Live</span>
              <span className="ml-2 text-white text-sm bg-green-500 px-2 rounded-full">
                {liveLength}/{bmsLength}
              </span>
            </p>
            <TextArea
              value={live}
              onChange={(e) => setLive(e.target.value)}
              className="mt-2 w-100"
              rows={6}
            />
          </Col>
          <Col xs={24} md={12} className="mt-5">
            <p className="text-lg text-red-500 font-medium m-0">
              <span>Die</span>
              <span className="ml-2  text-white text-sm bg-red-500 px-2 rounded-full">
                {dieLength}/{bmsLength}
              </span>
            </p>
            <TextArea
              value={die}
              onChange={(e) => setDie(e.target.value)}
              className="mt-2"
              rows={6}
            />
          </Col>
        </Row>
        <div className="mt-5 w-full">
          <p className="text-lg text-red-500 font-medium m-0">
            <span>Error</span>
            <span className="ml-2  text-white text-sm bg-red-500 px-2 rounded-full">
              {errorLength}/{bmsLength}
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
    </div>
  );
};

export default CheckBMPage;
