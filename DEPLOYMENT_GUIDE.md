# Camiones — Complete Project Guide

## ✅ What's Done

### Phase 1 & 2: Backend (100% Complete & Tested)
- **Express API** with JWT auth
- **Supabase PostgreSQL** database
- **Tested endpoints** (signup, login, post jobs, browse, accept, complete)
- **Production ready** on Render/Railway

### Phase 3 & 4: React Native Apps (100% Complete)
- **Farmer App:**
  - Login/Signup
  - Post Jobs (with geolocation)
  - View Posted Jobs + Requests
  - Accept Driver Requests
  - Pull-to-refresh

- **Driver App:**
  - Login/Signup
  - Browse Nearby Jobs (geo-proximity search)
  - Request Jobs
  - View Active Jobs
  - Complete Jobs
  - Pull-to-refresh

---

## 📱 App Structure

### Farmer App (`farmer-app/`)
```
src/
├── api.js                 # API client
├── AuthContext.js         # Auth state management
├── LoginScreen.js         # Login/Signup
├── PostJobScreen.js       # Create job form
├── MyJobsScreen.js        # List jobs + requests
└── JobDetailScreen.js     # View requests, accept driver
```

### Driver App (`driver-app/`)
```
src/
├── api.js                 # API client
├── AuthContext.js         # Auth state management
├── LoginScreen.js         # Login/Signup
├── BrowseJobsScreen.js    # Search nearby jobs
├── DriverJobDetailScreen.js  # Apply for job, complete
└── MyJobsScreen.js        # Active jobs
```

---

## 🚀 Deployment

### Backend Deployment

**Option 1: Render (Recommended)**
```bash
cd ..
git init
git add .
git commit -m "Camiones backend"
# Push to GitHub
# Connect repo to Render.com
# Deploy
```

Backend URL: `https://camiones-backend.onrender.com`

**Option 2: Railway**
```bash
npm install -g railway
railway link
railway up
```

### App Deployment

#### Build APK (Android)
```bash
# Farmer App
cd farmer-app
eas build --platform android

# Driver App
cd ../driver-app
eas build --platform android
```

#### Deploy to Google Play Store
1. Create Google Play Developer account ($25)
2. Create app listings for "Camiones Farmer" and "Camiones Driver"
3. Upload APKs
4. Publish

#### Deploy to App Store (iOS)
1. Apple Developer account ($99/year)
2. TestFlight for beta testing
3. App Store submission

---

## 🔧 Environment Configuration

JWT_SECRET=your-secret-key
PORT=3000


### Apps (farmer-app/src/api.js & driver-app/src/api.js)
Update `API_BASE_URL`:
```javascript
const API_BASE_URL = 'https://camiones-backend.onrender.com';
```

---

## 📊 API Endpoints

### Auth
- `POST /auth/signup` — Register
- `POST /auth/login` — Login
- `POST /auth/refresh` — Get new token
- `GET /auth/me` — Current user

### Jobs (Farmer)
- `POST /jobs` — Post job
- `GET /jobs/my-posts` — My jobs + requests
- `PATCH /jobs/:jobId/accept` — Accept driver

### Jobs (Driver)
- `GET /jobs` — Browse jobs
- `POST /job-requests` — Request job
- `GET /jobs/my-accepted` — Active jobs
- `PATCH /jobs/:jobId/complete` — Mark done

---

## 🧪 Testing Credentials

**Farmer:** farmer3@test.com / password123
**Driver:** driver2@test.com / password123

---

## 📋 Feature Checklist

- [x] User authentication (email/password)
- [x] Job posting with geolocation
- [x] Geo-proximity job search
- [x] Job request management
- [x] Pull-to-refresh
- [x] Material Design UI
- [x] Cross-platform (iOS/Android)
- [ ] Real-time updates (Phase 5)
- [ ] Ratings & reviews (Phase 5)
- [ ] Push notifications (Phase 5)
- [ ] In-app messaging (Phase 5)

---

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL + Auth)
- JWT tokens

**Frontend:**
- React Native (Expo)
- React Navigation
- AsyncStorage (local auth)
- Axios (HTTP client)

---

## 💡 Future Enhancements

1. **Real-time Updates** — Supabase Realtime
2. **Ratings & Reviews** — Star system, comments
3. **Push Notifications** — Firebase Cloud Messaging
4. **In-app Messaging** — Chat between farmer & driver
5. **Payment Integration** — Stripe/Razorpay
6. **Map Display** — Google Maps integration
7. **Admin Dashboard** — Manage users, jobs, disputes

---

## 📞 Support

For issues or questions:
1. Check API response errors
2. Verify .env configuration
3. Check AsyncStorage for auth tokens
4. Review Supabase logs

---

**Status: ✅ MVP Ready for Deployment**
