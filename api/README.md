
# API Filesystem Endpoint

This directory contains the serverless function that handles filesystem operations for the admin dashboard.

## How it works

The `filesystem.js` file contains a serverless function that:

1. Reads files from the filesystem (GET requests)
2. Writes files to the filesystem (POST requests)

## Requirements

For this function to work properly, you must:

1. Set the `VERCEL_FILESYSTEM_API_ENABLED=true` environment variable in your Vercel project settings
2. Deploy to Vercel with the correct configuration in `vercel.json`

## Configuration

The `vercel.json` file includes:

```json
{
  "functions": {
    "api/filesystem.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "build": {
    "env": {
      "VERCEL_FILESYSTEM_API_ENABLED": "true"
    }
  },
  "outputDirectory": "dist"
}
```

This configuration:
- Allocates more memory to the filesystem function (1024 MB)
- Increases the execution timeout (10 seconds)
- Sets the build-time environment variable
- Specifies the output directory for the build

## Troubleshooting

If you encounter issues:

1. Check that `VERCEL_FILESYSTEM_API_ENABLED=true` is set in your Vercel project's Environment Variables
2. Look at the function logs in your Vercel dashboard
3. Ensure your project is using Node.js 18.x or later
4. Verify that your deployment hook has proper permissions
