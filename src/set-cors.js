const { Storage } = require("@google-cloud/storage");

const projectId = "recipe-912c7"; // 自分のプロジェクトID
const bucketName = "recipe-912c7.appspot.com"; // 自分のバケット名

const storage = new Storage({ projectId });

async function setCorsConfiguration() {
  await storage.bucket(bucketName).setCorsConfiguration([
    {
      origin: ["http://localhost:3000"], // Reactの開発サーバー
      method: ["GET", "POST", "PUT", "DELETE"],
      responseHeader: ["Content-Type", "Authorization"],
      maxAgeSeconds: 3600,
    },
  ]);

  console.log(`CORS設定が完了しました！`);
}

setCorsConfiguration().catch(console.error);
