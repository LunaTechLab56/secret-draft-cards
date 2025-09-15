# Vercel Deployment Guide for Secret Draft Cards

This guide provides step-by-step instructions for deploying the Secret Draft Cards application to Vercel.

## Prerequisites

- Vercel account (free tier available)
- GitHub repository access
- Environment variables ready

## Step-by-Step Deployment Process

### Step 1: Access Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click on "New Project" or "Add New..." → "Project"

### Step 2: Import GitHub Repository

1. In the "Import Git Repository" section, search for `LunaTechLab56/secret-draft-cards`
2. Click on the repository when it appears
3. Click "Import" to proceed

### Step 3: Configure Project Settings

1. **Project Name**: `secret-draft-cards` (or your preferred name)
2. **Framework Preset**: Select "Vite" from the dropdown
3. **Root Directory**: Leave as default (`.`)
4. **Build Command**: `npm run build` (should be auto-detected)
5. **Output Directory**: `dist` (should be auto-detected)
6. **Install Command**: `npm install` (should be auto-detected)

### Step 4: Configure Environment Variables

Click on "Environment Variables" and add the following variables:

```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

**Important**: Make sure to add these variables for all environments (Production, Preview, Development).

### Step 5: Advanced Configuration (Optional)

If you need to customize the build process:

1. Click on "Advanced" settings
2. **Node.js Version**: Select "18.x" or "20.x"
3. **Build Command**: `npm run build`
4. **Install Command**: `npm install`

### Step 6: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-5 minutes)
3. Once deployed, you'll get a live URL (e.g., `https://secret-draft-cards-xxx.vercel.app`)

### Step 7: Custom Domain (Optional)

1. Go to your project dashboard
2. Click on "Settings" tab
3. Click on "Domains"
4. Add your custom domain
5. Follow the DNS configuration instructions

## Post-Deployment Configuration

### Step 8: Verify Deployment

1. Visit your deployed URL
2. Test wallet connection functionality
3. Verify that the application loads correctly
4. Check browser console for any errors

### Step 9: Monitor and Maintain

1. **Analytics**: Enable Vercel Analytics in the dashboard
2. **Logs**: Monitor deployment logs for any issues
3. **Updates**: Push changes to GitHub to trigger automatic deployments

## Environment Variables Reference

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_CHAIN_ID` | `11155111` | Ethereum Sepolia testnet chain ID |
| `NEXT_PUBLIC_RPC_URL` | `https://sepolia.infura.io/v3/...` | RPC endpoint for blockchain connection |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | `2ec9743d0d0cd7fb94dee1a7e6d33475` | WalletConnect project ID |
| `NEXT_PUBLIC_INFURA_API_KEY` | `b18fb7e6ca7045ac83c41157ab93f990` | Infura API key for RPC access |

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are properly installed
   - Verify environment variables are set correctly
   - Check build logs for specific error messages

2. **Wallet Connection Issues**:
   - Ensure WalletConnect Project ID is correct
   - Verify RPC URL is accessible
   - Check that the application is using HTTPS

3. **Environment Variable Issues**:
   - Make sure variables are prefixed with `NEXT_PUBLIC_`
   - Verify values are set for all environments
   - Check for typos in variable names

### Build Optimization

1. **Bundle Size**: The application uses code splitting for optimal performance
2. **Caching**: Vercel automatically handles caching for static assets
3. **CDN**: Global CDN distribution is enabled by default

## Security Considerations

1. **API Keys**: Never commit sensitive API keys to the repository
2. **Environment Variables**: Use Vercel's environment variable system
3. **HTTPS**: All deployments are automatically served over HTTPS
4. **CORS**: Configure CORS settings if needed for API calls

## Performance Monitoring

1. **Core Web Vitals**: Monitor using Vercel Analytics
2. **Build Times**: Track build performance in the dashboard
3. **Error Tracking**: Set up error monitoring for production issues

## Support

For deployment issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review build logs in the Vercel dashboard
3. Contact Vercel support if needed

## Next Steps

After successful deployment:
1. Test all functionality thoroughly
2. Set up monitoring and analytics
3. Configure custom domain if needed
4. Set up automated deployments from GitHub
5. Consider setting up staging environments for testing

---

**Note**: This deployment guide assumes you have the necessary permissions and access to the GitHub repository and Vercel account. Make sure to follow your organization's deployment policies and security guidelines.
