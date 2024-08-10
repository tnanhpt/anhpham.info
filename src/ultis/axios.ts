import Axios from "axios";

const axiosFb = Axios.create({
  timeout: 600000,
  // withCredentials: true,
});

// const handleRecord = async (payload) => {
//   await saveLog(payload)
// }

axiosFb.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const res = error.response;
    if (res?.data?.error?.message) {
      error.message = res.data.error.message;
    }

    await Promise.all([
      Promise.reject(error),
      // handleRecord({
      //   errorCode: res?.status || 0,
      //   debug: JSON.stringify({
      //     response: res,
      //   }),
      //   message: 'extension_fb',
      // }),
    ]);
  }
);

export default axiosFb;
