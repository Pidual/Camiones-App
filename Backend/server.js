import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-prod';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: Sign JWT token
function signToken(userId, userType) {
  return jwt.sign({ userId, userType }, jwtSecret, { expiresIn: '7d' });
}

// Auth Middleware
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
        try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ===== AUTH ENDPOINTS =====

// Signup
app.post('/auth/signup', async (req, res) => {
  const { email, password, phone, userType } = req.body;
  
  if (!email || !password || !userType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const userId = uuidv4();
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Insert user into auth table
    const { error: authError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email,
          phone,
          password_hash: hashedPassword,
          user_type: userType,
          created_at: new Date().toISOString(),
        },
      ]);

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const token = signToken(userId, userType);
    res.json({
      userId,
      email,
      userType,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, password_hash, user_type')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcryptjs.compare(password, data.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(data.id, data.user_type);
    res.json({
      userId: data.id,
      email: data.email,
      userType: data.user_type,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Refresh Token
app.post('/auth/refresh', authMiddleware, (req, res) => {
  const token = signToken(req.userId, req.userType);
  res.json({ token });
});

// Get current user
app.get('/auth/me', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, phone, user_type, created_at')
      .eq('id', req.userId)
      .single();

    if (error) return res.status(404).json({ error: 'User not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== JOBS ENDPOINTS (Phase 2) =====

// Helper: Calculate distance between two coordinates (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Post a job (Farmer only)
app.post('/jobs', authMiddleware, async (req, res) => {
  if (req.userType !== 'farmer') {
    return res.status(403).json({ error: 'Only farmers can post jobs' });
  }

  const {
    title,
    description,
    pickupLocation,
    dropoffLocation,
    pickupLat,
    pickupLng,
    dropoffLat,
    dropoffLng,
    paymentAmount,
  } = req.body;

  if (
    !title ||
    !pickupLocation ||
    !dropoffLocation ||
    pickupLat === undefined ||
    pickupLng === undefined ||
    dropoffLat === undefined ||
    dropoffLng === undefined ||
    !paymentAmount
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const jobId = uuidv4();
    const { error } = await supabase.from('jobs').insert([
      {
        id: jobId,
        farmer_id: req.userId,
        title,
        description,
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        pickup_lat: pickupLat,
        pickup_lng: pickupLng,
        dropoff_lat: dropoffLat,
        dropoff_lng: dropoffLng,
        payment_amount: paymentAmount,
        status: 'open',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({
      jobId,
      title,
      paymentAmount,
      status: 'open',
      message: 'Job posted successfully',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Browse nearby jobs (Driver only)
app.get('/jobs', authMiddleware, async (req, res) => {
  if (req.userType !== 'driver') {
    return res.status(403).json({ error: 'Only drivers can browse jobs' });
  }

  const { lat, lng, radiusKm = 50, status = 'open' } = req.query;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: 'Missing location: lat and lng required' });
  }

  try {
    const driverLat = parseFloat(lat);
    const driverLng = parseFloat(lng);
    const radius = parseFloat(radiusKm);

    const { data: jobs, error } = await supabase
      .from('jobs')
      .select(
        '*, farmer:users(id, email, phone, name, rating)'
      )
      .eq('status', status);

    if (error) return res.status(400).json({ error: error.message });

    // Filter by distance client-side (Supabase PostGIS can do this server-side, but this works for MVP)
    const nearbyJobs = jobs
      .map((job) => ({
        ...job,
        distance: calculateDistance(
          driverLat,
          driverLng,
          job.pickup_lat,
          job.pickup_lng
        ),
      }))
      .filter((job) => job.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    res.json({
      count: nearbyJobs.length,
      radius,
      jobs: nearbyJobs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single job details
app.get('/jobs/:jobId', authMiddleware, async (req, res) => {
  const { jobId } = req.params;

  try {
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*, farmer:users(id, email, phone, name, rating)')
      .eq('id', jobId)
      .single();

    if (error || !job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Request a job (Driver applies)
app.post('/job-requests', authMiddleware, async (req, res) => {
  if (req.userType !== 'driver') {
    return res.status(403).json({ error: 'Only drivers can request jobs' });
  }

  const { jobId } = req.body;

  if (!jobId) {
    return res.status(400).json({ error: 'Missing jobId' });
  }

  try {
    const requestId = uuidv4();
    const { error } = await supabase.from('job_requests').insert([
      {
        id: requestId,
        job_id: jobId,
        driver_id: req.userId,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      if (error.message.includes('duplicate')) {
        return res
          .status(400)
          .json({ error: 'You already requested this job' });
      }
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      requestId,
      jobId,
      status: 'pending',
      message: 'Job request submitted',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept a job request (Farmer picks a driver)
app.patch('/jobs/:jobId/accept', authMiddleware, async (req, res) => {
  if (req.userType !== 'farmer') {
    return res.status(403).json({ error: 'Only farmers can accept jobs' });
  }

  const { jobId } = req.params;
  const { driverId } = req.body;

  if (!driverId) {
    return res.status(400).json({ error: 'Missing driverId' });
  }

  try {
    // Verify job belongs to this farmer
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('farmer_id, status')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.farmer_id !== req.userId) {
      return res
        .status(403)
        .json({ error: 'You cannot accept this job' });
    }

    if (job.status !== 'open') {
      return res
        .status(400)
        .json({ error: 'Job is no longer available' });
    }

    // Update job status to accepted
    const { error: updateError } = await supabase
      .from('jobs')
      .update({ status: 'accepted' })
      .eq('id', jobId);

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    // Update job request status to accepted
    const { error: requestError } = await supabase
      .from('job_requests')
      .update({ status: 'accepted' })
      .eq('job_id', jobId)
      .eq('driver_id', driverId);

    if (requestError) {
      return res.status(400).json({ error: requestError.message });
    }

    // Reject all other requests for this job
    await supabase
      .from('job_requests')
      .update({ status: 'rejected' })
      .eq('job_id', jobId)
      .neq('driver_id', driverId);

    res.json({
      jobId,
      status: 'accepted',
      driverId,
      message: 'Job accepted',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get my jobs (Farmer)
app.get('/jobs/my-posts', authMiddleware, async (req, res) => {
  if (req.userType !== 'farmer') {
    return res.status(403).json({ error: 'Only farmers can view posted jobs' });
  }

  try {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select(
        '*, requests:job_requests(id, driver_id, status, driver:users(id, email, phone, name, rating))'
      )
      .eq('farmer_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get my accepted jobs (Driver)
app.get('/jobs/my-accepted', authMiddleware, async (req, res) => {
  if (req.userType !== 'driver') {
    return res.status(403).json({ error: 'Only drivers can view accepted jobs' });
  }

  try {
    const { data: requests, error } = await supabase
      .from('job_requests')
      .select('id, status, job:jobs(*, farmer:users(id, email, phone, name, rating))')
      .eq('driver_id', req.userId)
      .eq('status', 'accepted');

    if (error) return res.status(400).json({ error: error.message });

    const jobs = requests.map((r) => r.job);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Complete a job (Driver marks as done)
app.patch('/jobs/:jobId/complete', authMiddleware, async (req, res) => {
  const { jobId } = req.params;

  try {
    const { data: job, error: jobError } = await supabase
      .from('job_requests')
      .select('job:jobs(farmer_id, status), driver_id')
      .eq('job_id', jobId)
      .eq('status', 'accepted')
      .single();

    if (jobError || !job) {
      return res.status(404).json({ error: 'No active job found' });
    }

    if (job.driver_id !== req.userId) {
      return res.status(403).json({ error: 'Only the assigned driver can complete this job' });
    }

    // Update job status to completed
    const { error: updateError } = await supabase
      .from('jobs')
      .update({ status: 'completed' })
      .eq('id', jobId);

    if (updateError) return res.status(400).json({ error: updateError.message });

    res.json({
      jobId,
      status: 'completed',
      message: 'Job marked as completed',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
