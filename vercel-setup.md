
# Vercel Deployment Setup Guide

This guide provides step-by-step instructions for deploying your admin panel to Vercel with the filesystem API integration.

## 1. Recommended Approach: Use vercel.json

The simplest way to enable filesystem access is by adding a `vercel.json` configuration file to your project:

1. Create a file named `vercel.json` in the root directory of your project
2. Add the following content to the file:

```json
{
  "functions": {
    "api/*.js": {
      "includeFiles": "src/data/**/*.{json,js,ts}"
    }
  },
  "build": {
    "env": {
      "VERCEL_FILESYSTEM_API_ENABLED": "true"
    }
  }
}
```

3. Commit and push this file to your repository
4. Redeploy your project on Vercel

This configuration enables filesystem access for your API functions but only includes necessary data files. This approach works for all Vercel plans and helps avoid the serverless function size limit of 250 MB.

## 2. Create a Deployment Hook

Next, you need to create a deployment hook in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to Project Settings → Git Integration
3. Scroll down to "Deploy Hooks" section
4. Click "Create Hook"
5. Name it "Admin Panel Trigger"
6. Select the branch you want to deploy (usually `main` or `master`)
7. Click "Create"
8. Copy the generated URL (looks like `https://api.vercel.com/v1/integrations/deploy/...`)
9. Go to your admin panel's Deployment Settings
10. Paste this URL into the "Deployment URL" field and save it

## 3. Troubleshooting Size Limits

If you're still encountering the 250 MB serverless function size limit:

1. Be more specific with the `includeFiles` pattern in `vercel.json` to only include necessary files
2. Consider removing large dependencies from your API routes
3. Use dynamic imports to reduce the initial bundle size
4. Add output configuration in `vercel.json`:

```json
{
  "functions": {
    "api/*.js": {
      "includeFiles": "src/data/**/*.{json,js,ts}"
    }
  },
  "build": {
    "env": {
      "VERCEL_FILESYSTEM_API_ENABLED": "true"
    }
  },
  "output": {
    "clean": true
  }
}
```

## 4. Alternative Approaches

If the vercel.json approach doesn't work for your specific setup, here are alternative methods:

### Alternative 1: Use a Database Instead of Filesystem

If you still can't get filesystem access working, consider using a database:

1. Create a database using Vercel KV, Vercel Postgres, or another service
2. Modify your admin panel code to store data in the database instead of files
3. Update your API endpoints to read/write from the database

This approach requires more code changes but may be more reliable in the long term.

### Alternative 2: Use GitHub API for Changes

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

## 5. Testing Your Setup

After deployment:

1. Log in to your admin panel
2. Make a change to your content
3. Use the "Deploy Now" button
4. Check the Function Logs in Vercel to debug any issues

For more information, see the [Vercel documentation on Serverless Functions](https://vercel.com/docs/functions).
