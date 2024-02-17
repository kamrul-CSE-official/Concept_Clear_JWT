import { Outlet } from "react-router-dom";
import ShareNavbar from "../Components/Share/Navbar";
import Footer from "../Components/Share/Footer";

const MainLayouts = () => {
  return (
    <>
      <ShareNavbar />
      <section>
        <Outlet />
      </section>
      <Footer />
    </>
  );
};

export default MainLayouts;
