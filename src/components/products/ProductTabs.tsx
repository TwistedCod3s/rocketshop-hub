
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Star } from "lucide-react";
import { Product } from "@/types/shop";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  return (
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
  );
};

export default ProductTabs;
