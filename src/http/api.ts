import type { Credentials, ITenantForm, UserData } from "../types";
import api from "./client";
const AUTH_SERVICE = "/api/auth"
const CATALOG_SERVICE = "/api/catalog"
export const login = async (credentials: Credentials) => {
  return await api.post(`${AUTH_SERVICE}/auth/login`, credentials);
};

export const self = async () => {
  return await api.get(`${AUTH_SERVICE}/auth/self`);
};

export const logout = async () => {
  return await api.post(`${AUTH_SERVICE}/auth/logout`);
};

export const showUsers = async (query: string) => {
  return await api.get(`${AUTH_SERVICE}/user?${query}`);
};

export const allTenant = async (query?: string) => {
  if (query) {
    return await api.get(`${AUTH_SERVICE}/tenant?${query}`);
  }
  return await api.get(`${AUTH_SERVICE}/tenant`);
};

export const createUser = async (data: UserData) => {
  return await api.post(`${AUTH_SERVICE}/user`, data);
};

export const updateUser = async (data: UserData) => {
  return await api.put(`${AUTH_SERVICE}/user/${data.id}`, data);
};
export const createTenants = async (data: ITenantForm) => {
  return await api.post(`${AUTH_SERVICE}/tenant`, data);
};


//categlog service 

export const getCategories = async()=>{
  return await api.get(`${CATALOG_SERVICE}/category/`)
}

export const showProduct = async(query: string) => {
  return await api.get(`${CATALOG_SERVICE}/product?${query}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createProduct = async(data:FormData) => {
  return await api.post(`${CATALOG_SERVICE}/product`,data,
    {
       headers: {
      "Content-Type": undefined, 
    },
    }
  );
};