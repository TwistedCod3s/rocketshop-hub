
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AutoDeployToggleProps {
  autoDeploy: boolean;
  onToggle: (checked: boolean) => void;
}

const AutoDeployToggle = ({ autoDeploy, onToggle }: AutoDeployToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="auto-deploy"
        checked={autoDeploy}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="auto-deploy">Auto-deploy when content changes</Label>
    </div>
  );
};

export default AutoDeployToggle;
