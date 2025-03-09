
import { Star, Heart, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/shop";
import { useShopContext } from "@/context/ShopContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useShopContext();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-rocketry-navy mb-2">{product.name}</h1>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="flex">
          {[1, 2, 3, 4, 5].map(star => (
            <Star 
              key={star}
              className={`h-5 w-5 ${star <= product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">({product.reviews?.length || 0} reviews)</span>
      </div>
      
      <p className="text-2xl font-bold text-rocketry-blue mb-6">£{product.price.toFixed(2)}</p>
      
      <div className="prose prose-blue mb-6">
        <p>{product.description}</p>
      </div>
      
      {product.inStock ? (
        <div className="text-green-600 flex items-center mb-6">
          <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
          In Stock
        </div>
      ) : (
        <div className="text-red-600 flex items-center mb-6">
          <div className="w-2 h-2 rounded-full bg-red-600 mr-2"></div>
          Out of Stock
        </div>
      )}
      
      {/* Quantity Selector */}
      <div className="flex items-center mb-6">
        <span className="mr-4">Quantity:</span>
        <div className="flex border rounded-md">
          <button 
            className="px-3 py-1 border-r"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>
          <span className="px-3 py-1">{quantity}</span>
          <button 
            className="px-3 py-1 border-l"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <Button 
          size="lg" 
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          Add to Cart
        </Button>
        <Button variant="outline" size="lg">
          <Heart className="mr-2 h-4 w-4" />
          Add to Wishlist
        </Button>
      </div>
      
      {/* Product Features */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-rocketry-blue" />
          <span>Free shipping for orders over £200</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-rocketry-blue" />
          <span>30-day money-back guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
