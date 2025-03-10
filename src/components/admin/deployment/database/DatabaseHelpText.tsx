
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const DatabaseHelpText = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <InfoIcon className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-700 text-sm">
        <p className="font-medium mb-2">Setting up your Supabase database tables</p>
        <p className="mb-2">Your Supabase database should have the following tables:</p>
        
        <ul className="list-disc ml-5 space-y-1 mb-2">
          <li><strong>products</strong> - Stores all product information
            <ul className="list-disc ml-5 text-xs space-y-0.5 mt-1">
              <li>id (uuid, primary key)</li>
              <li>name (text)</li>
              <li>description (text)</li>
              <li>fullDescription (text, optional)</li>
              <li>price (numeric)</li>
              <li>category (text)</li>
              <li>images (json)</li>
              <li>inStock (boolean)</li>
              <li>featured (boolean)</li>
              <li>rating (numeric, optional)</li>
              <li>specifications (json, optional)</li>
              <li>reviews (json, optional)</li>
              <li>last_updated (timestamp)</li>
            </ul>
          </li>
          <li><strong>category_images</strong> - Stores category banner images
            <ul className="list-disc ml-5 text-xs space-y-0.5 mt-1">
              <li>id (uuid, primary key)</li>
              <li>category_slug (text)</li>
              <li>image_url (text)</li>
            </ul>
          </li>
          <li><strong>subcategories</strong> - Stores subcategory listings
            <ul className="list-disc ml-5 text-xs space-y-0.5 mt-1">
              <li>id (uuid, primary key)</li>
              <li>category_slug (text)</li>
              <li>subcategories (json array)</li>
            </ul>
          </li>
          <li><strong>coupons</strong> - Stores discount coupon codes
            <ul className="list-disc ml-5 text-xs space-y-0.5 mt-1">
              <li>id (uuid, primary key)</li>
              <li>code (text)</li>
              <li>discount (numeric)</li>
              <li>discountPercentage (numeric)</li>
              <li>expiryDate (date)</li>
              <li>active (boolean)</li>
              <li>description (text)</li>
            </ul>
          </li>
        </ul>
        <p className="text-xs italic">Note: All timestamps should be in ISO format and IDs should be valid UUIDs.</p>
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseHelpText;
