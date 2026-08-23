import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import apiRoutes from "./endpoints/api.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Ruang Pulih API",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiRoutes);

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ruangpulih";

// Bounded retry loop: mongo (with --auth + WiredTiger recovery) can take
// several seconds to accept connections after container start. Instead of
// giving up on the first ECONNREFUSED and falling back to in-memory
// storage forever, retry for up to ~30s before degrading.
async function connectWithRetry(
  uri: string,
  attempts = 10,
  delayMs = 3000,
): Promise<void> {
  for (let i = 1; i <= attempts; i++) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log("✅ MongoDB connected");
      return;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(
        `⚠️  MongoDB connection attempt ${i}/${attempts} failed: ${message}`,
      );
      if (i < attempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  console.error(
    "❌ MongoDB connection failed after retries. API berjalan dengan fallback memori.",
  );
}

connectWithRetry(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`🌿 Ruang Pulih API running on http://localhost:${PORT}`);
});

export default app;
