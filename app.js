import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

import slideRoutes from "./routes/slide.routes.js";
import authRoutes from "./routes/auth.routes.js";
import {
  requireAuthPage,
  requireAdminPage
} from "./middleware/auth.middleware.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse JSON + cookies
app.use(express.json());
app.use(cookieParser());

// Public static assets (css/js) + the login page itself
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/slides", slideRoutes);

// Protected pages (not served as plain static files, so they can't be
// reached without passing through the auth/role checks below)
app.get("/dashboard.html", requireAuthPage, requireAdminPage, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/index.html", requireAuthPage, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Root -> send people to the right place based on who they are
app.get("/", (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect("/login.html");
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return res.redirect(user.role === "admin" ? "/dashboard.html" : "/index.html");
  } catch (error) {
    return res.redirect("/login.html");
  }
});

export default app;
