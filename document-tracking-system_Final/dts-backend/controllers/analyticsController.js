import db from "../db.js";
import { categorizeDocument } from "../utils/documentCategorizer.js";

const MAIN_CATEGORIES = [
  "Academics",
  "Research and Extension",
  "Student Services",
  "Planning and Development",
  "Administration and Finance",
  "Institute",
];

const getMainCategory = (category = "") => {
  if (!category) return "";
  const [main] = category.split(":");
  return (main || category).trim();
};

async function loadDocumentsWithAI() {
  const [documents] = await db.query(
    `SELECT id, dts_number, title, description, doc_type, status, 
            ai_category, ai_confidence, ai_override_at, registered_by, date_registered as created_at
     FROM office_docs 
     ORDER BY date_registered DESC`
  );

  const categorizedDocs = await Promise.all(
    documents.map(async (doc) => {
      if (!doc.ai_category) {
        const categorization = await categorizeDocument(doc.title, doc.description);
        return {
          ...doc,
          ai_category: categorization.category,
          ai_confidence: categorization.confidence,
        };
      }
      return doc;
    })
  );

  const normalizedDocs = categorizedDocs.map((doc) => ({
    ...doc,
    ai_main_category: getMainCategory(doc.ai_category),
    full_text: `${doc.title || ""} ${doc.description || ""}`.toLowerCase(),
  }));

  return normalizedDocs;
}

const countBy = (docs, key) =>
  docs.reduce((acc, doc) => {
    const k = typeof key === "function" ? key(doc) : doc[key];
    if (!k) return acc;
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

function generateInsights(normalizedDocs) {
  if (!normalizedDocs.length) {
    return [
      {
        id: "empty",
        title: "Insights",
        items: [
          {
            title: "No insights available",
            detail: "Add documents to see AI-generated observations about institutional activity.",
            category: "General",
            impact: "neutral",
          },
        ],
      },
    ];
  }

  const creativeInsights = [];
  const workloadInsights = [];
  const workflowInsights = [];

  const total = normalizedDocs.length;
  const mainCounts = countBy(normalizedDocs, "ai_main_category");
  const subCounts = countBy(normalizedDocs, "ai_category");
  const statusCounts = countBy(normalizedDocs, "status");

  const specificHeuristics = [
    {
      id: "accreditation_push",
      title: "Accreditation Preparation",
      keywords: ["aaccup", "accreditation", "copc", "program compliance", "technical review", "survey visit"],
      threshold: 2,
      category: "Academics",
      impact: "high",
      build: (count) =>
        `High activity detected regarding accreditation (AACCUP/COPC). ${count} document${count === 1 ? "" : "s"} indicate the institute is in a compliance or audit phase.`,
    },
    {
      id: "financial_bottleneck",
      title: "Reimbursement Spike",
      keywords: ["reimbursement", "liquidation", "petty cash", "refund", "cash advance"],
      threshold: 3,
      category: "Finance",
      impact: "medium",
      build: (count) =>
        `There are ${count} active reimbursement or liquidation requests. This may signal a backlog in financial processing.`,
    },
    {
      id: "infrastructure_dev",
      title: "Infrastructure Projects",
      keywords: ["construction", "repair", "renovation", "infrastructure", "building", "labor", "project site"],
      threshold: 2,
      category: "Development",
      impact: "high",
      build: (count) =>
        `Physical development is active. ${count} document${count === 1 ? "" : "s"} refer to construction, repairs, or infrastructure upgrades.`,
    },
    {
      id: "student_financial_aid",
      title: "Scholarship Distribution",
      keywords: ["scholarship", "financial assistance", "stipend", "grant", "unclaimed atm", "uni-fast", "tes"],
      threshold: 2,
      category: "Student Services",
      impact: "high",
      build: (count) =>
        `Student financial services are busy. ${count} document${count === 1 ? "" : "s"} involve scholarships or release of allowances.`,
    },
    {
      id: "health_alert",
      title: "Health & Wellness Watch",
      keywords: ["flu", "fever", "sick", "medical certificate", "quarantine", "health", "confinement"],
      threshold: 2,
      category: "HR",
      impact: "medium",
      build: (count) =>
        `Detected ${count} health-related document${count === 1 ? "" : "s"} (e.g., sick leaves). Check if this aligns with seasonal wellness concerns.`,
    },
    {
      id: "weather_disruption",
      title: "Weather Impact",
      keywords: ["typhoon", "suspension", "storm", "heavy rain", "disaster", "calamity", "flood"],
      threshold: 1,
      category: "Operations",
      impact: "high",
      build: (count) =>
        `Weather conditions are affecting operations, with ${count} document${count === 1 ? "" : "s"} mentioning suspensions or typhoons.`,
    },
    {
      id: "procurement_rush",
      title: "Urgent Procurement",
      keywords: ["urgent", "rush", "immediate", "emergency purchase", "catering", "meals"],
      threshold: 3,
      category: "Procurement",
      impact: "medium",
      build: (count) =>
        `${count} procurement document${count === 1 ? "" : "s"} suggest rapid purchasing cycles or events preparation.`,
    },
    {
      id: "strategic_partnerships",
      title: "Partnership Expansion",
      keywords: ["moa", "mou", "memorandum of agreement", "understanding", "linkage", "partnership", "signing"],
      threshold: 1,
      category: "Legal & Linkages",
      impact: "high",
      build: (count) =>
        `Strategic growth detected: ${count} document${count === 1 ? "" : "s"} involve MOAs or MOUs, indicating new external partnerships.`,
    },
    {
      id: "faculty_mobility",
      title: "Faculty & Staff Mobility",
      keywords: ["travel order", "itinerary", "official business", "seminar", "workshop", "convention"],
      threshold: 3,
      category: "HR/Admin",
      impact: "neutral",
      build: (count) =>
        `High mobility detected. ${count} document${count === 1 ? "" : "s"} relate to official business trips or conferences.`,
    },
    {
      id: "it_infrastructure",
      title: "IT System Strain",
      keywords: ["internet", "wifi", "network", "connectivity", "slow", "down", "server", "repair computer"],
      threshold: 2,
      category: "ICT Services",
      impact: "medium",
      build: (count) =>
        `Technical issues reported. ${count} document${count === 1 ? "" : "s"} mention network or IT disruptions.`,
    },
    {
      id: "audit_compliance_risk",
      title: "COA/Audit Compliance",
      keywords: ["coa", "commission on audit", "audit observation", "notice of suspension", "disallowance", "audit query"],
      threshold: 1,
      category: "Finance/Legal",
      impact: "high",
      build: (count) =>
        `Compliance alert: ${count} document${count === 1 ? "" : "s"} explicitly mention COA or audit observations. Immediate attention recommended.`,
    },
    {
      id: "faculty_ranking",
      title: "Faculty Promotion Cycle",
      keywords: ["nbc 461", "ranking", "promotion", "reclassification", "plantilla", "step increment"],
      threshold: 1,
      category: "HR",
      impact: "high",
      build: (count) =>
        `Faculty career movements detected. ${count} document${count === 1 ? "" : "s"} relate to NBC 461 ranking or promotions.`,
    },
  ];

  specificHeuristics.forEach((rule) => {
    const matches = normalizedDocs.filter((doc) =>
      rule.keywords.some((k) => doc.full_text.includes(k))
    );
    if (matches.length >= rule.threshold) {
      creativeInsights.push({
        title: rule.title,
        detail: rule.build(matches.length),
        category: rule.category,
        impact: rule.impact,
      });
    }
  });

  // Dominant main categories
  const sortedMain = Object.entries(mainCounts).sort((a, b) => b[1] - a[1]);
  sortedMain.forEach(([category, count]) => {
    const share = count / total;
    if (share >= 0.35) {
      workloadInsights.push({
        title: `${category} dominates recent workload`,
        detail: `${Math.round(share * 100)}% of tagged documents fall under ${category}, indicating a major operational focus.`,
        category,
        impact: "high",
      });
    } else if (share >= 0.2) {
      workloadInsights.push({
        title: `${category} remains active`,
        detail: `${Math.round(share * 100)}% of records tie to ${category}, showing steady engagement.`,
        category,
        impact: "medium",
      });
    }
  });

  // Recurring subcategories
  const topSubcats = Object.entries(subCounts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  topSubcats.forEach(([subcategory, count]) => {
    workloadInsights.push({
      title: subcategory,
      detail: `${count} document${count === 1 ? "" : "s"} were categorized as ${subcategory}, suggesting recurring activity in this area.`,
      category: getMainCategory(subcategory),
      impact: "medium",
    });
  });

  if (Object.keys(statusCounts).length) {
    const [topStatus, topStatusCount] = Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0];
    workflowInsights.push({
      title: `Most documents are ${topStatus}`,
      detail: `${topStatusCount} document${topStatusCount === 1 ? "" : "s"} currently carry the status “${topStatus}”, which can guide routing priorities.`,
      category: "Workflow",
      impact: "medium",
    });
  }

  const pendingCount = normalizedDocs.filter(
    (doc) =>
      !doc.status.toLowerCase().includes("completed") &&
      !doc.status.toLowerCase().includes("released")
  ).length;
  if (pendingCount > 5) {
    workflowInsights.push({
      title: "High Pending Volume",
      detail: `${pendingCount} document${pendingCount === 1 ? "" : "s"} are still in routing (neither completed nor released).`,
      category: "Workflow",
      impact: "medium",
    });
  }

  const dedupe = (arr) =>
    arr.filter((insight, index, self) => self.findIndex((t) => t.title === insight.title) === index);

  const grouped = [
    { id: "creative", title: "Strategic Signals", items: dedupe(creativeInsights).slice(0, 8) },
    { id: "workload", title: "Workload Highlights", items: dedupe(workloadInsights).slice(0, 6) },
    { id: "workflow", title: "Workflow Alerts", items: dedupe(workflowInsights).slice(0, 4) },
  ].filter((group) => group.items.length > 0);

  return grouped;
}

export async function getAnalytics(req, res) {
  try {
    const normalizedDocs = await loadDocumentsWithAI();

    const totalDocs = normalizedDocs.length;

    const categoryCounts = {};
    MAIN_CATEGORIES.forEach((cat) => {
      categoryCounts[cat] = normalizedDocs.filter(
        (doc) => doc.ai_main_category === cat
      ).length;
    });
    const categoryTotals = { ...categoryCounts };

    const statusCounts = {
      received: normalizedDocs.filter((doc) => doc.status === "received").length,
      forwarded: normalizedDocs.filter((doc) => doc.status === "forwarded").length,
      ended: normalizedDocs.filter((doc) => doc.status === "ended").length,
    };

    const monthlyData = {};
    normalizedDocs.forEach((doc) => {
      const date = new Date(doc.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: date.toLocaleString("default", { month: "short", year: "numeric" }),
          total: 0,
          byCategory: {},
        };
      }
      monthlyData[monthKey].total++;
      monthlyData[monthKey].byCategory[doc.ai_main_category] =
        (monthlyData[monthKey].byCategory[doc.ai_main_category] || 0) + 1;
    });

    const confidences = normalizedDocs
      .map((doc) => doc.ai_confidence || 0)
      .filter((c) => c > 0);
    const avgConfidence =
      confidences.length > 0
        ? confidences.reduce((a, b) => a + b, 0) / confidences.length
        : 0;

    const accuracyData = MAIN_CATEGORIES.map((category) => {
      const docsInCategory = normalizedDocs.filter(
        (doc) => doc.ai_main_category === category
      );
      const matching = docsInCategory.filter(
        (doc) => doc.doc_type === category
      ).length;
      return {
        category,
        total: docsInCategory.length,
        matching,
        accuracy:
          docsInCategory.length > 0
            ? (matching / docsInCategory.length) * 100
            : 0,
      };
    });

    const highConfidenceCount = normalizedDocs.filter(
      (doc) => (doc.ai_confidence || 0) >= 0.75
    ).length;

    const lowConfidenceCount = normalizedDocs.filter(
      (doc) => doc.ai_confidence !== null && doc.ai_confidence < 0.5
    ).length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentDocs = normalizedDocs.filter(
      (doc) => new Date(doc.created_at) >= sevenDaysAgo
    ).length;

    const overrideCount = normalizedDocs.filter(
      (doc) => doc.ai_override_at
    ).length;

    const topMismatchedCategories = MAIN_CATEGORIES
      .map((category) => {
        const docsInCategory = normalizedDocs.filter(
          (doc) => doc.ai_main_category === category
        );
        const mismatched = docsInCategory.filter(
          (doc) => doc.doc_type !== category
        ).length;

        return {
          category,
          mismatched,
          total: docsInCategory.length,
          mismatchRate:
            docsInCategory.length > 0
              ? (mismatched / docsInCategory.length) * 100
              : 0,
        };
      })
      .sort((a, b) => b.mismatched - a.mismatched)
      .slice(0, 3);

    res.json({
      totalDocuments: totalDocs,
      categoryDistribution: categoryCounts,
      statusDistribution: statusCounts,
      monthlyTrends: Object.values(monthlyData),
      averageConfidence: Math.round(avgConfidence * 100) / 100,
      categoryAccuracy: accuracyData,
      recentDocuments: normalizedDocs.slice(0, 10),
      categoryTotals,
      highConfidenceCount,
      lowConfidenceCount,
      recentDocs,
      overrideCount,
      topMismatchedCategories,
    });
  } catch (err) {
    console.error("❌ Analytics error:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

export async function getInsightsSummary(req, res) {
  try {
    const normalizedDocs = await loadDocumentsWithAI();
    const insights = generateInsights(normalizedDocs);
    res.json({
      totalDocuments: normalizedDocs.length,
      insights,
    });
  } catch (err) {
    console.error("❌ Insights error:", err);
    res.status(500).json({ error: "Failed to generate insights" });
  }
}


/**
 * Get categorized documents with filters
 */
export async function getCategorizedDocuments(req, res) {
  try {
    const { category, status, limit = 50 } = req.query;

    let query = `SELECT id, dts_number, title, description, doc_type, status, 
                        ai_category, ai_confidence, registered_by, date_registered as created_at
                 FROM office_docs WHERE 1=1`;
    const params = [];

    if (category) {
      query += ` AND ai_category = ?`;
      params.push(category);
    }

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    query += ` ORDER BY date_registered DESC LIMIT ?`;
    params.push(parseInt(limit));

    const [documents] = await db.query(query, params);

    // Categorize documents that don't have AI data
    const categorizedDocs = await Promise.all(
      documents.map(async (doc) => {
        if (!doc.ai_category) {
          const categorization = await categorizeDocument(doc.title, doc.description);
          return {
            ...doc,
            ai_category: categorization.category,
            ai_confidence: categorization.confidence,
          };
        }
        return doc;
      })
    );

    res.json({
      documents: categorizedDocs,
      count: categorizedDocs.length,
    });
  } catch (err) {
    console.error("❌ Get categorized documents error:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
}

/**
 * Re-categorize all documents (useful for updating AI categories)
 */
export async function recategorizeDocuments(req, res) {
  try {
    const [documents] = await db.query(
      `SELECT id, title, description FROM office_docs`
    );

    let updated = 0;

    for (const doc of documents) {
      const categorization = await categorizeDocument(doc.title, doc.description);
      await db.query(
        `UPDATE office_docs SET ai_category = ?, ai_confidence = ? WHERE id = ?`,
        [categorization.category, categorization.confidence, doc.id]
      );
      updated++;
    }

    res.json({
      message: `Successfully re-categorized ${updated} documents`,
      updated,
    });


  } catch (err) {
    console.error("❌ Re-categorization error:", err);
    res.status(500).json({ error: "Failed to re-categorize documents" });
  }
}

