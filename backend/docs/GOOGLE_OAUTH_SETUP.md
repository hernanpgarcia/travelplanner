# Google OAuth Setup Guide

This guide explains how to set up Google OAuth 2.0 authentication for TravelPlanner.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. A project created in GCP Console
3. Access to configure OAuth 2.0 credentials

## Step 1: Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. If prompted, configure the OAuth consent screen first:
   - Choose "External" for user type
   - Fill in application name: "TravelPlanner"
   - Add authorized domains: `localhost` (for development)
   - Add your production domain when deploying
6. For Application type, select "Web application"
7. Add authorized redirect URIs:
   - For development:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:8000/api/v1/auth/callback`
   - For production: Add your production URLs

## Step 2: Configure Environment Variables

Copy the Client ID and Client Secret from Google Cloud Console and add them to your `.env` file:

```bash
# Backend .env file
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

```bash
# Frontend .env file
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

## Step 3: OAuth Flow

The authentication flow works as follows:

1. **User clicks "Sign in with Google"**
   - Frontend calls `/api/v1/auth/google/url`
   - Backend returns Google OAuth URL
   - Frontend redirects to Google

2. **User authorizes on Google**
   - Google redirects to `/auth/callback` with authorization code
   - Frontend captures the code and state

3. **Frontend exchanges code for token**
   - Frontend sends code to `/api/v1/auth/google`
   - Backend exchanges code for Google access token
   - Backend fetches user info from Google
   - Backend returns app JWT token and user info

4. **Frontend stores authentication**
   - Stores JWT token in localStorage
   - Stores user info
   - Redirects to dashboard

## Step 4: Testing

1. Start the backend:
   ```bash
   cd backend
   uvicorn app.main_simple:app --reload --port 8000
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to `http://localhost:3000`
4. Click "Sign in with Google"
5. Complete the OAuth flow

## Security Considerations

1. **Production Setup**:
   - Use HTTPS for all redirect URIs
   - Store secrets securely (use environment variables)
   - Implement proper CORS configuration
   - Use secure session management

2. **Token Management**:
   - Implement token refresh mechanism
   - Set appropriate token expiration times
   - Clear tokens on logout

3. **User Data**:
   - Only request necessary scopes
   - Store minimal user data
   - Follow GDPR/privacy regulations

## Troubleshooting

### "Google Client ID not configured"
- Ensure `GOOGLE_CLIENT_ID` is set in backend `.env`
- Restart the backend server after adding environment variables

### "Failed to exchange code for token"
- Verify Client Secret is correct
- Check redirect URI matches exactly
- Ensure the authorization code hasn't expired

### "Authentication failed"
- Check browser console for detailed errors
- Verify CORS settings allow frontend origin
- Check network tab for failed requests

## Production Deployment

When deploying to production:

1. Update authorized redirect URIs in Google Cloud Console
2. Set production environment variables
3. Use HTTPS for all endpoints
4. Configure proper CORS origins
5. Enable rate limiting on auth endpoints