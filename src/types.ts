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


export interface ITenantForm {
  name: string;
  address: string;
}
export interface IQueryParms {
  perPage: number;
  currentPage: number;
}
export interface IProducts{
  name:string,
  description:string,
  isPublished:boolean,
  createdAt:string,
  image:string
}
export interface ICategory{
  _id:string,
  name?:string
}


export type ProductEditPayload = {
  name?: string;
  description?: string;
  categoryId?: string;
  tenantId?: number;
  isPublished?: boolean;
  image?: string;
};

export interface PriceConfiguration {
  [key:string]:{
    priceType:'base' | 'aditional',
    availableOptions:string[]
  }
}