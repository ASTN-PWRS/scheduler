import pg from "pg";
const { Pool } = pg;
const pool = new Pool(); // 環境変数で接続設定

export async function saveJobMetadata(
  jobId,
  { scriptName, args, cronExpression }
) {
  const query = `
    INSERT INTO job_metadata (job_id, script_name, args, cron_expression)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (job_id) DO NOTHING
  `;
  const values = [jobId, scriptName, args, cronExpression];
  await pool.query(query, values);
}

export async function getJobMetadata(jobId) {
  const query = `SELECT script_name, args, cron_expression FROM job_metadata WHERE job_id = $1`;
  const { rows } = await pool.query(query, [jobId]);
  return rows[0] || null;
}
