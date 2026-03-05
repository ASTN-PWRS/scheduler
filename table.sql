CREATE TABLE job_metadata (
  job_id TEXT PRIMARY KEY,
  script_name TEXT NOT NULL,
  args JSONB,
  cron_expression TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
