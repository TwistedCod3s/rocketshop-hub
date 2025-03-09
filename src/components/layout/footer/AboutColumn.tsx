import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
const AboutColumn: React.FC = () => {
  return <div>
      <Link to="/">
        <img src="/lovable-uploads/6deeac36-da1c-460a-8457-ffb92c527e95.png" alt="Rocketry For Schools" className="h-10 mb-6" />
      </Link>
      <p className="text-muted-foreground text-sm mb-6">
        Providing high-quality rocketry products and curriculum materials to schools and educational institutions since 2010.
      </p>
      
    </div>;
};
export default AboutColumn;