# Camiones — Unified Mobile App
## Final Consolidated Version

One app. Two roles. Login detects farmer/driver → shows appropriate UI.

---

## 📁 Project Structure

```
camiones-app/
├── App.js                    # Main entry point & navigation
├── package.json             
├── src/
│   ├── api.js               # All API calls (both roles)
│   ├── AuthContext.js       # Auth state & login logic
│   ├── LoginScreen.js       # Unified login (role selector)
│   │
│   ├── shared/
│   │   └── JobDetailScreen.js    # Used by both (read-only)
│   │
│   ├── farmer/
│   │   ├── FarmerHome.js         # Tab navigator
│   │   ├── PostJobScreen.js      # Create job
│   │   └── FarmerJobsScreen.js   # My jobs + manage requests
│   │
│   └── driver/
│       ├── DriverHome.js         # Tab navigator
│       ├── BrowseJobsScreen.js   # Search nearby jobs
│       └── DriverJobsScreen.js   # My active jobs
```

---

## 🚀 Quick Start

### 1. Setup
```bash
cd "c:\Users\Hernando\Downloads\CAMIONES QUICK TESTING"
npx create-expo-app camiones-app
cd camiones-app
npm install axios @react-native-async-storage/async-storage @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
```

### 2. Update package.json
Set `"main": "App.js"` (not `expo-router/entry`)

### 3. Start
```bash
npm start
# Press 'a' for Android
```

---

## 🔄 How It Works

**Login Flow:**
1. User enters email + password + selects role (Farmer/Driver)
2. Auth context stores `userType` + token
3. Navigation checks `userType`:
   - `farmer` → Shows FarmerHome (Post Job + My Jobs tabs)
   - `driver` → Shows DriverHome (Browse + My Jobs tabs)

**Both roles use same:**
- API client (has all endpoints)
- Job detail view (read-only)
- Auth system

---

## 📱 Farmer Flow

1. **Login** → Farmer Home
2. **Post Job Tab**
   - Form: title, description, locations (lat/lng), payment
   - Submit → Job posted
3. **My Jobs Tab**
   - List all posted jobs
   - Pull to refresh
   - Tap job → See requests from drivers
   - Accept driver → Job status → Accepted

---

## 🚗 Driver Flow

1. **Login** → Driver Home
2. **Browse Tab**
   - Enter lat/lng (or use current location)
   - See nearby jobs sorted by distance
   - Tap job → View details + farmer info
   - Request job → Waits for farmer response
3. **My Jobs Tab**
   - See accepted jobs
   - Can mark as complete
   - Pull to refresh

---

## 🔐 Environment

Update `src/api.js`:
```javascript
// Development (Android emulator):
const API_BASE_URL = 'http://10.0.2.2:3000';

// Production (replace with deployed backend):
const API_BASE_URL = 'https://camiones-backend.onrender.com';
```

---

## 📦 Build APK

```bash
npm install -g eas-cli
eas build --platform android --local
```

Output: `camiones-app-debug.apk` (installable on any Android phone)

---

## 🧪 Test Credentials

**Farmer:**
- Email: farmer3@test.com
- Password: password123

**Driver:**
- Email: driver2@test.com
- Password: password123

---

## ✨ Features

- ✅ Role-based UI (farmer vs driver)
- ✅ Job posting with geo-tagging
- ✅ Geo-proximity job search (distance calculation)
- ✅ Job request management
- ✅ Pull-to-refresh
- ✅ Material Design UI
- ✅ Cross-platform (iOS/Android)
- ✅ AsyncStorage for offline tokens
- ✅ JWT authentication

---

## 📊 Tech Stack

- **Frontend:** React Native (Expo SDK 54)
- **Backend:** Node.js + Express (already running)
- **Database:** Supabase PostgreSQL
- **Navigation:** React Navigation v6
- **State:** React Context API
- **HTTP:** Axios
- **Storage:** AsyncStorage

---

## 🎯 Deployment Checklist

- [ ] Backend deployed to Render/Railway
- [ ] Update `API_BASE_URL` to deployed backend
- [ ] Build APK: `eas build --platform android`
- [ ] Create Google Play Store listings
- [ ] Upload APK + screenshots
- [ ] Publish

---

## 📋 Files Ready to Copy

All screen files from `farmer-app/src/` + `driver-app/src/` can be organized into the structure above. Just organize by role folder.

---

**Status: ✅ READY FOR DEPLOYMENT**
