import axios from "axios";
import { useEffect } from "react";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

const useAxiosSecure = () => {
  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        console.log("Request: ", config);
        return config;
      },
      (error) => {
        console.error("Request error:", error.message);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        console.log("Response: ", response?.data?.status);
        if (response?.data?.status === 200) {
          return response;
        } else if (response?.data?.status === 401) {
          const newAccessToken = response?.data?.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          return axiosSecure.request(response.config);
        }
        return Promise.reject(response);
      },
      (error) => {
        console.error("Response error:", error.message);
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          console.log("Logout the user");
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axiosSecure;
};

export default useAxiosSecure;
