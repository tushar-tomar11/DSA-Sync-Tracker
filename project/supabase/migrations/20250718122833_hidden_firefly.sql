/*
  # Create DSA Tracker Schema

  1. New Tables
    - `sheets`
      - `id` (uuid, primary key)
      - `name` (text)
      - `user_id` (uuid, nullable, references auth.users)
      - `type` (text, 'public' or 'custom')
      - `created_at` (timestamp)
    - `problems`
      - `id` (uuid, primary key)
      - `name` (text)
      - `topic` (text)
      - `level` (text, 'Easy', 'Medium', 'Hard')
      - `platform` (text)
      - `link` (text)
      - `created_at` (timestamp)
    - `sheet_problems`
      - `id` (uuid, primary key)
      - `sheet_id` (uuid, references sheets)
      - `problem_id` (uuid, references problems)
    - `progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `problem_id` (uuid, references problems)
      - `is_solved` (boolean)
      - `solved_at` (timestamp, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Sheets: users can see all public sheets and their own custom sheets
    - Problems: readable by all authenticated users
    - Progress: users can only see and modify their own progress
*/

CREATE TABLE IF NOT EXISTS sheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid REFERENCES auth.users,
  type text NOT NULL CHECK (type IN ('public', 'custom')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  topic text NOT NULL,
  level text NOT NULL CHECK (level IN ('Easy', 'Medium', 'Hard')),
  platform text NOT NULL,
  link text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sheet_problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_id uuid REFERENCES sheets(id) ON DELETE CASCADE,
  problem_id uuid REFERENCES problems(id) ON DELETE CASCADE,
  UNIQUE(sheet_id, problem_id)
);

CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id uuid REFERENCES problems(id) ON DELETE CASCADE,
  is_solved boolean DEFAULT false,
  solved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

-- Enable RLS
ALTER TABLE sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheet_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Sheets policies
CREATE POLICY "Users can view public sheets and their own custom sheets"
  ON sheets
  FOR SELECT
  TO authenticated
  USING (type = 'public' OR user_id = auth.uid());

CREATE POLICY "Users can create custom sheets"
  ON sheets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND type = 'custom');

CREATE POLICY "Users can update their own custom sheets"
  ON sheets
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own custom sheets"
  ON sheets
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Problems policies
CREATE POLICY "Authenticated users can view all problems"
  ON problems
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create problems"
  ON problems
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Sheet problems policies
CREATE POLICY "Users can view sheet problems for accessible sheets"
  ON sheet_problems
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sheets 
      WHERE sheets.id = sheet_problems.sheet_id 
      AND (sheets.type = 'public' OR sheets.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create sheet problems for their own sheets"
  ON sheet_problems
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sheets 
      WHERE sheets.id = sheet_problems.sheet_id 
      AND sheets.user_id = auth.uid()
    )
  );

-- Progress policies
CREATE POLICY "Users can view their own progress"
  ON progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress"
  ON progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
  ON progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own progress"
  ON progress
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());