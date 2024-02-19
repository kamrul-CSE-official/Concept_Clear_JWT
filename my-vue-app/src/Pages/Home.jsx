import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecrure";

const Home = () => {
  const [users, setUsers] = useState([]);
  const axiosInstance = useAxiosSecure();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosInstance.get("/private");
        setUsers(res?.data?.data?.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [axiosInstance]);

  return (
    <div>
      <h1>Home {users.length}</h1>

      <ul className="flex flex-col items-center justify-center gap-3">
        {users.map((user, i) => (
          <Link
            to={`/userDetails/${user.email}`}
            key={i + user.id}
            className="bg-cyan-400 p-3 m-2 font-bold hover:scale-90 duration-100"
          >
            <span>{user.name}</span> : <span>{user.age}</span>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Home;
