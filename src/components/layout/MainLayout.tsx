
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow page-transition pt-0">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
