
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useShopContext } from "@/context/ShopContext";

// Updated categories list for the form
const CATEGORIES = [
  "Rocket Kits",
  "Engines",
  "Tools",
  "Materials",
  "UKROC",
  "Accessories"
];

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const { subcategories } = useShopContext();
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    fullDescription: "",
    price: 0,
    category: "",
    subcategory: "",
    inStock: true,
    featured: false,
    rating: 0,
    images: [""],
    specifications: [{ name: "", value: "" }],
    reviews: []
  });
  
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        // Ensure arrays are populated
        images: product.images?.length ? product.images : [""],
        specifications: product.specifications?.length 
          ? product.specifications 
          : [{ name: "", value: "" }]
      });
    } else {
      // Generate a UUID for new products
      setFormData(prev => ({ ...prev, id: uuidv4() }));
    }
  }, [product]);
  
  // Update available subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      setAvailableSubcategories(subcategories[formData.category] || []);
      
      // If current subcategory is not in the new list, reset it
      if (formData.subcategory && !subcategories[formData.category]?.includes(formData.subcategory)) {
        setFormData(prev => ({ ...prev, subcategory: "" }));
      }
    } else {
      setAvailableSubcategories([]);
    }
  }, [formData.category, subcategories]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePriceChange = (e) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) value = 0;
    setFormData(prev => ({ ...prev, price: value }));
  };
  
  const handleToggleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };
  
  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }));
  };
  
  const removeImage = (index) => {
    if (formData.images.length <= 1) return;
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };
  
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };
  
  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { name: "", value: "" }]
    }));
  };
  
  const removeSpecification = (index) => {
    if (formData.specifications.length <= 1) return;
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up empty fields
    const cleanedData = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ""),
      specifications: formData.specifications.filter(spec => 
        spec.name.trim() !== "" && spec.value.trim() !== ""
      )
    };
    
    // Ensure at least one image
    if (cleanedData.images.length === 0) {
      cleanedData.images = ["/placeholder.svg"];
    }
    
    onSubmit(cleanedData);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={onCancel}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">
            {product ? "Edit Product" : "Add New Product"}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handlePriceChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Short Description</Label>
              <Textarea 
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="fullDescription">Full Description</Label>
              <Textarea 
                id="fullDescription"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                rows={6}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleToggleChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(value) => handleToggleChange("subcategory", value)}
                  disabled={!formData.category || availableSubcategories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !formData.category 
                        ? "Select a category first" 
                        : availableSubcategories.length === 0
                          ? "No subcategories available"
                          : "Select a subcategory"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubcategories.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input 
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex items-center space-x-8 mt-8">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={formData.inStock} 
                    onCheckedChange={(checked) => handleToggleChange("inStock", checked)}
                    id="in-stock"
                  />
                  <Label htmlFor="in-stock">In Stock</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={formData.featured} 
                    onCheckedChange={(checked) => handleToggleChange("featured", checked)}
                    id="featured"
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </div>
            </div>
            
            {/* Images */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label>Product Images</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addImage}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Image
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Image URL"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeImage(index)}
                      disabled={formData.images.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Enter image URLs or relative paths to images
              </p>
            </div>
            
            {/* Specifications */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label>Specifications</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addSpecification}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Specification
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2">
                    <div className="col-span-2">
                      <Input 
                        value={spec.name}
                        onChange={(e) => handleSpecChange(index, "name", e.target.value)}
                        placeholder="Specification name"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input 
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                        placeholder="Specification value"
                      />
                    </div>
                    <div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full h-full"
                        onClick={() => removeSpecification(index)}
                        disabled={formData.specifications.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {product ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
