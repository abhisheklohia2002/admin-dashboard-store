export interface Credentials {
  email: string;
  password: string;
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role:string;
  id?:number;
  cPassword?:string;
  tenantId?:number;
  tenant?:Tenants | null
}

export interface Tenants {
  address: string;
  name:string;
  id:number;
  createdAt:string;
}