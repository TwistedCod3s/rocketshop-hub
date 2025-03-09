
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SubcategoryTabsProps {
  subcategories: string[];
  categoryTitle: string;
}

const SubcategoryTabs: React.FC<SubcategoryTabsProps> = ({
  subcategories,
  categoryTitle
}) => {
  if (subcategories.length === 0) {
    return null;
  }
  
  return (
    <Tabs defaultValue="all" className="mb-8">
      <TabsList className="w-full flex overflow-x-auto max-w-full">
        <TabsTrigger value="all" className="flex-shrink-0">All {categoryTitle}</TabsTrigger>
        {subcategories.map(sub => (
          <TabsTrigger key={sub} value={sub} className="flex-shrink-0">{sub}</TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="all">
        {/* All products shown by default */}
      </TabsContent>
      {subcategories.map(sub => (
        <TabsContent key={sub} value={sub}>
          {/* Subcategory specific content would go here */}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default SubcategoryTabs;
