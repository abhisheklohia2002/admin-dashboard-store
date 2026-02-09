import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Categories from "../pages/Categories";
import LoginPage from "../pages/login/Login";

export const Routers = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/category",
    element: <Categories />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
]);
