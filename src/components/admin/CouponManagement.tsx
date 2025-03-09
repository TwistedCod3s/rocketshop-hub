
import React, { useState } from "react";
import { useShopContext } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { CouponCode } from "@/types/shop";
import { Trash2, Pencil, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";

const CouponManagement: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useShopContext();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponCode | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: 0,
    active: true,
    description: ""
  });

  const resetForm = () => {
    setFormData({
      code: "",
      discountPercentage: 0,
      active: true,
      description: ""
    });
  };

  const handleEditCoupon = (coupon: CouponCode) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      active: coupon.active,
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

    if (editingCoupon) {
      // Update existing coupon
      updateCoupon({
        ...formData,
        id: editingCoupon.id
      });
      toast({
        title: "Coupon updated",
        description: `Coupon ${formData.code} has been updated successfully.`
      });
    } else {
      // Add new coupon
      addCoupon(formData);
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

      {coupons.length === 0 ? (
        <p className="text-muted-foreground text-center py-6">No coupons added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Code</th>
                <th className="text-left py-3 px-4">Discount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{coupon.code}</td>
                  <td className="py-3 px-4">{coupon.discountPercentage}%</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      coupon.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {coupon.description || '-'}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCoupon(coupon)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCoupon(coupon.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={showForm} onOpenChange={setShowForm}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</SheetTitle>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-6">
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
              <Button type="submit">{editingCoupon ? 'Update' : 'Add'} Coupon</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CouponManagement;
