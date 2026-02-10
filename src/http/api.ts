import type { Credentials } from "../types";
import api from "./client";

export const login = async (credentials: Credentials) => {
  return await api.post("/auth/login", credentials);
};


export const self = async () => {
  return await api.get("/auth/self");
};

export const logout = async () => {
  return await api.post("/auth/logout");
};