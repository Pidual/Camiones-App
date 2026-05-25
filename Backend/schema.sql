-- Users table (farmers & drivers)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('farmer', 'driver')),
  name TEXT,
  profile_pic_url TEXT,
  rating FLOAT DEFAULT 5.0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Jobs posted by farmers
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  pickup_lat FLOAT NOT NULL,
  pickup_lng FLOAT NOT NULL,
  dropoff_lat FLOAT NOT NULL,
  dropoff_lng FLOAT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'accepted', 'completed', 'cancelled')),
  payment_amount FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Job requests from drivers
CREATE TABLE IF NOT EXISTS job_requests (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(job_id, driver_id)
);

-- Ratings and reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY,
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text OR TRUE);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- RLS Policies for jobs table
CREATE POLICY "Anyone can view jobs"
  ON jobs FOR SELECT
  USING (TRUE);

CREATE POLICY "Farmers can insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (farmer_id::text = auth.uid()::text);

CREATE POLICY "Farmers can update own jobs"
  ON jobs FOR UPDATE
  USING (farmer_id::text = auth.uid()::text);

-- RLS Policies for job_requests
CREATE POLICY "Users can view job requests for their jobs"
  ON job_requests FOR SELECT
  USING (
    job_id IN (
      SELECT id FROM jobs WHERE farmer_id::text = auth.uid()::text
    )
    OR driver_id::text = auth.uid()::text
  );

CREATE POLICY "Drivers can insert job requests"
  ON job_requests FOR INSERT
  WITH CHECK (driver_id::text = auth.uid()::text);

-- Create indexes for performance
CREATE INDEX idx_jobs_farmer_id ON jobs(farmer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_job_requests_driver_id ON job_requests(driver_id);
CREATE INDEX idx_job_requests_job_id ON job_requests(job_id);
CREATE INDEX idx_reviews_from_user ON reviews(from_user_id);
CREATE INDEX idx_reviews_to_user ON reviews(to_user_id);
