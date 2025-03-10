
# Vercel Deployment Setup

This project uses Vercel Serverless Functions to handle filesystem operations for the admin panel. Follow these steps to set up the project on Vercel:

## 1. Create a new Vercel project

- Connect your GitHub repository to Vercel
- Use the default settings for a Vite React project

## 2. Configure Build Settings

- Build Command: `npm run build` or `vite build`
- Output Directory: `dist`
- Install Command: `npm install`

## 3. Set Up Environment Variables

For the filesystem API to work properly, you'll need to set these environment variables in your Vercel project settings:

- `VERCEL_FILESYSTEM_API_ENABLED`: Set to `true` to enable filesystem access
- `VERCEL_DEPLOYMENT_HOOK_URL`: Your Vercel deployment webhook URL (generated in step 4)

## 4. Create a Deployment Hook

1. Go to your Vercel project settings
2. Navigate to "Git" tab
3. Scroll down to "Deploy Hooks" section
4. Create a new hook with a name like "Admin Panel Trigger"
5. Copy the generated URL and set it as the `VERCEL_DEPLOYMENT_HOOK_URL` environment variable

## 5. Enable Serverless Function Access

For the API functions to work correctly with filesystem access, you may need to:

1. Go to your Vercel project settings
2. Navigate to "Functions" tab
3. Enable the "Allow filesystem access" option

## 6. Deploy Your Project

After configuring these settings, deploy your project. The admin panel should now be able to write changes directly to the codebase and trigger new deployments.

## Troubleshooting

If you encounter issues with the filesystem API:

1. Check Vercel function logs for specific error messages
2. Ensure all environment variables are correctly set
3. Verify that file paths are relative to the project root
4. Make sure the `api` directory is correctly deployed

For more information, see the [Vercel documentation on Serverless Functions](https://vercel.com/docs/functions).
