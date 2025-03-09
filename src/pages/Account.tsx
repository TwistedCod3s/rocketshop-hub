
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useShopContext } from "@/context/ShopContext";

const Account = () => {
  const navigate = useNavigate();
  const { isAdmin } = useShopContext();

  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-rocketry-navy">My Account</h1>

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
      </div>
    </MainLayout>
  );
};

export default Account;
