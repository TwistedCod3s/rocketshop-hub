
import { useState, useCallback, useEffect } from "react";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  
  // Check if admin is logged in
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn === "true") {
      setIsAdmin(true);
    }
    
    // Load saved category images from localStorage if available
    const savedImages = localStorage.getItem("categoryImages");
    if (savedImages) {
      setCategoryImages(JSON.parse(savedImages));
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

  // Function to handle file uploads and convert to base64
  const handleFileUpload = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  }, []);
  
  // Function to update category image
  const updateCategoryImage = useCallback((categorySlug: string, imageUrl: string) => {
    setCategoryImages(prev => {
      const updated = { ...prev, [categorySlug]: imageUrl };
      // Save to localStorage for persistence
      localStorage.setItem("categoryImages", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    isAdmin,
    categoryImages,
    tryAdminLogin,
    handleFileUpload,
    updateCategoryImage
  };
}
