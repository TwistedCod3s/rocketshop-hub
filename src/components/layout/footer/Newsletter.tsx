
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

  return (
    <div>
      <h3 className="font-semibold mb-6">Newsletter</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Subscribe to our newsletter for the latest product updates, special offers, and educational resources.
      </p>
      <form onSubmit={handleNewsletter} className="space-y-3">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-md"
        />
        <Button type="submit" className="w-full bg-rocketry-navy hover:bg-rocketry-navy/90">
          Subscribe
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;
