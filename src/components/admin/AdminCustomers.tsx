
import React from "react";
import { Users } from "lucide-react";

const AdminCustomers: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500 mb-4">View and manage customer information. Track order history and customer preferences.</p>
      
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Customers Yet</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Your customer list is empty. As customers make purchases, they will appear here.
        </p>
      </div>
    </div>
  );
};

export default AdminCustomers;
