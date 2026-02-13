export const UserRole = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  MANAGER: "manager",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const Pagination = {
  PER_PAGE: 2,
} as const ;
