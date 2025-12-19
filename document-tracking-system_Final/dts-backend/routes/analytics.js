import express from "express";
import {
  getAnalytics,
  getCategorizedDocuments,
  recategorizeDocuments,
  getInsightsSummary,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/", getAnalytics);
router.get("/documents", getCategorizedDocuments);
router.get("/insights", getInsightsSummary);
router.post("/recategorize", recategorizeDocuments);

export default router;

