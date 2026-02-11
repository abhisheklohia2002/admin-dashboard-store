import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Categories from "../pages/Categories";
import LoginPage from "../pages/login/Login";
import Dashboard from "../layouts/Dashboard";
import NonAuth from "../layouts/NonAuth";
import Root from "../layouts/Root";

export const Routers = createBrowserRouter([
  {
    path:'/',
    element:<Root/>,
    children:[ 
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: "home",
            element: <HomePage />,
          },
          {
            path: "category",
            element: <Categories />,
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
    ]
  },
]);
