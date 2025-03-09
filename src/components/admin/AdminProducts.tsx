
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/shop";

interface AdminProductsProps {
  products: Product[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: string) => void;
  handleToggleFeatured: (productId: string, isFeatured: boolean) => void;
}

const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  handleEditProduct,
  handleDeleteProduct,
  handleToggleFeatured
}) => {
  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Products</TabsTrigger>
        <TabsTrigger value="featured">Featured Products</TabsTrigger>
        <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <ProductTable 
          products={products} 
          handleEditProduct={handleEditProduct}
          handleDeleteProduct={handleDeleteProduct}
          handleToggleFeatured={handleToggleFeatured}
          showFeaturedToggle
        />
      </TabsContent>
      
      <TabsContent value="featured">
        <ProductTable 
          products={products.filter(p => p.featured)} 
          handleEditProduct={handleEditProduct}
          handleToggleFeatured={handleToggleFeatured}
          showFeaturedToggle={false}
          featuredRemove
        />
      </TabsContent>
      
      <TabsContent value="out-of-stock">
        <ProductTable 
          products={products.filter(p => !p.inStock)} 
          handleEditProduct={handleEditProduct}
          showFeaturedToggle={false}
        />
      </TabsContent>
    </Tabs>
  );
};

interface ProductTableProps {
  products: Product[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct?: (productId: string) => void;
  handleToggleFeatured?: (productId: string, isFeatured: boolean) => void;
  showFeaturedToggle?: boolean;
  featuredRemove?: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  handleEditProduct,
  handleDeleteProduct,
  handleToggleFeatured,
  showFeaturedToggle = false,
  featuredRemove = false
}) => {
  const columns = [
    { label: "Product", key: "product" },
    { label: "Price", key: "price" },
    { label: "Category", key: "category" },
    ...(showFeaturedToggle ? [{ label: "Status", key: "status" }] : []),
    ...(showFeaturedToggle || featuredRemove ? [{ label: "Featured", key: "featured" }] : []),
    { label: "Actions", key: "actions" }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`py-3 px-4 text-left ${column.key === 'actions' ? 'text-right' : ''}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-4 px-4 text-center text-gray-500">
                {featuredRemove ? "No featured products" : showFeaturedToggle ? "No products found" : "No out of stock products"}
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded bg-gray-100 mr-3 flex-shrink-0 overflow-hidden">
                      {product.images?.length > 0 && (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">ID: {product.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">£{product.price.toFixed(2)}</td>
                <td className="py-3 px-4">{product.category}</td>
                
                {showFeaturedToggle && (
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                )}
                
                {(showFeaturedToggle || featuredRemove) && (
                  <td className="py-3 px-4">
                    <Button
                      variant={product.featured ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleFeatured && handleToggleFeatured(product.id, !product.featured)}
                    >
                      {featuredRemove ? 'Remove from Featured' : product.featured ? 'Featured' : 'Make Featured'}
                    </Button>
                  </td>
                )}
                
                <td className="py-3 px-4 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </Button>
                  
                  {handleDeleteProduct && !featuredRemove && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
