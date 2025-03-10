
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

        <div className="bg-red-50 p-3 rounded border border-red-200 mt-3">
          <p className="font-semibold text-red-800 mb-1">Critical: Row Level Security (RLS)</p>
          <p className="text-xs text-red-800">
            You're seeing 401 Unauthorized errors because RLS policies aren't set up correctly.
            You <strong>must</strong> run these commands in the Supabase SQL editor after creating your tables:
          </p>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mt-3">
          <p className="font-semibold text-yellow-800 mb-1">Enable Row Level Security</p>
          <p className="text-xs text-yellow-800">
            First enable RLS for each table but don't create any policies yet:
          </p>
          
          <pre className="bg-yellow-100 p-2 rounded text-xs my-1 overflow-x-auto">
            ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;{"\n"}
            ALTER TABLE public.category_images ENABLE ROW LEVEL SECURITY;{"\n"}
            ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;{"\n"}
            ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
          </pre>
        </div>
          
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mt-3">
          <p className="font-semibold text-yellow-800 mb-1">1. Create RLS Policy for Products Table</p>
          
          <pre className="bg-yellow-100 p-2 rounded text-xs my-1 overflow-x-auto">
            CREATE POLICY "Enable read for all users"{"\n"}
            ON public.products FOR SELECT{"\n"}
            USING (true);{"\n\n"}
            CREATE POLICY "Enable insert for authenticated users only"{"\n"}
            ON public.products FOR INSERT{"\n"}
            WITH CHECK (true);{"\n\n"}
            CREATE POLICY "Enable update for authenticated users only"{"\n"}
            ON public.products FOR UPDATE{"\n"}
            USING (true){"\n"}
            WITH CHECK (true);{"\n\n"}
            CREATE POLICY "Enable delete for authenticated users only"{"\n"}
            ON public.products FOR DELETE{"\n"}
            USING (true);
          </pre>
        </div>
          
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mt-3">
          <p className="font-semibold text-yellow-800 mb-1">2. Create RLS Policy for Category Images Table</p>
          
          <pre className="bg-yellow-100 p-2 rounded text-xs my-1 overflow-x-auto">
            CREATE POLICY "Enable read for all users"{"\n"}
            ON public.category_images FOR SELECT{"\n"}
            USING (true);{"\n\n"}
            CREATE POLICY "Enable insert for authenticated users only"{"\n"}
            ON public.category_images FOR INSERT{"\n"}
            WITH CHECK (true);{"\n\n"}
            CREATE POLICY "Enable update for authenticated users only"{"\n"}
            ON public.category_images FOR UPDATE{"\n"}
            USING (true){"\n"}
            WITH CHECK (true);{"\n\n"}
            CREATE POLICY "Enable delete for authenticated users only"{"\n"}
            ON public.category_images FOR DELETE{"\n"}
            USING (true);
          </pre>
        </div>
          
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mt-3">
          <p className="font-semibold text-yellow-800 mb-1">3. Create RLS Policy for Subcategories Table</p>
          
          <pre className="bg-yellow-100 p-2 rounded text-xs my-1 overflow-x-auto">
            CREATE POLICY "Enable read for all users"{"\n"}
            ON public.subcategories FOR SELECT{"\n"}
            USING (true);{"\n\n"}
            CREATE POLICY "Enable insert for authenticated users only"{"\n"}
            ON public.subcategories FOR INSERT{"\n"}
            WITH CHECK (true);{"\n\n"}
            CREATE POLICY "Enable update for authenticated users only"{"\n"}
            ON public.subcategories FOR UPDATE{"\n"}
            USING (true){"\n"}
            WITH CHECK (true);{"\n\n"}
            CREATE POLICY "Enable delete for authenticated users only"{"\n"}
            ON public.subcategories FOR DELETE{"\n"}
            USING (true);
          </pre>
        </div>
          
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mt-3">
          <p className="font-semibold text-yellow-800 mb-1">4. Create RLS Policy for Coupons Table</p>
          
          <pre className="bg-yellow-100 p-2 rounded text-xs my-1 overflow-x-auto">
            CREATE POLICY "Enable read for all users"{"\n"}
            ON public.coupons FOR SELECT{"\n"}
            USING (true);{"\n\n"}
            CREATE POLICY "Enable insert for authenticated users only"{"\n"}
            ON public.coupons FOR INSERT{"\n"}
            WITH CHECK (true);{"\n\n"}
            CREATE POLICY "Enable update for authenticated users only"{"\n"}
            ON public.coupons FOR UPDATE{"\n"}
            USING (true){"\n"}
            WITH CHECK (true);{"\n\n"}
            CREATE POLICY "Enable delete for authenticated users only"{"\n"}
            ON public.coupons FOR DELETE{"\n"}
            USING (true);
          </pre>
        </div>
        
        <div className="bg-green-50 p-3 rounded border border-green-200 mt-3">
          <p className="font-semibold text-green-800 mb-1">Complete Setup SQL</p>
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

-- Enable RLS for all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- RLS policies for products
CREATE POLICY "Enable read for all users"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.products FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
ON public.products FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only"
ON public.products FOR DELETE
USING (true);

-- RLS policies for category_images
CREATE POLICY "Enable read for all users"
ON public.category_images FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.category_images FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
ON public.category_images FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only"
ON public.category_images FOR DELETE
USING (true);

-- RLS policies for subcategories
CREATE POLICY "Enable read for all users"
ON public.subcategories FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.subcategories FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
ON public.subcategories FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only"
ON public.subcategories FOR DELETE
USING (true);

-- RLS policies for coupons
CREATE POLICY "Enable read for all users"
ON public.coupons FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.coupons FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
ON public.coupons FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only"
ON public.coupons FOR DELETE
USING (true);`}
          </pre>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseHelpText;
