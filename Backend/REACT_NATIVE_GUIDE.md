# Camiones — Phase 3 & 4: React Native Apps

✅ **Phase 1 & 2:** Backend complete (auth + job matching)
⏳ **Phase 3 & 4:** Farmer & Driver React Native apps

## Quick Start

### 1. Create Apps

```bash
cd "c:\Users\Hernando\Downloads\CAMIONES QUICK TESTING"

# Farmer App
npx create-expo-app farmer-app
cd farmer-app
npm install axios @react-native-async-storage/async-storage @react-navigation/native @react-navigation/bottom-tabs react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
cd ..

# Driver App
npx create-expo-app driver-app
cd driver-app
npm install axios @react-native-async-storage/async-storage @react-navigation/native @react-navigation/bottom-tabs react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
cd ..
```

### 2. Start Testing

**Terminal 1 - Farmer App:**
```bash
cd farmer-app
npm start
# Press 'a' for Android
```

**Terminal 2 - Driver App:**
```bash
cd driver-app
npm start
# Press 'a' for Android
```

## App Structure

### Farmer App Features
- **Auth Screen** — Login/Signup
- **Post Job Screen** — Create job with location
- **My Jobs Screen** — View posted jobs + requests
- **Job Details Screen** — See driver requests, accept/reject
- **Profile Screen** — Ratings & settings

### Driver App Features
- **Auth Screen** — Login/Signup
- **Browse Jobs Screen** — Map view of nearby jobs
- **Job Details Screen** — Apply for job
- **My Jobs Screen** — Active/completed jobs
- **Profile Screen** — Ratings & settings

## API Configuration

Backend URL: `http://10.0.2.2:3000` (Android emulator)
Or `http://localhost:3000` (physical device on same network)

---

**Next:** I'll create the app boilerplates with:
- Auth context
- API client
- Navigation structure
- Screen templates
