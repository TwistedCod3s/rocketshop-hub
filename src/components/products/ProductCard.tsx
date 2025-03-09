
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types/shop";
import { useShopContext } from "@/context/ShopContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useShopContext();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`Added to cart`, {
      description: `${product.name} has been added to your cart.`
    });
  };
  
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast("Added to wishlist", {
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group overflow-hidden rounded-lg border border-border product-card-hover">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              className="bg-white text-rocketry-navy hover:bg-rocketry-navy hover:text-white transition-colors"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-1 h-4 w-4" />
              Add to Cart
            </Button>
            
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 bg-white border-white text-rocketry-navy hover:bg-white/90 hover:text-rocketry-navy/90"
              onClick={handleWishlist}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          {product.featured && (
            <Badge className="absolute top-3 left-3 bg-rocketry-navy text-white">
              Featured
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-3 flex justify-between items-center">
            <span className="font-semibold">£{product.price.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
