
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useShopContext } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Heart, Star, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import ProductCarousel from "@/components/products/ProductCarousel";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/shop";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    products, 
    getProduct, 
    addToCart, 
    getRelatedProducts 
  } = useShopContext();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    if (productId) {
      const foundProduct = getProduct(productId);
      if (foundProduct) {
        setProduct(foundProduct);
        // Reset state when product changes
        setQuantity(1);
        setSelectedImage(0);
        // Get related products
        setRelatedProducts(getRelatedProducts(foundProduct.category, productId));
      } else {
        navigate("/404");
      }
    }
  }, [productId, getProduct, navigate, getRelatedProducts]);
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container py-12 text-center">
          <p>Loading product...</p>
        </div>
      </MainLayout>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });
  };
  
  return (
    <MainLayout>
      <div className="container py-12">
        <Button 
          variant="ghost" 
          className="mb-6 inline-flex items-center" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="rounded-lg overflow-hidden mb-4 bg-white">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-[400px] object-contain"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`
                      cursor-pointer rounded-md overflow-hidden border-2 
                      ${selectedImage === index ? 'border-rocketry-blue' : 'border-transparent'}
                    `}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
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
            
            <p className="text-2xl font-bold text-rocketry-blue mb-6">${product.price.toFixed(2)}</p>
            
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
                <span>Free shipping for orders over $100</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-rocketry-blue" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-6">
              <div className="prose max-w-none">
                <p>{product.fullDescription || product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="p-6">
              <table className="w-full">
                <tbody>
                  {product.specifications?.map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 font-medium">{spec.name}</td>
                      <td className="py-2 px-4">{spec.value}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={2} className="py-2 px-4 text-center">
                        No specifications available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TabsContent>
            <TabsContent value="reviews" className="p-6">
              {product.reviews?.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-none">
                      <div className="flex justify-between">
                        <h4 className="font-bold">{review.user}</h4>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex my-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6">No reviews yet. Be the first to review this product!</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-rocketry-navy mb-8">Related Products</h2>
            <ProductCarousel products={relatedProducts} title="Related Products" />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
