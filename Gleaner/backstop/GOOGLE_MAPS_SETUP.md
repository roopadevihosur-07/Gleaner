# Google Maps Integration Setup

## Getting Started with Google Maps API

The Gleaner app now includes a live Google Map view for real-time delivery tracking and disruption monitoring.

### Step 1: Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API (optional, for address lookup)
   - Distance Matrix API (optional, for route calculations)

4. Create an API key:
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy your API key

### Step 2: Add API Key to Gleaner

**Option A: Update HTML directly**

Edit `backstop/frontend/index.html`, find this line (around line 8):

```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDemoKey123&libraries=maps,marker"></script>
```

Replace `AIzaSyDemoKey123` with your actual API key:

```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=maps,marker"></script>
```

**Option B: Environment variable (recommended for production)**

1. Create/update `.env` file in the `backstop/` directory:
   ```
   GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```

2. Update `backend/main.py` to inject the key (optional enhancement)

### Step 3: Restart the Server

```bash
cd backstop
source .venv/bin/activate
cd backend
uvicorn main:app --reload
```

### Features Enabled

✅ **Live Agency Markers** - Green dots show partner pickup/delivery locations
✅ **Depot Marker** - Blue dot marks the food bank warehouse
✅ **Route Visualization** - Polylines show planned delivery routes (blue for optimized, gray for naive)
✅ **Dark Theme** - Maps styled to match Gleaner's design system
✅ **Info Windows** - Click markers to see details
✅ **View Toggle** - Switch between Google Maps and SVG view
✅ **Real-time Updates** - Routes update as issues are resolved

### Map Controls

- **Zoom**: Mouse wheel or +/- buttons
- **Pan**: Drag to move around
- **Satellite**: Toggle via map type selector
- **Fullscreen**: Expand to full browser window
- **Search**: Use browser search for locations

### Troubleshooting

**Map not showing?**
- Verify API key is valid
- Check browser console for errors (F12)
- Ensure APIs are enabled in Google Cloud Console
- Verify billing is enabled (free tier includes ~$200 monthly credit)

**Blank map with gray area?**
- API key might be invalid or restricted by IP/domain
- Add domain restrictions in Google Cloud Console if needed

**Missing markers?**
- Ensure `STATE.agencies` and `STATE.depot` are loaded
- Check that latitude/longitude coordinates are valid

### Cost Estimate

Google Maps JavaScript API is free up to certain limits:
- First 28,004 map loads free per month
- Each marker/info window additional load: ~$0.007
- Each route polyline draw: included in map load
- Expected monthly cost: $0-5 for typical food bank usage

### API Quota Limits

- Maps JavaScript API: 25,000 sessions/day (free tier)
- Increase quota in Google Cloud Console if needed

### Security Best Practices

1. **Use HTTP referrer restrictions**
   - In Google Cloud Console, restrict API key to your domain only

2. **Never commit API keys**
   - Add API key to `.env` and `.gitignore`
   - Use environment variables in production

3. **Monitor usage**
   - Set up billing alerts in Google Cloud Console

4. **Rate limiting** (optional)
   - Implement API rate limiting on backend if high traffic

## Next Steps

1. [Get your API key](https://console.cloud.google.com/)
2. Add it to the frontend
3. Restart the server
4. Reload the app in browser
5. Click "Simulate Issue" to see routes on the live map!
