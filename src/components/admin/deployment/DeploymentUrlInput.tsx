
import { useState } from "react";
import { Link } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DeploymentUrlInputProps {
  deployUrl: string;
  setDeployUrl: (url: string) => void;
  onSave: () => void;
}

const DeploymentUrlInput = ({
  deployUrl,
  setDeployUrl,
  onSave,
}: DeploymentUrlInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    onSave();
    setIsEditing(false);
    toast({
      title: "Deployment URL saved",
      description: "Your Vercel deployment webhook URL has been saved"
    });
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="deployment-url">Vercel Deployment Webhook URL</Label>
      <div className="flex gap-2">
        <Input
          id="deployment-url"
          type="url"
          value={deployUrl}
          onChange={(e) => setDeployUrl(e.target.value)}
          disabled={!isEditing}
          placeholder="https://api.vercel.com/v1/integrations/deploy/..."
        />
        {isEditing ? (
          <Button onClick={handleSave}>Save</Button>
        ) : (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        <Link className="h-3 w-3 inline-block mr-1" />
        <a 
          href="https://vercel.com/docs/git/deploy-hooks" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Learn how to create a Vercel deploy hook
        </a>
      </p>
    </div>
  );
};

export default DeploymentUrlInput;
