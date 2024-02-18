import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecrure from "../hooks/useAxiosSecrure";

const UserDetails = () => {
  const { email } = useParams();
  const [data, setData] = useState(null);
  const axiosSecure = useAxiosSecrure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosSecure.get(`/userDetails/${email}`);

        setData(res?.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [email, axiosSecure]);

  return (
    <div>
      <h1 className="text-2xl font-bold">{email}</h1>
      <h2>{data?.name}</h2>
      <h3>{data?.age}</h3>
    </div>
  );
};

export default UserDetails;
