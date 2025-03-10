
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AutoDeployToggleProps {
  autoDeploy: boolean;
  onToggle: (checked: boolean) => void;
}

const AutoDeployToggle = ({ autoDeploy, onToggle }: AutoDeployToggleProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Switch
          id="auto-deploy"
          checked={autoDeploy}
          onCheckedChange={onToggle}
        />
        <Label htmlFor="auto-deploy">Auto-deploy when content changes</Label>
      </div>
      <p className="text-xs text-muted-foreground ml-10">
        When enabled, changes will automatically be written to the codebase and deployed
      </p>
    </div>
  );
};

export default AutoDeployToggle;
