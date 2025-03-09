
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useShopContext } from "@/context/ShopContext";

const Account = () => {
  const navigate = useNavigate();
  const { isAdmin } = useShopContext();

  // For now, we'll create a simple account page
  // In a real app, you would implement authentication
  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-rocketry-navy">My Account</h1>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="details">Account Details</TabsTrigger>
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
          
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Manage your account information.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <p>Account functionality coming soon.</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {isAdmin && (
                  <Button variant="outline" onClick={() => navigate("/admin")}>
                    Admin Dashboard
                  </Button>
                )}
                <Button className="ml-auto">Save Changes</Button>
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
                <div className="text-center py-12 text-muted-foreground">
                  <p>Your wishlist is empty.</p>
                </div>
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
