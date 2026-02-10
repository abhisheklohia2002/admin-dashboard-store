import type { Credentials } from "../types";
import api from "./client";

export const login = async (credentials: Credentials) => {
  return await api.post("/auth/login", credentials);
};
