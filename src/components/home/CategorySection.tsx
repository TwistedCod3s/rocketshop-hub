
import { Link } from "react-router-dom";
import { CATEGORY_MAP } from "@/constants/categories";

const CategorySection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-rocketry-navy mb-8">
          Shop By Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(CATEGORY_MAP).map(([slug, name]) => (
            <Link 
              to={`/category/${slug}`} 
              key={slug}
              className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square rounded-full bg-gray-100 flex items-center justify-center mb-3 mx-auto" style={{ width: '80px' }}>
                <span className="text-2xl text-rocketry-navy">
                  {name.charAt(0)}
                </span>
              </div>
              <h3 className="font-medium text-rocketry-navy">{name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
