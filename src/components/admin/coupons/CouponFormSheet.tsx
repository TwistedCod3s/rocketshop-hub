
import React from "react";
import { CouponCode } from "@/types/shop";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import CouponForm from "./CouponForm";

interface CouponFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    code: string;
    discountPercentage: number;
    active: boolean;
    description: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    code: string;
    discountPercentage: number;
    active: boolean;
    description: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  editingCoupon: CouponCode | null;
}

const CouponFormSheet: React.FC<CouponFormSheetProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  editingCoupon
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</SheetTitle>
        </SheetHeader>
        
        <CouponForm 
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          isEditing={!!editingCoupon}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CouponFormSheet;
