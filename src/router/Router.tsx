import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/login/Login";
import Dashboard from "../layouts/Dashboard";
import NonAuth from "../layouts/NonAuth";
import Root from "../layouts/Root";
import User from "../pages/users/User";
import Restaurants from "../pages/restaurants/Restaurants";
import Products from "../pages/products/Products";

export const Routers = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: "home",
            element: <HomePage />,
          },
          {
            path: "/users",
            element: <User />,
          },
          {
            path: "/restaurants",
            element: <Restaurants />,
          },
          {
            path: "/products",
            element: <Products />,
          },
        ],
      },
      {
        path: "auth",
        element: <NonAuth />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);
