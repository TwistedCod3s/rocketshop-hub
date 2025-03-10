
# Vercel Deployment Setup Guide

This guide provides step-by-step instructions for deploying your admin panel to Vercel with the filesystem API integration.

## 1. Create a New Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Connect your GitHub repository
4. Select the repository containing your admin panel application

## 2. Configure Build Settings

Set the following build configurations:
- **Framework Preset**: Vite
- **Build Command**: `npm run build` or `vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 3. Set Up Environment Variables

In your Vercel project settings, add these environment variables:

1. Go to Project Settings → Environment Variables
2. Add the following variables:
   - **Name**: `VERCEL_FILESYSTEM_API_ENABLED`  
     **Value**: `true`
   - **Name**: `VERCEL_DEPLOYMENT_HOOK_URL`  
     **Value**: (You'll create this in the next step)

## 4. Create a Deployment Hook

1. Go to Project Settings → Git Integration
2. Scroll down to "Deploy Hooks" section
3. Click "Create Hook"
4. Name it "Admin Panel Trigger"
5. Select the branch you want to deploy (usually `main` or `master`)
6. Click "Create"
7. Copy the generated URL (looks like `https://api.vercel.com/v1/integrations/deploy/...`)
8. Go back to Environment Variables
9. Add this URL as the value for `VERCEL_DEPLOYMENT_HOOK_URL`

## 5. Enable Filesystem Access for Serverless Functions

### Finding the Filesystem Access Setting

The location of this setting may vary depending on your Vercel account type and UI version:

**Option A: Project Settings → Functions**
1. Go to Project Settings
2. Select "Functions" from the left sidebar
3. Look for a toggle labeled "Allow filesystem access to APIs in the /api directory"
4. Enable this setting

**Option B: Project Settings → General**
1. Go to Project Settings
2. Look under the "General" section
3. Scroll down to find "Serverless Function Settings" or "Function Settings"
4. Look for "Filesystem Access" and enable it

**Option C: Project Settings → Advanced**
1. Go to Project Settings
2. Select "Advanced" from the sidebar
3. Find the "Function Settings" section
4. Enable "Filesystem Access"

## 6. Alternative Approaches (If You Can't Find Filesystem Access Setting)

If you can't locate the filesystem access setting in your Vercel dashboard, you have several alternatives:

### Alternative 1: Use vercel.json Configuration

Create a `vercel.json` file in the root of your project with the following contents:

```json
{
  "functions": {
    "api/*.js": {
      "includeFiles": "**/*"
    }
  },
  "build": {
    "env": {
      "VERCEL_FILESYSTEM_API_ENABLED": "true"
    }
  }
}
```

This configuration enables filesystem access for your API functions and sets the required environment variable.

### Alternative 2: Deploy with Vercel CLI

If you prefer using the command line:

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to your Vercel account:
   ```
   vercel login
   ```

3. Deploy with filesystem access enabled:
   ```
   vercel deploy --build-env VERCEL_FILESYSTEM_API_ENABLED=true
   ```

### Alternative 3: Use a Database Instead of Filesystem

If you still can't get filesystem access working, consider using a database:

1. Create a database using Vercel KV, Vercel Postgres, or another service
2. Modify your admin panel code to store data in the database instead of files
3. Update your API endpoints to read/write from the database

This approach requires more code changes but may be more reliable in the long term.

### Alternative 4: Use GitHub API for Changes

Another approach is to use GitHub's API to commit changes directly to your repository:

1. Create a GitHub personal access token with repo permissions
2. Set up a serverless function that uses the GitHub API to commit changes
3. Configure Vercel to auto-deploy when changes are pushed to your repository

Example code for GitHub API integration:

```javascript
// api/github-commit.js
const { Octokit } = require("@octokit/rest");

module.exports = async (req, res) => {
  const { path, content, message } = req.body;
  
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    
    // Get current file (if exists) to get its SHA
    let fileSha;
    try {
      const { data } = await octokit.repos.getContent({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        path
      });
      fileSha = data.sha;
    } catch (e) {
      // File doesn't exist yet, that's OK
    }
    
    // Create or update file
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path,
      message: message || `Update ${path} via admin panel`,
      content: Buffer.from(content).toString('base64'),
      sha: fileSha
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("GitHub API error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
```

Required environment variables for this approach:
- `GITHUB_TOKEN`: Your GitHub personal access token
- `GITHUB_OWNER`: The owner of the repository (username or organization)
- `GITHUB_REPO`: The name of the repository

## 7. Check API Configuration

Ensure that your application uses the correct API endpoint path:

1. The `/api/filesystem.js` file should be at the root of your project (not in `src/`)
2. Your frontend code should make requests to `/api/filesystem` (handled by `src/utils/fileSystemUtils.ts`)

## 8. Deploy Your Project

1. Click "Deploy" in your Vercel dashboard
2. Wait for the build to complete

## Testing Your Setup

After deployment:

1. Log in to your admin panel
2. Make a change to your content
3. Use the "Deploy Now" button
4. Check the Function Logs in Vercel to debug any issues

## Troubleshooting

If you encounter issues with filesystem access:

1. **Check Function Logs**: Go to Vercel Dashboard → Functions → Invocations
2. **Verify Environment Variables**: Ensure `VERCEL_FILESYSTEM_API_ENABLED` is set to `true`
3. **API Path Issues**: Make sure requests are going to `/api/filesystem` and not `/api/admin/filesystem`
4. **Permissions**: Confirm that "Allow filesystem access" is enabled in Functions settings
5. **Vercel Plan Limitations**: Some features may only be available on paid plans

For more information, see the [Vercel documentation on Serverless Functions](https://vercel.com/docs/functions).
