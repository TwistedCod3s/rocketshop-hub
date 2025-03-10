
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

If you still can't find this setting, please contact Vercel support as it may be:
- Only available on certain pricing plans
- Has been renamed in a recent dashboard update
- Requires specific project configuration

## 6. Check API Configuration

Ensure that your application uses the correct API endpoint path:

1. The `/api/filesystem.js` file should be at the root of your project (not in `src/`)
2. Your frontend code should make requests to `/api/filesystem` (handled by `src/utils/fileSystemUtils.ts`)

## 7. Deploy Your Project

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

## Alternative Approach for Pro/Enterprise Users

If you're on a Pro or Enterprise plan and can't find the filesystem access setting:

1. Use the Vercel CLI to deploy with special configuration:
   ```
   vercel deploy --build-env VERCEL_FILESYSTEM_API_ENABLED=true
   ```

2. Or add this to your `vercel.json` configuration file:
   ```json
   {
     "functions": {
       "api/*.js": {
         "includeFiles": "**/*"
       }
     }
   }
   ```

## Important Notes

- The filesystem API only works in production deployments, not in preview deployments
- Changes are written to the repository and trigger a new deployment
- The deployment process might take a few minutes to complete

For more information, see the [Vercel documentation on Serverless Functions](https://vercel.com/docs/functions).

