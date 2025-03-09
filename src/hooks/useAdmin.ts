
import { useState, useCallback, useEffect } from "react";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Check if admin is logged in
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn === "true") {
      setIsAdmin(true);
    }
  }, []);
  
  // Admin functions
  const tryAdminLogin = useCallback((username: string, password: string) => {
    // Simple mock authentication for demo purposes
    if (username === "admin" && password === "password123") {
      localStorage.setItem("adminLoggedIn", "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  return {
    isAdmin,
    tryAdminLogin
  };
}
