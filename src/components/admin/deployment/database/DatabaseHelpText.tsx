
const DatabaseHelpText = () => {
  return (
    <div className="text-sm text-gray-500 mt-4 border-t pt-4">
      <p className="mb-2"><strong>Need help?</strong></p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Create a Supabase account at <a href="https://supabase.com" target="_blank" className="text-blue-500 underline">supabase.com</a></li>
        <li>Create a new project</li>
        <li>Find your API credentials in Project Settings &gt; API</li>
        <li>Copy the URL and anon key into the fields above</li>
        <li>Make sure the necessary tables exist in your database</li>
      </ol>
    </div>
  );
};

export default DatabaseHelpText;
