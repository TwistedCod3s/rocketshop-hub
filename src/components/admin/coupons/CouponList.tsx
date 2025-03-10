
import React from "react";
import { Button } from "@/components/ui/button";
import { CouponCode } from "@/types/shop";
import { Trash2, Pencil } from "lucide-react";

interface CouponListProps {
  coupons: CouponCode[];
  onEdit: (coupon: CouponCode) => void;
  onDelete: (couponId: string) => void;
}

const CouponList: React.FC<CouponListProps> = ({
  coupons,
  onEdit,
  onDelete
}) => {
  if (coupons.length === 0) {
    return <p className="text-muted-foreground text-center py-6">No coupons added yet.</p>;
  }

  return (
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
                  onClick={() => onEdit(coupon)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(coupon.id)}
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
  );
};

export default CouponList;
