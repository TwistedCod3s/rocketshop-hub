
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4">Store Settings</h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="store-name">Store Name</Label>
            <Input id="store-name" defaultValue="Rocketry Store" />
          </div>
          <div>
            <Label htmlFor="store-currency">Currency</Label>
            <Select defaultValue="GBP">
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GBP">British Pound (£)</SelectItem>
                <SelectItem value="USD">US Dollar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="store-description">Store Description</Label>
          <Textarea 
            id="store-description" 
            defaultValue="Your one-stop shop for model rocketry supplies and equipment."
            rows={3}
          />
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">Contact Information</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="BL1 1HL Churchgate House" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="admin@rocketryforschools.co.uk" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="+44 7496 178309" />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <Button>Save Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
