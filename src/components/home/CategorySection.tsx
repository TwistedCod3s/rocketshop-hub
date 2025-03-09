
import { Link } from "react-router-dom";
import { CATEGORY_MAP } from "@/constants/categories";

// Define image paths for each category
export const CATEGORY_IMAGES = {
  "rocket-kits": "/lovable-uploads/5e9df28c-dfeb-451d-aa2d-e34a30a769c6.png",
  "engines": "/lovable-uploads/464bb92b-3c96-4abd-9987-49654404f1b3.png",
  "tools": "/lovable-uploads/6deeac36-da1c-460a-8457-ffb92c527e95.png",
  "materials": "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=300&h=300",
  "ukroc": "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=300&h=300",
  "accessories": "https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=300&h=300"
};

const CategorySection = () => {
  // Add console logging to help debug
  console.log("CategorySection rendering with categories:", CATEGORY_MAP);
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-rocketry-navy mb-8">
          Shop By Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(CATEGORY_MAP).map(([slug, name]) => {
            const categoryPath = `/category/${slug}`;
            const imagePath = CATEGORY_IMAGES[slug as keyof typeof CATEGORY_IMAGES] || "";
            console.log(`Creating link for category: ${name} with path: ${categoryPath}`);
            
            return (
              <Link 
                to={categoryPath} 
                key={slug}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mb-3 mx-auto">
                  <img 
                    src={imagePath} 
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to displaying first letter if image fails to load
                      e.currentTarget.style.display = 'none';
                      const parentElement = e.currentTarget.parentElement;
                      if (parentElement) {
                        const fallbackElement = document.createElement('span');
                        fallbackElement.className = 'text-4xl text-rocketry-navy';
                        fallbackElement.textContent = name.charAt(0);
                        parentElement.appendChild(fallbackElement);
                      }
                    }}
                  />
                </div>
                <h3 className="font-medium text-rocketry-navy">{name}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
