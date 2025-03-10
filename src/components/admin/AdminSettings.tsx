import React from "react";
import ExportImportButton from "./ExportImportButton";
import DeploymentSettings from "./DeploymentSettings";

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
      
      <DeploymentSettings />
    </div>
  );
};

export default AdminSettings;
