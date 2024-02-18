import axios from "axios";
import { useEffect } from "react";



const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,

  headers: {
    Authorization: "Bearer " + localStorage.getItem("accessToken"),
  },
});

const useAxiosSecure = () => {
  useEffect(() => {
    const interceptor = axiosSecure.interceptors.response.use(
      (response) => {
        console.log("Response: ", response?.data?.status);
        if (response?.data?.status === 200) {
          return response;
        } else if (response?.data?.status === 401) {
          const newAccessToken = response?.data?.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          // Retry the original request with the new access token
          return axiosSecure.request(response.config);
        }
        return Promise.reject(response);
      },
      (error) => {
        console.log("Error tracked in the interceptor: ", error.message);
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          console.log("Logout the user");
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptor on unmount
    return () => {
      axiosSecure.interceptors.response.eject(interceptor);
    };
  }, []);

  return axiosSecure;
};

export default useAxiosSecure;
