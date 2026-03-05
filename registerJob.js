import { executeScript } from "./executeScript.js";
import { logExecutionResult } from "./logExecutionResult.js";
import { saveJobMetadata } from "./jobMetadataStore.js"; // ← 新しく追加するDB保存関数

export async function registerJob(schedule, option) {
  const { scriptName, args, cronExpression } = option;
  const jobId = `${scriptName}-${Date.now()}`;

  const job = schedule.scheduleJob(jobId, cronExpression, async () => {
    try {
      const executionData = await executeScript(scriptName, args);
      const status = executionData.error ? "Failure" : "Success";
      const message = executionData.error || executionData.results;

      await logExecutionResult(
        scriptName,
        status,
        message,
        executionData.startTime,
        executionData.endTime
      );
      console.log(`Script finished with status: ${status}`);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  });

  // resume 用にジョブ情報を保存
  await saveJobMetadata(jobId, { scriptName, args, cronExpression });

  return jobId;
}
