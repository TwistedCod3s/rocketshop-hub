
import React, { useState } from "react";
import { useShopContext } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Coupon } from "@/types/shop";
import { Plus } from "lucide-react";
import CouponList from "./coupons/CouponList";
import CouponFormSheet from "./coupons/CouponFormSheet";

const CouponManagement: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useShopContext();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: 0,
    discount: 0, // Adding the required field
    expiryDate: new Date().toISOString().split('T')[0], // Adding the required field in ISO format
    active: true,
    description: ""
  });

  const resetForm = () => {
    setFormData({
      code: "",
      discountPercentage: 0,
      discount: 0,
      expiryDate: new Date().toISOString().split('T')[0],
      active: true,
      description: ""
    });
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage || 0,
      discount: coupon.discount,
      expiryDate: coupon.expiryDate,
      active: coupon.active || true,
      description: coupon.description || ""
    });
    setShowForm(true);
  };

  const handleDeleteCoupon = (couponId: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      deleteCoupon(couponId);
      toast({
        title: "Coupon deleted",
        description: "The coupon has been successfully deleted."
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code) {
      toast({
        title: "Error",
        description: "Coupon code is required.",
        variant: "destructive"
      });
      return;
    }

    if (formData.discountPercentage <= 0 || formData.discountPercentage > 100) {
      toast({
        title: "Error",
        description: "Discount percentage must be between 1 and 100.",
        variant: "destructive"
      });
      return;
    }

    // Calculate discount amount based on percentage (for backward compatibility)
    const discountAmount = formData.discountPercentage / 100;

    if (editingCoupon) {
      // Update existing coupon
      updateCoupon({
        ...formData,
        id: editingCoupon.id,
        discount: discountAmount
      });
      toast({
        title: "Coupon updated",
        description: `Coupon ${formData.code} has been updated successfully.`
      });
    } else {
      // Add new coupon
      addCoupon({
        ...formData,
        discount: discountAmount
      });
      toast({
        title: "Coupon added",
        description: `Coupon ${formData.code} has been added successfully.`
      });
    }

    resetForm();
    setEditingCoupon(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Coupon Management</h3>
        <Button 
          onClick={() => {
            resetForm();
            setEditingCoupon(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Coupon
        </Button>
      </div>

      <CouponList 
        coupons={coupons}
        onEdit={handleEditCoupon}
        onDelete={handleDeleteCoupon}
      />

      <CouponFormSheet 
        open={showForm}
        onOpenChange={setShowForm}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        editingCoupon={editingCoupon}
      />
    </div>
  );
};

export default CouponManagement;
