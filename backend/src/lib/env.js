import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/chat-app",
  JWT_SECRET: process.env.JWT_SECRET || "mysecretkey",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "onboarding@resend.dev",
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "Jahiru Islam",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000"
};

