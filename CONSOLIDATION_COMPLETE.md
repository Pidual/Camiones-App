# Camiones App - Consolidation Complete ✅

## What Was Merged

### Single Role-Based App (camiones-app)
The farmer-app and driver-app have been consolidated into one unified React Native application that handles both user types:

### New Screen Structure
- **src/LoginScreen.js** - Unified login/signup with role selector (Farmer/Driver)
- **src/AuthContext.js** - Unified auth context managing both user types
- **src/api.js** - Unified API client with all endpoints

#### Farmer Screens
- **FarmerJobsScreen.js** - List of posted jobs with pull-to-refresh
- **FarmerPostJobScreen.js** - Create new jobs with pickup/dropoff locations
- **FarmerJobDetailScreen.js** - View job requests and accept drivers

#### Driver Screens
- **DriverBrowseJobsScreen.js** - Search jobs by lat/lng with distance filtering
- **DriverJobsScreen.js** - List of accepted/active jobs
- **DriverJobDetailScreen.js** - View job details and request/complete jobs

### App.js Navigation
- Role-based router that detects `userType` from AuthContext
- Farmers see: Jobs + Post tabs (green theme #4CAF50)
- Drivers see: Browse + Active tabs (blue theme #2196F3)
- Separate detail screens for each role

## Ready for Deployment

✅ Backend: Express + Supabase (tested, production-ready)
✅ Database: PostgreSQL schema with RLS policies
✅ Mobile App: Single role-based Expo app (SDK 54)
✅ Documentation: Complete guides for setup/deployment

## Next Steps

1. **Install dependencies:** `cd camiones-app && npm install`
2. **Start dev:** `npm start`
3. **Test locally** (requires Android/iOS setup)
4. **Deploy backend** to Render/Railway
5. **Build APK** for Google Play Store: `eas build --platform android`

## Files to Clean Up (Optional)
- farmer-app/ - delete (code merged)
- driver-app/ - delete (code merged)

## Key Design
- Login detects userType (farmer/driver) and stores in AsyncStorage
- Navigation stack updates header color based on userType
- All API calls unified in api.js with auth token injection
- Haversine distance calculation for geo-proximity search
