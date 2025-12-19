import db from "../db.js";
import { categorizeDocument } from "../utils/documentCategorizer.js";

export async function generateDTSNumber() {
  const year = new Date().getFullYear();
  
  try {
    // First, try to get the latest DTS number for the current year
    const [rows] = await db.query(
      `SELECT dts_number FROM office_docs 
       WHERE dts_number LIKE ? 
       ORDER BY CAST(dts_number AS UNSIGNED) DESC 
       LIMIT 1`,
      [`${year}%`]
    );

    let nextNumber = 1;
    if (rows.length > 0) {
      // Extract the numeric part after the year and increment
      const lastNumber = parseInt(rows[0].dts_number.toString().slice(4));
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    // Format as YYYY + 7-digit number with leading zeros
    return `${year}${String(nextNumber).padStart(7, "0")}`;
  } catch (error) {
    console.error("Error generating DTS number:", error);
    // Fallback: return current timestamp if there's an error
    return `${year}${Date.now().toString().slice(-7)}`;
  }
}

export async function registerDocument(req, res) {
  try {
    const { title, description, doc_type, docType, registered_by } = req.body;
    // Support both doc_type and docType from frontend
    const finalDocType = doc_type || docType;
    const dtsNumber = await generateDTSNumber();

    // AI Categorization (now async with OpenAI)
    const aiCategorization = await categorizeDocument(title, description);
    const ai_category = aiCategorization.category;
    const ai_confidence = aiCategorization.confidence;

    await db.query(
      `INSERT INTO office_docs (dts_number, title, description, doc_type, registered_by, status, ai_category, ai_confidence)
       VALUES (?, ?, ?, ?, ?, 'received', ?, ?)`,
      [dtsNumber, title, description, finalDocType, registered_by, ai_category, ai_confidence]
    );

    res.json({ 
      message: "Document registered successfully", 
      dtsNumber,
      aiCategory: ai_category,
      aiConfidence: ai_confidence
    });
  } catch (err) {
    console.error("❌ Document registration error:", err);
    res.status(500).json({ error: "Failed to register document" });
  }
}

export async function overrideAICategory(req, res) {
  try {
    const { dtsNumber } = req.params;
    const { ai_category, ai_confidence = null, reason = "" } = req.body;
    const user = req.user?.username || "admin"; // adjust based on auth

    await db.query(
      `UPDATE office_docs
          SET ai_category = ?, ai_confidence = ?, ai_override_by = ?, ai_override_at = NOW(), ai_override_reason = ?
        WHERE dts_number = ?`,
      [ai_category, ai_confidence, user, reason, dtsNumber]
    );

    res.json({ message: "AI category updated manually." });
  } catch (err) {
    console.error("Override error:", err);
    res.status(500).json({ error: "Failed to override category" });
  }
}

export async function updateManualCategory(req, res) {
  try {
    const { dtsNumber } = req.params;
    const { doc_type } = req.body;

    if (!doc_type || !doc_type.trim()) {
      return res.status(400).json({ error: "manual category is required" });
    }

    await db.query(
      `UPDATE office_docs SET doc_type = ? WHERE dts_number = ?`,
      [doc_type.trim(), dtsNumber]
    );

    res.json({ message: "Manual category updated successfully." });
  } catch (err) {
    console.error("Manual category update error:", err);
    res.status(500).json({ error: "Failed to update manual category" });
  }
}