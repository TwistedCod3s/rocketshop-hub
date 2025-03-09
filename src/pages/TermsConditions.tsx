
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Separator } from "@/components/ui/separator";

const TermsConditions = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-rocketry-navy mb-6">Terms & Conditions</h1>
        <Separator className="mb-8" />
        
        <div className="prose prose-blue max-w-none">
          <p className="text-lg mb-6">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            These terms and conditions ("Terms") govern your use of the Rocketry For Schools website and the purchase of products from our online store. By accessing our website or placing an order, you agree to be bound by these Terms.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Definitions</h2>
          <p>
            "We", "us", "our", and "Rocketry For Schools" refers to Rocketry For Schools Ltd.
            "You" and "your" refers to the user or purchaser of our products.
            "Products" refers to any items available for purchase on our website.
            "Website" refers to the website operated by Rocketry For Schools.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Ordering & Payment</h2>
          <p>
            All orders are subject to acceptance and availability. We reserve the right to refuse any order without giving reason. When placing an order, you agree that:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>You are legally capable of entering into binding contracts.</li>
            <li>You are at least 18 years old or have parental permission to place an order.</li>
            <li>All information you provide to us is true, accurate, current, and complete.</li>
          </ul>
          <p className="mt-4">
            Payment can be made by credit or debit card, or other payment methods specified on our website. All payments are processed securely through our payment providers.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Shipping & Delivery</h2>
          <p>
            We offer free shipping on all orders over £200. For orders below this value, shipping costs will be calculated at checkout. 
            Delivery times are estimates only and may vary depending on your location and other factors outside our control.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Returns & Refunds</h2>
          <p>
            We offer a 30-day return policy for most products. To be eligible for a return, your item must be unused, in the same condition as you received it, and in its original packaging.
            To initiate a return, please contact our customer service team. Refunds will be processed to the original method of payment within 14 days of receiving the returned product.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Product Safety</h2>
          <p>
            Rocketry products are designed for educational purposes and should be used under proper supervision. We provide comprehensive safety instructions with all our products. 
            It is your responsibility to ensure that all products are used safely and in accordance with these instructions.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
          <p>
            All content on our website, including text, graphics, logos, images, and software, is the property of Rocketry For Schools or our content suppliers and is protected by UK and international copyright laws.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to These Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website.
            It is your responsibility to review these Terms periodically for changes.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>Email: terms@rocketryforschools.com</p>
          <p>Phone: +44 1234 567890</p>
          <p>Address: 123 Rocket Lane, London, UK, SW1A 1AA</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsConditions;
