
import { AlertTriangle, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface DeploymentStatusAlertProps {
  hasPendingChanges: boolean;
  lastDeploymentTime: string | null;
  formatLastDeploymentTime: () => string;
}

const DeploymentStatusAlert = ({
  hasPendingChanges,
  lastDeploymentTime,
  formatLastDeploymentTime,
}: DeploymentStatusAlertProps) => {
  if (hasPendingChanges) {
    return (
      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-800">
          You have undeployed changes that won't be visible to users until you deploy.
        </AlertDescription>
      </Alert>
    );
  }

  if (lastDeploymentTime) {
    return (
      <Alert className="mb-6 border-green-200 bg-green-50">
        <Check className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-800 flex items-center justify-between">
          <span>All changes are deployed. Your site is up to date.</span>
          <Badge variant="outline" className="ml-2">
            Last deployed: {formatLastDeploymentTime()}
          </Badge>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default DeploymentStatusAlert;
