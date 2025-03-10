
import { useState, useEffect } from "react";

interface ProductImagesProps {
  images: string[];
  name: string;
}

const ProductImages = ({ images, name }: ProductImagesProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [validImages, setValidImages] = useState<string[]>([]);
  
  // Validate images on mount and when images prop changes
  useEffect(() => {
    if (!images || images.length === 0) {
      setValidImages([]);
      return;
    }
    
    const validatedImages = images.filter(img => img && typeof img === 'string');
    setValidImages(validatedImages);
    
    // Reset selected image if out of bounds
    if (selectedImage >= validatedImages.length) {
      setSelectedImage(0);
    }
  }, [images]);
  
  // If no valid images, show placeholder
  if (!validImages || validImages.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden mb-4 bg-gray-100 flex items-center justify-center h-[400px]">
        <div className="text-4xl text-gray-400">{name.charAt(0)}</div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="rounded-lg overflow-hidden mb-4 bg-white">
        <img 
          src={validImages[selectedImage]} 
          alt={name} 
          className="w-full h-[400px] object-contain"
          onError={(e) => {
            // Handle image load error
            e.currentTarget.src = 'https://images.unsplash.com/photo-1581093196277-9f5123652f14?auto=format&fit=crop&w=400&h=400';
          }}
        />
      </div>
      
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <div 
              key={index}
              className={`
                cursor-pointer rounded-md overflow-hidden border-2 
                ${selectedImage === index ? 'border-rocketry-blue' : 'border-transparent'}
              `}
              onClick={() => setSelectedImage(index)}
            >
              <img 
                src={image} 
                alt={`${name} ${index + 1}`}
                className="w-16 h-16 object-cover"
                onError={(e) => {
                  // Handle thumbnail load error
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1581093196277-9f5123652f14?auto=format&fit=crop&w=100&h=100';
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
