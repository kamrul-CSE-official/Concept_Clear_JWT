import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserDetails = () => {
  const { email } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/userDetails/${email}`,
          {
            withCredentials: true,
          }
        );
        setData(res?.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">{email}</h1>
      <h2>{data?.name}</h2>
      <h3>{data?.age}</h3>
    </div>
  );
};

export default UserDetails;
