
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const DatabaseHelpText = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <InfoIcon className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-700 text-sm">
        <p className="font-medium mb-2">Setting up your Supabase database tables</p>
        <p className="mb-2">Your Supabase database should have the following tables with these columns:</p>
        
        <ul className="list-disc ml-5 space-y-1 mb-2">
          <li><strong>products</strong>
            <ul className="list-disc ml-5 text-xs space-y-0.5 mt-1">
              <li>id (uuid, primary key)</li>
              <li>name (text)</li>
              <li>description (text)</li>
              <li>price (numeric)</li>
              <li>category (text)</li>
              <li>images (json)</li>
              <li>inStock (boolean)</li>
              <li>featured (boolean)</li>
              <li>rating (numeric, optional)</li>
              <li>reviews (json, optional)</li>
              <li>specifications (json, optional)</li>
              <li>fullDescription (text, optional)</li>
              <li><span className="line-through">last_updated (timestamp)</span> - <span className="italic text-gray-600">Created automatically by Supabase</span></li>
            </ul>
          </li>
          <li><strong>category_images</strong>
            <ul className="list-disc ml-5 text-xs space-y-0.5 mt-1">
              <li>id (uuid, primary key)</li>
              <li>category_slug (text, unique)</li>
              <li>image_url (text)</li>
            </ul>
          </li>
          <li><strong>subcategories</strong>
            <ul className="list-disc ml-5 text-xs space-y-0.5 mt-1">
              <li>id (uuid, primary key)</li>
              <li>category_slug (text, unique)</li>
              <li>subcategories (json array)</li>
            </ul>
          </li>
          <li><strong>coupons</strong>
            <ul className="list-disc ml-5 text-xs space-y-0.5 mt-1">
              <li>id (uuid, primary key)</li>
              <li>code (text)</li>
              <li>discount (numeric)</li>
              <li>active (boolean)</li>
              <li>description (text)</li>
              <li>expiryDate (date)</li>
              <li>discountPercentage (numeric, optional)</li>
            </ul>
          </li>
        </ul>
        <p className="text-xs italic">Note: Each table should have id as primary key and unique constraints on slug fields.</p>
        <p className="text-xs italic">Timestamps (created_at, updated_at) are automatically added by Supabase.</p>
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseHelpText;
