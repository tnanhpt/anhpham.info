import Axios from "axios";

// axios
const axios = Axios.create({
  // baseURL: "http://localhost:9005/api/v1",
  baseURL: "/api/v1",
});
// request


// axios.interceptors.request.use(
//   (config) => {
//     config.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
//       "token"
//     )}`;
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
// response

axios.interceptors.response.use(
  (response) => {
    
    return response?.data || response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
      window.location.reload();
    }
    return Promise.reject(error?.response?.data || error?.message);
  }
);

export default axios;
