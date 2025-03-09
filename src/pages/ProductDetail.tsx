
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useShopContext } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Product } from "@/types/shop";
import ProductImages from "@/components/products/ProductImages";
import ProductInfo from "@/components/products/ProductInfo";
import ProductTabs from "@/components/products/ProductTabs";
import RelatedProducts from "@/components/products/RelatedProducts";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProduct, getRelatedProducts } = useShopContext();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    if (productId) {
      const foundProduct = getProduct(productId);
      if (foundProduct) {
        setProduct(foundProduct);
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
          <ProductImages images={product.images} name={product.name} />
          
          {/* Product Info */}
          <ProductInfo product={product} />
        </div>
        
        {/* Product Tabs */}
        <div className="mt-16">
          <ProductTabs product={product} />
        </div>
        
        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
