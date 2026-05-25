# Camiones Backend - Phase 1 & 2

Farmers & Drivers job matching platform backend.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase

Get your keys from https://supabase.com/dashboard/project/rrgauvytsehzahzggvmi

Fill in `.env`:
```
SUPABASE_URL=https://rrgauvytsehzahzggvmi.supabase.co
SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_KEY=<your_service_key>
JWT_SECRET=your-secret-key
```

### 3. Run Migrations

In Supabase dashboard, go to **SQL Editor** and run `schema.sql`:
- Copy the entire contents of `schema.sql`
- Paste in Supabase SQL Editor
- Execute

This creates:
- `users` table (farmers & drivers)
- `jobs` table (posted jobs)
- `job_requests` table (driver applications)
- `reviews` table (ratings)
- RLS policies & indexes

### 4. Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Auth (Phase 1)
- `POST /auth/signup` - Create account (farmer or driver)
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh JWT token
- `GET /auth/me` - Get current user (requires token)

### Jobs (Phase 2)

**Post a Job (Farmer only):**
```
POST /jobs
Authorization: Bearer <token>
{
  "title": "Transport hay to warehouse",
  "description": "20 bales of hay",
  "pickupLocation": "Farm A",
  "dropoffLocation": "Warehouse B",
  "pickupLat": 40.7128,
  "pickupLng": -74.0060,
  "dropoffLat": 40.7490,
  "dropoffLng": -73.9680,
  "paymentAmount": 50
}
```

**Browse Nearby Jobs (Driver only):**
```
GET /jobs?lat=40.7128&lng=-74.0060&radiusKm=50&status=open
Authorization: Bearer <token>
```
Returns jobs within radius, sorted by distance.

**Get Job Details:**
```
GET /jobs/:jobId
Authorization: Bearer <token>
```

**Request a Job (Driver applies):**
```
POST /job-requests
Authorization: Bearer <token>
{
  "jobId": "uuid"
}
```

**Accept Job Request (Farmer picks driver):**
```
PATCH /jobs/:jobId/accept
Authorization: Bearer <token>
{
  "driverId": "uuid"
}
```

**Get My Posted Jobs (Farmer only):**
```
GET /jobs/my-posts
Authorization: Bearer <token>
```
Returns jobs with all driver requests.

**Get My Accepted Jobs (Driver only):**
```
GET /jobs/my-accepted
Authorization: Bearer <token>
```

**Complete a Job (Driver marks done):**
```
PATCH /jobs/:jobId/complete
Authorization: Bearer <token>
```

### Health Check
- `GET /health` - Server status

## Next Steps

**Phase 3:** Real-time updates with Supabase Realtime
**Phase 4:** React Native apps for farmers & drivers
**Phase 5:** Testing, notifications, deployment
