import express from "express";
import { getAllNotes,getNoteById, createNotes, updateNotes, deleteNotes } from "../controllers/notesControllers.js";
import authMiddleware from "../middleware/auth.js";
const router=express.Router();

router.get("/" ,authMiddleware, getAllNotes);
router.get("/:id" ,authMiddleware, getNoteById);
router.post("/" ,authMiddleware, createNotes);
router.put("/:id" ,authMiddleware, updateNotes);
router.delete("/:id" ,authMiddleware, deleteNotes);


export default router;