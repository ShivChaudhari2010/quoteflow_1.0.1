import express from "express";

import {
  createSlide,
  getAllSlides,
  getSlideById,
  updateSlide,
  deleteSlide
} from "../controllers/slide.controller.js";

import { requireAuthApi, requireAdminApi } from "../middleware/auth.middleware.js";

const router = express.Router();

// Any logged-in user (admin or regular) can view slides
router.get("/", requireAuthApi, getAllSlides);
router.get("/:id", requireAuthApi, getSlideById);

// Only admins can modify slides
router.post("/", requireAuthApi, requireAdminApi, createSlide);
router.put("/:id", requireAuthApi, requireAdminApi, updateSlide);
router.delete("/:id", requireAuthApi, requireAdminApi, deleteSlide);

export default router;
