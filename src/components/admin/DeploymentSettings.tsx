
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useVercelDeployment } from '@/hooks/admin/useVercelDeployment';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DeploymentSettings = () => {
  const { getDeploymentHookUrl, setDeploymentHookUrl, triggerDeployment, isDeploying } = useVercelDeployment();
  const [hookUrl, setHookUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setHookUrl(getDeploymentHookUrl());
  }, [getDeploymentHookUrl]);

  const handleSaveHook = () => {
    // Simple validation to check if it's a valid URL
    try {
      if (hookUrl) {
        new URL(hookUrl);
        setDeploymentHookUrl(hookUrl);
        setSaved(true);
        setError('');
        setTimeout(() => setSaved(false), 3000);
      } else {
        setDeploymentHookUrl('');
        setSaved(true);
        setError('');
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError('Please enter a valid URL');
    }
  };

  const handleTestDeployment = async () => {
    if (!hookUrl) {
      setError('Please enter a deployment hook URL first');
      return;
    }
    
    setError('');
    await triggerDeployment();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vercel Deployment Settings</CardTitle>
        <CardDescription>
          Configure automatic deployments to Vercel when admin changes are made.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {saved && (
          <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Deployment hook URL has been saved</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label htmlFor="hookUrl" className="text-sm font-medium">
            Vercel Deployment Hook URL
          </label>
          <Input
            id="hookUrl"
            value={hookUrl}
            onChange={(e) => setHookUrl(e.target.value)}
            placeholder="https://api.vercel.com/v1/integrations/deploy/..."
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Create a deployment hook in your Vercel project settings and paste the URL here.
          </p>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSaveHook} variant="outline">
            Save Hook URL
          </Button>
          <Button 
            onClick={handleTestDeployment} 
            disabled={isDeploying || !hookUrl}
          >
            {isDeploying ? 'Deploying...' : 'Test Deployment'}
          </Button>
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="text-lg font-medium mb-2">How to set up a Vercel deployment hook:</h3>
          <ol className="list-decimal ml-5 text-sm text-muted-foreground space-y-1">
            <li>Go to your Vercel project dashboard</li>
            <li>Navigate to Settings → Git → Deploy Hooks</li>
            <li>Create a new hook with a name (e.g., "Admin Panel Updates")</li>
            <li>Select the branch you want to deploy (usually "main")</li>
            <li>Copy the generated URL and paste it above</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentSettings;
