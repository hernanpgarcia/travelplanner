# Render Production Environment Setup Guide

## 📋 Quick Setup Checklist

### 1. Backend Environment Variables (travelplanner-backend)

Log into [Render Dashboard](https://dashboard.render.com) and add these to your **travelplanner-backend** service:

```bash
# Google OAuth (REQUIRED)
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret

# Security (REQUIRED - generate new value)
SECRET_KEY=<generate-using-python-script-below>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database (auto-connected by Render)
# DATABASE_URL will be automatically set by Render

# Application Settings
ENVIRONMENT=production
DEBUG=false
APP_NAME=TravelPlanner

# CORS (replace with your frontend URL)
ALLOWED_ORIGINS=https://travelplanner-frontend.onrender.com

# Frontend URL for OAuth redirects
FRONTEND_URL=https://travelplanner-frontend.onrender.com
```

### 2. Frontend Environment Variables (travelplanner-frontend)

Add these to your **travelplanner-frontend** service:

```bash
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com

# Backend API URL
VITE_API_URL=https://travelplanner-backend.onrender.com
```

## 🔐 Generate SECRET_KEY

Run this Python script to generate a secure SECRET_KEY:

```python
import secrets
print(secrets.token_urlsafe(32))
```

Or use this bash command:
```bash
openssl rand -base64 32
```

## 🚀 Step-by-Step Instructions

### Step 1: Get Your Service URLs

1. Go to your Render dashboard
2. Note down your service URLs:
   - Frontend: `https://travelplanner-frontend.onrender.com` (or your custom domain)
   - Backend: `https://travelplanner-backend.onrender.com`

### Step 2: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create new)
3. Go to **APIs & Services** → **Credentials**
4. Click **CREATE CREDENTIALS** → **OAuth client ID**
5. Configure:
   - Application type: **Web application**
   - Name: **TravelPlanner Production**
   - Authorized JavaScript origins:
     - `https://travelplanner-frontend.onrender.com`
   - Authorized redirect URIs:
     - `https://travelplanner-frontend.onrender.com/auth/callback`
     - `https://travelplanner-backend.onrender.com/api/v1/auth/callback`
6. Save and copy the **Client ID** and **Client Secret**

### Step 3: Configure Backend in Render

1. Go to Render Dashboard → **travelplanner-backend**
2. Navigate to **Environment** tab
3. Add each variable:
   - Click **Add Environment Variable**
   - Enter key and value
   - Click **Save**
4. Required variables:
   ```
   GOOGLE_CLIENT_ID = [your-client-id]
   GOOGLE_CLIENT_SECRET = [your-client-secret]
   SECRET_KEY = [generated-secret-key]
   ALGORITHM = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 1440
   ENVIRONMENT = production
   DEBUG = false
   APP_NAME = TravelPlanner
   ALLOWED_ORIGINS = https://travelplanner-frontend.onrender.com
   FRONTEND_URL = https://travelplanner-frontend.onrender.com
   ```

### Step 4: Configure Frontend in Render

1. Go to Render Dashboard → **travelplanner-frontend**
2. Navigate to **Environment** tab
3. Add variables:
   ```
   VITE_GOOGLE_CLIENT_ID = [same-client-id-as-backend]
   VITE_API_URL = https://travelplanner-backend.onrender.com
   ```

### Step 5: Update Backend Code

The backend has a hardcoded redirect URI that needs updating. In `backend/app/main_simple.py`, find and update:

```python
# Around line 80-90, update:
redirect_uri = "https://travelplanner-frontend.onrender.com/auth/callback"
```

### Step 6: Deploy Changes

1. Commit and push the redirect URI change:
   ```bash
   git add backend/app/main_simple.py
   git commit -m "fix: Update OAuth redirect URI for production"
   git push origin main
   ```

2. Services will auto-deploy (watch in Render dashboard)

### Step 7: Test Authentication

1. Wait for both services to finish deploying
2. Visit your frontend URL
3. Click "Sign in with Google"
4. Complete OAuth flow
5. Verify you're redirected back and logged in

## 🐛 Common Issues & Solutions

### "Google Client ID not configured"
- Verify env vars are saved in Render
- Check service logs for startup errors
- Ensure service has redeployed after adding vars

### "redirect_uri_mismatch"
- Double-check URLs in Google Console match exactly
- Look for http vs https differences
- Check for trailing slashes
- Verify the redirect_uri in backend code

### CORS errors
- Ensure ALLOWED_ORIGINS matches your frontend URL exactly
- Include protocol (https://)
- Don't include trailing slash

### "Failed to fetch" from frontend
- Verify VITE_API_URL is correct
- Check backend service is running
- Look at backend logs for errors

## 📊 Database Connection

The PostgreSQL database connection is handled automatically by Render:
- Render sets `DATABASE_URL` environment variable
- The backend reads this automatically
- No manual configuration needed

## 🔒 Security Notes

1. **Never expose** `GOOGLE_CLIENT_SECRET` in frontend code
2. **Always use HTTPS** in production
3. **Rotate** your `SECRET_KEY` periodically
4. **Monitor** failed authentication attempts
5. **Keep** your Google OAuth credentials secure

## ✅ Final Checklist

- [ ] Google OAuth credentials created
- [ ] Backend environment variables set
- [ ] Frontend environment variables set
- [ ] Redirect URIs updated in Google Console
- [ ] Backend redirect_uri updated in code
- [ ] Changes deployed
- [ ] Authentication tested end-to-end

## 🆘 Need Help?

1. Check Render service logs for errors
2. Use browser DevTools to check network requests
3. Verify all URLs are using HTTPS
4. Ensure all environment variables are set correctly