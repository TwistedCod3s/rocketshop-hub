
import ProductCarousel from "@/components/products/ProductCarousel";
import { Product } from "@/types/shop";

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-rocketry-navy mb-8">Related Products</h2>
      <ProductCarousel products={products} title="Related Products" />
    </div>
  );
};

export default RelatedProducts;
