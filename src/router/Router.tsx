import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Categories from "../pages/Categories";

export const Routers = createBrowserRouter([
    {
        path:"/",
        element:<HomePage/>
    },
     {
        path:"/category",
        element:<Categories/>
    },

])



