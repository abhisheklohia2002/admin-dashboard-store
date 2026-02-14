import type { Credentials, ITenantForm, UserData } from "../types";
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

export const showUsers = async (query:string) => {
  return await api.get(`/user?${query}`);
};

export const allTenant = async (query:string) => {
  return await api.get(`/tenant?${query}`);
};

export const createUser = async (data:UserData) => {
  return await api.post("/user",data);
};

export const createTenants = async (data:ITenantForm) => {
  return await api.post("/tenant",data);
};