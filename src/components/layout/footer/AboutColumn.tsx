
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const AboutColumn: React.FC = () => {
  return (
    <div>
      <Link to="/">
        <img 
          src="/lovable-uploads/6deeac36-da1c-460a-8457-ffb92c527e95.png" 
          alt="Rocketry For Schools" 
          className="h-10 mb-6"
        />
      </Link>
      <p className="text-muted-foreground text-sm mb-6">
        Providing high-quality rocketry products and curriculum materials to schools and educational institutions since 2010.
      </p>
      <div className="flex space-x-4">
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
          <Facebook className="h-5 w-5" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
          <Twitter className="h-5 w-5" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
          <Instagram className="h-5 w-5" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
          <Linkedin className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
};

export default AboutColumn;
