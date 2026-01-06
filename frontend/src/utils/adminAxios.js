import axios from "axios";

const adminAxios = axios.create({
  baseURL: "http://localhost:5000/api",
});

adminAxios.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("binclass_auth"));
    if (auth?.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default adminAxios;
