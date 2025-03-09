
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ShopProvider } from "@/context/ShopContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductList from "./pages/ProductList";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Admin from "./pages/Admin";
import Account from "./pages/Account";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ShopProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/shop" element={<Navigate to="/products" replace />} />
            
            {/* Category routes */}
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            
            {/* Individual category routes for direct access */}
            <Route path="/category/rocket-kits" element={<CategoryPage categoryName="Rocket Kits" />} />
            <Route path="/category/engines" element={<CategoryPage categoryName="Engines" />} />
            <Route path="/category/tools" element={<CategoryPage categoryName="Tools" />} />
            <Route path="/category/materials" element={<CategoryPage categoryName="Materials" />} />
            <Route path="/category/ukroc" element={<CategoryPage categoryName="UKROC" />} />
            <Route path="/category/accessories" element={<CategoryPage categoryName="Accessories" />} />
            
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/account" element={<Account />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ShopProvider>
  </QueryClientProvider>
);

export default App;
