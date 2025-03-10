
const DeploymentInfo = () => {
  return (
    <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
      <p><strong>Important:</strong> Changes in the admin panel are now automatically stored in the codebase:</p>
      <ol className="list-decimal list-inside mt-2 space-y-1">
        <li>When you deploy, your changes become part of the website's source code</li>
        <li>This ensures all users see the same content without sync issues</li> 
        <li>Your changes will be included in all future deployments automatically</li>
      </ol>
    </div>
  );
};

export default DeploymentInfo;
