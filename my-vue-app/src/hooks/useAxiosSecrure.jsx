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
        console.log("Requesting with old access token...", accessToken);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        console.error("Request error:", error.message);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        console.log("From axios response: ", response);
        return response;
      },
      async (error) => {
        console.error("Response error:", error.message);
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          error.response.data.newAccessToken
        ) {
          const newAccessToken = error.response.data.newAccessToken;
          localStorage.setItem("accessToken", newAccessToken);
          console.log("Requesting with new access token...", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosSecure(originalRequest);
        } else if (error.response?.status === 403) {
          console.log("Logout the user");
          // Perform logout logic here
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
