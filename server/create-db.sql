-- Both required sql commands should be run in psql as a superuser (e.g. postgres)
-- Ran separately

-- Create app role/user
CREATE USER myapp_user WITH PASSWORD 'YOUR_PASSWORD';
CREATE DATABASE myapp OWNER myapp_user;

-- Notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
