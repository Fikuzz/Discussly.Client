import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { jwtService } from "../services/jwtService";

export const useTokenCheck = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('authToken');
      if (token && jwtService.isExpired(token)) {
        logout();
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 30000);
    
    return () => clearInterval(interval);
  }, [logout]);
};