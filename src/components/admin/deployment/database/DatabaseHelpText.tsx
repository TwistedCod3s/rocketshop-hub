
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
              <li>category (text, unique)</li>
              <li>subcategory_list (json array)</li>
            </ul>
          </li>
          <li><strong>coupons</strong>
            <ul className="list-disc ml-5 text-xs space-y-0.5 mt-1">
              <li>id (uuid, primary key)</li>
              <li>code (text)</li>
              <li>discount (numeric)</li>
              <li>discount_percentage (numeric, optional)</li>
              <li>expiry_date (date)</li>
              <li>active (boolean)</li>
              <li>description (text)</li>
            </ul>
          </li>
        </ul>

        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mt-3">
          <p className="font-semibold text-yellow-800 mb-1">Important:</p>
          <p className="text-xs text-yellow-800">Make sure to enable Row Level Security (RLS) and create an "INSERT" and "SELECT" policy for each table that allows public access:</p>
          <pre className="bg-yellow-100 p-2 rounded text-xs my-1 overflow-x-auto">
            CREATE POLICY "Allow public access" ON "public"."products" FOR ALL USING (true) WITH CHECK (true);
          </pre>
          <p className="text-xs text-yellow-800 mt-1">Repeat this policy for each table (products, category_images, subcategories, coupons).</p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseHelpText;
