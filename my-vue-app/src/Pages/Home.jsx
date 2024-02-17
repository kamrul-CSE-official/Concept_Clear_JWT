import axios from "axios";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    async function findData() {
      const res = await axios.get("http://localhost:5000/private", {
        withCredentials: true,
      });
      console.log(res?.data?.data?.users);
    }
    findData();
  }, []);
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
