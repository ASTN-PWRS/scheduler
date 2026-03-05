import express from "express";
import schedule from "node-schedule";
import { createClient } from "redis";
import { getJobMetadata } from "./jobMetadataStore.js";
// const data = {
//   request: "register",
//   option:{
//     scriptName: "example1.py",
//     args: { test: "hello" },
//     cronExpression: "0 10 * * *"
//   }
// };
// Expressサーバー設定
const app = express();
app.use(express.json());
//
import { registerJob } from "./registerJob.js";
// Redisクライアントの設定
const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

await redisClient.connect(); // Redisに接続

// Redisから新しいスケジュールを受信して登録
async function listenForSchedules() {
  const subscriber = redisClient.duplicate(); // サブスクライバ用Redisクライアント
  await subscriber.connect();

  console.log("Listening for new schedule messages...");

  subscriber.subscribe("scheduleChannel", async (message) => {
    // メッセージをJSONとして解析
    const { request, option } = JSON.parse(message);
    switch (request) {
      case "register":
        const jobId = registerJob(schedule, option);
        if (!jobId) {
          console.error("register is failed.");
        }
        break;
      case "resume":
        if (option?.jobId) {
          const jobMeta = await getJobMetadata(option.jobId);
          if (jobMeta) {
            const resumedId = await registerJob(schedule, jobMeta);
            console.log(`Job ${resumedId} resumed.`);
          } else {
            console.error(`No metadata found for job ${option.jobId}`);
          }
        }
        break;
      case "list":
        console.log(Object.keys(schedule.scheduledJobs));
    }
  });
}
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // サーバー起動後にスケジュールリスナーを開始
  listenForSchedules().catch((err) =>
    console.error("Error in listenForSchedules:", err)
  );
});
