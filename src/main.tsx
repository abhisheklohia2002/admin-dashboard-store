import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Routers } from "./router/Router.tsx";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={{ token: { colorPrimary: "109B9C" } }}>
        <RouterProvider router={Routers} />
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
);
