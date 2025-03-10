
import { Link } from "react-router-dom";
import { CATEGORY_MAP } from "@/constants/categories";
import { useAdmin } from "@/hooks/useAdmin";
import { useEffect } from "react";

// Define image paths for each category
export const CATEGORY_IMAGES = {
  "rocket-kits": "https://images.unsplash.com/photo-1518365050014-70fe7232897f?auto=format&fit=crop&w=300&h=300", // Model rocket image
  "engines": "https://images.unsplash.com/photo-1518955163464-83bbd23ba2a4?auto=format&fit=crop&w=300&h=300", // Black powder engines
  "tools": "https://images.unsplash.com/photo-1572981779307-38e923e7e42e?auto=format&fit=crop&w=300&h=300", // Launch platform
  "materials": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=300&h=300", // Cardboard tube
  "ukroc": "https://ukroc.com/wp-content/uploads/2017/12/ukroclogo.png", // UKROC logo
  "accessories": "https://images.unsplash.com/photo-1504610494206-63238da5e9ed?auto=format&fit=crop&w=300&h=300" // Altimeter-like device
};

const CategorySection = () => {
  const { categoryImages } = useAdmin();
  
  // Debug logging for category images
  useEffect(() => {
    console.log("CategorySection - Custom images from useAdmin:", categoryImages);
    console.log("CategorySection - Fallback images:", CATEGORY_IMAGES);
  }, [categoryImages]);
  
  // Function to get the correct image URL for a category
  const getCategoryImage = (slug: string) => {
    // First try to get from custom images
    if (categoryImages && categoryImages[slug]) {
      console.log(`Found custom image for ${slug}: ${categoryImages[slug].substring(0, 50)}...`);
      return categoryImages[slug];
    }
    
    // Fallback to default images
    const fallbackImage = CATEGORY_IMAGES[slug as keyof typeof CATEGORY_IMAGES];
    if (fallbackImage) {
      console.log(`Using fallback image for ${slug}: ${fallbackImage}`);
      return fallbackImage;
    }
    
    console.log(`No image found for ${slug}`);
    return "";
  };
  
  // Add console logging to help debug
  console.log("CategorySection rendering with categories:", CATEGORY_MAP);
  console.log("Custom category images:", categoryImages);
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-rocketry-navy mb-8">
          Shop By Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(CATEGORY_MAP).map(([slug, name]) => {
            const categoryPath = `/category/${slug}`;
            const imagePath = getCategoryImage(slug);
            console.log(`Creating link for category: ${name} with path: ${categoryPath}, image: ${imagePath ? (imagePath.substring(0, 30) + "...") : "none"}`);
            
            return (
              <Link 
                to={categoryPath} 
                key={slug}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mb-3 mx-auto">
                  {imagePath ? (
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
                  ) : (
                    // Display first letter if no image is available
                    <span className="text-4xl text-rocketry-navy">{name.charAt(0)}</span>
                  )}
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
