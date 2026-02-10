export const UserRole = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  MANAGER: "manager",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
