
import React from "react";
import ExportImportButton from "./ExportImportButton";
import DatabaseSettings from "./deployment/DatabaseSettings";
import DatabaseInitializer from "./deployment/DatabaseInitializer";

const AdminSettings = () => {
  return (
    <div className="grid gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-6">Data Management</h3>
        <p className="text-gray-500 mb-4">
          Export your site data to back it up, or import previously exported data to restore your site.
        </p>
        <ExportImportButton />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-6">Database Settings</h3>
        <p className="text-gray-500 mb-4">
          Manage your database connection and initialization.
        </p>
        <DatabaseInitializer />
      </div>
      
      <DatabaseSettings />
    </div>
  );
};

export default AdminSettings;
