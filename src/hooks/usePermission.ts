
import type { User } from "../store/store";

export const usePermission = () => {
  const hasPermission = (user: User | null):boolean => {
    if (user?.role == 'admin' || user?.role == "manager") {
      return true;
    }
    return false;
  };
  return {
    isAllowed:hasPermission
  }
};
