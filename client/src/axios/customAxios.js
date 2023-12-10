import axios from "axios";

axios.defaults.baseURL =
  window.location.protocol +
  "//" +
  (window.location.hostname === "localhost"
    ? "10.10.10.66"
    : window.location.hostname) +
  ":" +
  process.env.REACT_APP_API_PORT;

axios.defaults.headers.common["Authorization"] =
  "Bearer " + JSON.parse(localStorage.getItem("authorization"))?.bearer_token;
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.put["Content-Type"] = "multipart/form-data";

const customAxios = axios;
export default customAxios;
