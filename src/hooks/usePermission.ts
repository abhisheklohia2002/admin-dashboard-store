
import type { User } from "../store/store";

export const usePermission = () => {
  const allowedRoles = ["admin", "manager"];
  const hasPermission = (user: User | null):boolean => {
    if (user) {
      return allowedRoles.includes(user.role);
    }
    return false;
  };
  return {
    isAllowed:hasPermission
  }
};
