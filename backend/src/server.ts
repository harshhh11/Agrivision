import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import apiRouter from "./routes/api";
import { seedDatabase } from "./scripts/seed";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api", apiRouter);

// Root healthcheck
app.get("/", (req: Request, res: Response) => {
  res.json({
    platform: "AgriTwin Agricultural Digital Twin Platform",
    status: "online",
    version: "1.0.0",
    apiDocumentation: "/api/dashboard/default"
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[AgriTwin Error]", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

async function startServer() {
  try {
    await connectDB();
    await seedDatabase(false); // Auto-seeds if database is empty

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🌾 AgriTwin Express Backend listening on http://localhost:${PORT}`);
      console.log(`🌱 API Base: http://localhost:${PORT}/api`);
      console.log(`======================================================\n`);
    });
  } catch (err: any) {
    console.error("[AgriTwin] Fatal server startup error:", err.message);
    process.exit(1);
  }
}

startServer();
