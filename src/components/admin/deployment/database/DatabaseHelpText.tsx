
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const DatabaseHelpText = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <InfoIcon className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-700 text-sm">
        <p className="font-medium mb-2">Setting up your Supabase database tables</p>
        <p className="mb-2">Your Supabase database should have the following tables with these exact columns:</p>
        
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
              <li>discount_percentage (numeric)</li>
              <li>expiry_date (date)</li>
              <li>active (boolean)</li>
              <li>description (text)</li>
            </ul>
          </li>
        </ul>

        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mt-3">
          <p className="font-semibold text-yellow-800 mb-1">Important: Enable Row Level Security</p>
          <p className="text-xs text-yellow-800">You must enable Row Level Security (RLS) for each table and create specific policies that allow public access. 
          Use these SQL commands in the Supabase SQL editor:</p>
          
          <div className="mt-2 mb-1">
            <p className="text-xs font-semibold">1. For products table:</p>
            <pre className="bg-yellow-100 p-2 rounded text-xs my-1 overflow-x-auto">
              ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;{"\n"}
              CREATE POLICY "Allow full public access" ON public.products{"\n"}
              FOR ALL TO public USING (true) WITH CHECK (true);
            </pre>
          </div>
          
          <div className="mt-2 mb-1">
            <p className="text-xs font-semibold">2. For category_images table:</p>
            <pre className="bg-yellow-100 p-2 rounded text-xs my-1 overflow-x-auto">
              ALTER TABLE public.category_images ENABLE ROW LEVEL SECURITY;{"\n"}
              CREATE POLICY "Allow full public access" ON public.category_images{"\n"}
              FOR ALL TO public USING (true) WITH CHECK (true);
            </pre>
          </div>
          
          <div className="mt-2 mb-1">
            <p className="text-xs font-semibold">3. For subcategories table:</p>
            <pre className="bg-yellow-100 p-2 rounded text-xs my-1 overflow-x-auto">
              ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;{"\n"}
              CREATE POLICY "Allow full public access" ON public.subcategories{"\n"}
              FOR ALL TO public USING (true) WITH CHECK (true);
            </pre>
          </div>
          
          <div className="mt-2 mb-1">
            <p className="text-xs font-semibold">4. For coupons table:</p>
            <pre className="bg-yellow-100 p-2 rounded text-xs my-1 overflow-x-auto">
              ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;{"\n"}
              CREATE POLICY "Allow full public access" ON public.coupons{"\n"}
              FOR ALL TO public USING (true) WITH CHECK (true);
            </pre>
          </div>
          
          <p className="text-xs text-yellow-800 mt-2">Remember to run these commands for each table to allow the app to read and write data.</p>
        </div>
        
        <div className="bg-green-50 p-3 rounded border border-green-200 mt-3">
          <p className="font-semibold text-green-800 mb-1">Quick Setup SQL</p>
          <p className="text-xs text-green-800">Copy and paste this SQL into the Supabase SQL Editor to create all tables with proper columns and permissions:</p>
          <pre className="bg-green-100 p-2 rounded text-xs my-1 overflow-x-auto">
            {`-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  category text,
  images json,
  inStock boolean DEFAULT true,
  featured boolean DEFAULT false,
  rating numeric,
  reviews json,
  specifications json,
  fullDescription text
);

-- Create category_images table
CREATE TABLE IF NOT EXISTS public.category_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_slug text UNIQUE NOT NULL,
  image_url text
);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS public.subcategories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category text UNIQUE NOT NULL,
  subcategory_list json
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text NOT NULL,
  discount numeric NOT NULL,
  discount_percentage numeric,
  expiry_date date,
  active boolean DEFAULT true,
  description text
);

-- Enable RLS and create policies for all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full public access" ON public.products
FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.category_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full public access" ON public.category_images
FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full public access" ON public.subcategories
FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full public access" ON public.coupons
FOR ALL TO public USING (true) WITH CHECK (true);`}
          </pre>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseHelpText;
