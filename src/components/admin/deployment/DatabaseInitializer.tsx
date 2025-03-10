
import React from "react";
import { Button } from "@/components/ui/button";
import { initializeDatabaseFromLocalStorage } from "@/utils/database/adminDataSync";
import { toast } from "sonner";

const DatabaseInitializer = () => {
  const handleInitializeDatabase = async () => {
    try {
      await initializeDatabaseFromLocalStorage();
      toast.success("Database Initialized", {
        description: "Successfully initialized the database from local storage."
      });
    } catch (error) {
      toast.error("Error Initializing Database", {
        description: "Failed to initialize the database from local storage."
      });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-500">
        Initialize the database with data from local storage. This will overwrite any existing data in your Supabase database.
      </p>
      <Button onClick={handleInitializeDatabase}>Initialize Database</Button>
    </div>
  );
};

export default DatabaseInitializer;
