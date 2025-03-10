
import { useEffect } from "react";

export function useDataChangeMonitoring(
  categoryImages: Record<string, string>,
  subcategories: Record<string, string[]>,
  coupons: any[],
  reloadAllAdminData: (triggerDeploy?: boolean) => Promise<boolean>
) {
  // Debug logging for state changes
  useEffect(() => {
    console.log("useAdmin: categoryImages updated", categoryImages);
  }, [categoryImages]);

  useEffect(() => {
    console.log("useAdmin: subcategories updated", subcategories);
  }, [subcategories]);

  useEffect(() => {
    console.log("useAdmin: coupons updated", coupons);
  }, [coupons]);
}
