
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
    console.log("ProductImages - Received images:", images);
    
    if (!images || images.length === 0) {
      console.log("ProductImages - No images provided");
      setValidImages([]);
      return;
    }
    
    const validatedImages = images.filter(img => img && typeof img === 'string' && img.trim() !== '');
    console.log("ProductImages - Valid images:", validatedImages);
    setValidImages(validatedImages);
    
    // Reset selected image if out of bounds
    if (selectedImage >= validatedImages.length) {
      setSelectedImage(0);
    }
  }, [images, selectedImage]);
  
  // If no valid images, show placeholder
  if (!validImages || validImages.length === 0) {
    console.log("ProductImages - Showing placeholder for:", name);
    return (
      <div className="rounded-lg overflow-hidden mb-4 bg-gray-100 flex items-center justify-center h-[400px]">
        <div className="text-4xl text-gray-400">{name.charAt(0)}</div>
      </div>
    );
  }
  
  const handleImageError = (index: number) => {
    console.error(`Error loading image at index ${index}:`, validImages[index]);
    
    // Remove the invalid image from the array
    setValidImages(prev => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
    
    // Update selected image if needed
    if (selectedImage >= validImages.length - 1) {
      setSelectedImage(Math.max(0, validImages.length - 2));
    } else if (index === selectedImage) {
      setSelectedImage(0);
    }
  };
  
  return (
    <div>
      <div className="rounded-lg overflow-hidden mb-4 bg-white">
        <img 
          src={validImages[selectedImage]} 
          alt={name} 
          className="w-full h-[400px] object-contain"
          onError={() => handleImageError(selectedImage)}
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
                onError={() => handleImageError(index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
