
import { useState } from "react";

interface ProductImagesProps {
  images: string[];
  name: string;
}

const ProductImages = ({ images, name }: ProductImagesProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  return (
    <div>
      <div className="rounded-lg overflow-hidden mb-4 bg-white">
        <img 
          src={images[selectedImage]} 
          alt={name} 
          className="w-full h-[400px] object-contain"
        />
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
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
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
