
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SortOptionsProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
  productCount: number;
}

const SortOptions: React.FC<SortOptionsProps> = ({ sortBy, setSortBy, productCount }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">
        {productCount} Product{productCount !== 1 ? 's' : ''}
      </h2>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortOptions;
