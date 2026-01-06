import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import projectRoutes from "./routes/projectRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import sprintRoutes from "./routes/sprintRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bpmnRoutes from "./routes/bpmnRoutes.js";
import authMiddleware from "./authMiddleware.js"; // <-- Import middleware

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(
//   cors({
//     origin: ["https://aegis11.vercel.app"], // later add custom domain too
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(express.json());
// app.options("*", cors());

const allowedOrigins = ["https://aegis11.vercel.app"];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like curl, health checks)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

connectDB();

// -------------------------------------------------------------
// Routes: Apply authMiddleware to protect data access
// -------------------------------------------------------------

// 1. User routes (Login, Signup, GET /me are handled internally, GET / is public for user list)
app.use("/api/users", userRoutes);

// 2. Protected Data Routes: Apply middleware explicitly to routers accessing sensitive data.
app.use("/api/projects", authMiddleware, projectRoutes);
app.use("/api/issues", authMiddleware, issueRoutes);
app.use("/api/sprints", authMiddleware, sprintRoutes);
app.use("/api/bpmn", authMiddleware, bpmnRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
