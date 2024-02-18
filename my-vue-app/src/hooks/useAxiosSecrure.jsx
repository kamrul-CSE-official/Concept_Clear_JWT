import axios from "axios";
import { useEffect } from "react";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});
const useAxiosSecrure = () => {
  useEffect(() => {
    axiosSecure.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        console.log("Error tracked in the interceptor ", error.message);
        if (error.response.status === 401 || error.response.status === 403) {
          console.log("Logouot the user");
        }
      }
    );
  }, []);
  return axiosSecure;
};

export default useAxiosSecrure;
