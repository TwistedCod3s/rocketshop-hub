
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for subscribing!", {
      description: "You've been added to our newsletter list."
    });
    setEmail("");
  };
  
  return (
    <div className="py-16 bg-gradient-to-r from-rocketry-navy to-rocketry-navy/80 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <h2 className="text-3xl font-semibold mb-4">Stay Updated</h2>
            <p className="text-white/80 mb-6">
              Subscribe to our newsletter for the latest product releases, educational resources, and special offers for schools.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow bg-white/20 border-white/30 placeholder:text-white/60 text-white"
              />
              <Button type="submit" className="bg-white text-rocketry-navy hover:bg-white/90">
                Subscribe
              </Button>
            </form>
            
            <p className="text-xs text-white/60 mt-4">
              By subscribing, you agree to receive email communications from Rocketry For Schools.
              You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;
