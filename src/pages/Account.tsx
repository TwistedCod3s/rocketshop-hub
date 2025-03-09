
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useShopContext } from "@/context/ShopContext";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types/shop";
import { useState, useEffect } from "react";

const Account = () => {
  const navigate = useNavigate();
  const { isAdmin } = useShopContext();
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-rocketry-navy">My Account</h1>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View your past orders and their status.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <p>You haven't placed any orders yet.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/products")} className="w-full">
                  Start Shopping
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="wishlist" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Wishlist</CardTitle>
                <CardDescription>Items you've saved for later.</CardDescription>
              </CardHeader>
              <CardContent>
                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Your wishlist is empty.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/products")} className="w-full">
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Account;
