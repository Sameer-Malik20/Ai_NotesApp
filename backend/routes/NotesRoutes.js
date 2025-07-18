import { Router } from "express";
import { AllNotes, Create, Delete, Update } from "../controller/Notes.js";

const router = Router();

router.post("/create", Create);
router.put("/update/:id", Update);
router.delete("/delete/:id", Delete);
router.get("/allnotes", AllNotes);

export default router;
