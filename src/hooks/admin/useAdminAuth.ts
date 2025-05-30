
import { useState, useCallback, useEffect } from "react";
import { ADMIN_STORAGE_KEY } from "./adminUtils";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Check if admin is logged in from session storage (per user)
  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (adminLoggedIn === "true") {
      setIsAdmin(true);
      console.log("Admin logged in from sessionStorage");
    }
  }, []);
  
  // Admin login function
  const tryAdminLogin = useCallback((password: string) => {
    // Simple mock authentication for demo purposes
    if (password === "password123") {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
      setIsAdmin(true);
      console.log("Admin login successful");
      return true;
    }
    console.log("Admin login failed");
    return false;
  }, []);

  return {
    isAdmin,
    tryAdminLogin
  };
}
