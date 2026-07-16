import express from "express";
import { login, logout, me } from "../controllers/auth.controller.js";
import { requireAuthApi } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuthApi, me);

export default router;
