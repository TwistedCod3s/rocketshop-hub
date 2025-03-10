
const DeploymentInfo = () => {
  return (
    <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
      <p><strong>Important:</strong> Changes in the admin panel are now automatically stored in the codebase:</p>
      <ol className="list-decimal list-inside mt-2 space-y-1">
        <li>When you deploy, your changes become part of the website's source code</li>
        <li>This ensures all users see the same content without sync issues</li> 
        <li>Your changes will be included in all future deployments automatically</li>
      </ol>
      <p className="mt-2 pt-2 border-t border-gray-200">
        <strong>Vercel Setup:</strong> After deploying to Vercel, set up the environment variables 
        needed for filesystem access in the Vercel dashboard. See the README for details.
      </p>
    </div>
  );
};

export default DeploymentInfo;
