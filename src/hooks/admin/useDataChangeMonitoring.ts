
import { useEffect } from "react";

export function useDataChangeMonitoring(
  categoryImages: Record<string, string>,
  subcategories: Record<string, string[]>,
  coupons: any[],
  autoDeployEnabled: boolean,
  reloadAllAdminData: (triggerDeploy?: boolean) => Promise<boolean>
) {
  // Debug logging for state changes
  useEffect(() => {
    console.log("useAdmin: categoryImages updated", categoryImages);
    // If auto-deploy is enabled, schedule a deployment when data changes
    if (autoDeployEnabled && Object.keys(categoryImages).length > 0) {
      const pendingChanges = localStorage.getItem('ROCKETRY_SHOP_CHANGES_PENDING');
      if (pendingChanges === 'true') {
        console.log("Auto-deploy: Changes detected, scheduling deployment");
        setTimeout(() => reloadAllAdminData(true), 2000);
      }
    }
  }, [categoryImages, autoDeployEnabled, reloadAllAdminData]);

  useEffect(() => {
    console.log("useAdmin: subcategories updated", subcategories);
  }, [subcategories]);

  useEffect(() => {
    console.log("useAdmin: coupons updated", coupons);
  }, [coupons]);
}
