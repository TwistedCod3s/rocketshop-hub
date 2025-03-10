
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Coupon } from "@/types/shop";
import {
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";

interface CouponFormProps {
  formData: {
    code: string;
    discountPercentage: number;
    discount: number;
    expiryDate: string;
    active: boolean;
    description: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    code: string;
    discountPercentage: number;
    discount: number;
    expiryDate: string;
    active: boolean;
    description: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

const CouponForm: React.FC<CouponFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isEditing
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 py-6">
      <div className="space-y-2">
        <Label htmlFor="code">Coupon Code</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
          placeholder="e.g. SUMMER20"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="discount">Discount Percentage</Label>
        <Input
          id="discount"
          type="number"
          min="1"
          max="100"
          value={formData.discountPercentage}
          onChange={(e) => setFormData({...formData, discountPercentage: parseInt(e.target.value) || 0})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <Input
          id="expiryDate"
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({...formData, active: checked})}
        />
        <Label htmlFor="active">Active</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Optional description of the coupon"
          rows={3}
        />
      </div>
      
      <SheetFooter>
        <SheetClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </SheetClose>
        <Button type="submit">{isEditing ? 'Update' : 'Add'} Coupon</Button>
      </SheetFooter>
    </form>
  );
};

export default CouponForm;
