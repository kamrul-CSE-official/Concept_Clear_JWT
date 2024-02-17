import { createBrowserRouter } from "react-router-dom";
import MainLayouts from "../layouts/MainLayouts";
import Home from "../Pages/Home";
import About from "../Pages/About";
import UserDetails from "../Pages/UserDetails";
import Login from "../Pages/Login";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayouts />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/userDetails/:id",
        element: <UserDetails />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);
