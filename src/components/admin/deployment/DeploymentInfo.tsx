
const DeploymentInfo = () => {
  return (
    <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
      <p><strong>Important:</strong> To ensure your changes are visible to all users:</p>
      <ol className="list-decimal list-inside mt-2 space-y-1">
        <li>First sync your data to update all users</li>
        <li>Then deploy to Vercel to update the live site</li> 
        <li>Or enable auto-deploy to handle this automatically</li>
      </ol>
    </div>
  );
};

export default DeploymentInfo;
