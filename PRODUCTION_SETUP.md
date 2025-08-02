# Production Environment Setup

This guide explains how to configure TravelPlanner for production deployment, especially the environment variables needed for authentication to work.

## 🚨 Required Environment Variables

Since `.env` files are not committed (for security), you must configure these variables in your production environment.

### Backend Environment Variables (Render)

Add these to your Render service environment variables:

```bash
# Google OAuth (REQUIRED for authentication)
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret

# Security (REQUIRED - generate new values for production)
SECRET_KEY=generate-a-secure-random-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database (if using Phase 2+)
DATABASE_URL=your-production-database-url

# Application Settings
ENVIRONMENT=production
DEBUG=false
APP_NAME=TravelPlanner

# CORS (update with your frontend URL)
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Frontend Environment Variables

For the frontend, you typically set these in your build process:

```bash
# Google OAuth (same client ID as backend)
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com

# API URL (your backend URL)
VITE_API_URL=https://your-backend-url.onrender.com
```

## Step-by-Step Setup

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - `https://your-frontend-domain.com/auth/callback`
     - `https://your-backend-url.onrender.com/api/v1/auth/callback`

### 2. Configure Render Backend

In your Render dashboard:

1. Go to your service → Environment
2. Add each environment variable from the list above
3. For `SECRET_KEY`, generate a secure key:
   ```python
   import secrets
   print(secrets.token_urlsafe(32))
   ```

### 3. Configure Frontend Build

If using Vercel/Netlify:
- Add `VITE_GOOGLE_CLIENT_ID` to environment variables
- Add `VITE_API_URL` pointing to your Render backend

If building locally:
- Create `.env.production` (don't commit this!)
- Add the variables there
- Build with: `npm run build`

### 4. Update OAuth Redirect URIs

**CRITICAL**: Update your Google OAuth settings with production URLs:

1. Go to Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add Authorized redirect URIs:
   - `https://your-production-domain.com/auth/callback`
   - Remove or keep localhost URIs for development

### 5. Update Backend Code (if needed)

The backend currently has hardcoded redirect URIs. Update these in production:

```python
# In backend/app/main_simple.py, update:
redirect_uri = "https://your-production-domain.com/auth/callback"
```

## Security Checklist

- [ ] Generate new `SECRET_KEY` for production
- [ ] Set `DEBUG=false` in production
- [ ] Use HTTPS for all URLs
- [ ] Restrict CORS origins to your frontend domain
- [ ] Keep `GOOGLE_CLIENT_SECRET` secure (never expose in frontend)
- [ ] Enable rate limiting in production
- [ ] Set up monitoring for failed auth attempts

## Testing Production Auth

1. Deploy backend with environment variables
2. Deploy frontend with environment variables
3. Test the flow:
   - Visit your site
   - Click "Sign in with Google"
   - Complete OAuth flow
   - Verify redirect back to your app
   - Check that user data is displayed

## Troubleshooting

### "Google Client ID not configured"
- Verify `GOOGLE_CLIENT_ID` is set in Render environment
- Check Render logs to confirm env vars are loaded

### "redirect_uri_mismatch" 
- Ensure OAuth redirect URIs in Google Console match exactly
- Check for http vs https mismatches
- Verify trailing slashes match

### Authentication fails silently
- Check browser console for errors
- Verify CORS settings allow your frontend
- Check Render logs for backend errors

### "Failed to fetch" errors
- Verify `VITE_API_URL` points to correct backend
- Check CORS configuration
- Ensure backend is running and healthy

## Environment-Specific Settings

### Development (.env.local)
```bash
VITE_GOOGLE_CLIENT_ID=dev-client-id
VITE_API_URL=http://localhost:8000
```

### Staging (.env.staging) 
```bash
VITE_GOOGLE_CLIENT_ID=staging-client-id
VITE_API_URL=https://travelplanner-staging.onrender.com
```

### Production (.env.production)
```bash
VITE_GOOGLE_CLIENT_ID=prod-client-id
VITE_API_URL=https://travelplanner-api.onrender.com
```

## Important Notes

1. **Never commit .env files** - Use platform-specific environment variable management
2. **Rotate secrets regularly** - Update SECRET_KEY periodically
3. **Monitor OAuth usage** - Check Google Cloud Console for usage/quotas
4. **Test thoroughly** - OAuth flow can break with small configuration mistakes
5. **Keep backups** - Document your environment variables securely

## Next Steps

Once authentication is working:
1. Set up database (Phase 2)
2. Enable full backend features (Phase 3)
3. Add monitoring and analytics
4. Implement rate limiting
5. Set up automated backups