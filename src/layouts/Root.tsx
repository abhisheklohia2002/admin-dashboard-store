import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { self } from "../http/api";
import { useAuthStore } from "../store/store";
import { useEffect } from "react";

const getSelf = async () => {
  const { data } = await self();
  return data;
};


export default function Root() {
  const setUser = useAuthStore((state) => state.setUser);

  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  if (isLoading) return <div>loading</div>;

  return <Outlet />;
}
