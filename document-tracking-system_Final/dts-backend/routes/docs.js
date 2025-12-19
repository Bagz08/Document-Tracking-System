import express from "express";
import {
  registerDocument,
  overrideAICategory,
  updateManualCategory,
} from "../controllers/docsController.js";


const router = express.Router();

router.post("/register", registerDocument);

router.patch("/:dtsNumber/override", overrideAICategory);
router.patch("/:dtsNumber/manual", updateManualCategory);

export default router;