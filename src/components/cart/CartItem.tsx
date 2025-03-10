
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types/shop";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b">
      <div className="flex items-center flex-grow">
        <div className="h-20 w-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
          <img 
            src={item.product.images?.[0] || "/placeholder.svg"} 
            alt={item.product.name} 
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="ml-4">
          <h3 className="font-medium">{item.product.name}</h3>
          <p className="text-sm text-muted-foreground">£{item.product.price.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="flex items-center mt-4 sm:mt-0 w-full sm:w-auto space-x-6">
        <div className="w-24">
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="h-9"
          />
        </div>
        
        <div className="w-24 text-right">
          <p className="font-medium">£{(item.product.price * item.quantity).toFixed(2)}</p>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onRemove(item.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
