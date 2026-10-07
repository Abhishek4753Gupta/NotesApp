import express from "express";
import {getSearchSuggestions} from "../controllers/suggestionController.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();
router.get("/", authMiddleware, getSearchSuggestions);

export default router;