// logExecutionResult.js
import { Client } from "pg";

const client = new Client({
  host: "localhost",
  database: "rbac",
  user: "postgres",
  password: "Pos2025",
  port: 5432,
});
await client.connect();

export async function logExecutionResult(
  scriptName,
  status,
  message,
  startTime,
  endTime = null
) {
  try {
    const query = `
            INSERT INTO execution_results (script_name, status, message, start_time, end_time)
            VALUES ($1, $2, $3, $4, $5)
        `;
    await client.query(query, [
      scriptName,
      status,
      message,
      startTime,
      endTime,
    ]);
    console.log("Execution result logged successfully!");
  } catch (error) {
    console.error("Error logging execution result:", error);
  }
}
