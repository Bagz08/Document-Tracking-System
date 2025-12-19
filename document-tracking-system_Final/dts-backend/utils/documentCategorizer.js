import fetch from "node-fetch";

const LOCAL_AI_URL = process.env.LOCAL_AI_URL || "http://localhost:5001/predict";

export async function categorizeDocument(title = "", description = "") {
  const response = await fetch(LOCAL_AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description })
  });

  if (!response.ok) throw new Error("Local AI service failed");

  const result = await response.json();
  return {
    category: result.category,
    confidence: result.confidence,
    method: "local-ml",
    modelVersion: result.modelVersion
  };
}


// Available categories
const CATEGORIES = [
  "Academics",
  "Research and Extension",
  "Student Services",
  "Planning and Development",
  "Administration and Finance",
  "Institute"
];

// Category keywords mapping - used as fallback
const categoryKeywords = {
  "Academics": [
    "academic", "curriculum", "syllabus", "course", "subject", "lecture", "teaching",
    "faculty", "professor", "student", "enrollment", "registration", "grades",
    "examination", "exam", "assessment", "evaluation", "semester", "trimester",
    "academic calendar", "class schedule", "program", "degree", "bachelor", "master",
    "doctorate", "thesis", "dissertation", "research paper", "academic paper"
  ],
  "Research and Extension": [
    "research", "study", "investigation", "survey", "experiment", "analysis",
    "extension", "outreach", "community", "project", "grant", "funding",
    "publication", "journal", "conference", "presentation", "workshop",
    "seminar", "training", "development", "innovation", "methodology",
    "data collection", "field work", "laboratory", "findings", "results"
  ],
  "Student Services": [
    "student", "services", "welfare", "assistance", "scholarship", "financial aid",
    "counseling", "guidance", "admission", "enrollment", "registration",
    "dormitory", "housing", "cafeteria", "dining", "health", "medical",
    "insurance", "activities", "organization", "club", "sports", "event",
    "orientation", "freshman", "alumni", "career", "placement", "job"
  ],
  "Planning and Development": [
    "planning", "development", "strategic", "plan", "budget", "allocation",
    "infrastructure", "facility", "building", "construction", "renovation",
    "expansion", "improvement", "upgrade", "maintenance", "project",
    "timeline", "milestone", "resource", "capacity", "growth", "expansion",
    "master plan", "long-term", "short-term", "objective", "goal"
  ],
  "Administration and Finance": [
    "administration", "finance", "financial", "budget", "expense", "revenue",
    "accounting", "audit", "payroll", "salary", "wage", "payment", "invoice",
    "purchase", "procurement", "purchase order", "po", "vendor", "supplier",
    "contract", "agreement", "policy", "procedure", "regulation", "compliance",
    "human resources", "hr", "personnel", "employee", "staff", "management"
  ],
  "Institute": [
    "institute", "institution", "organization", "governance", "board", "committee",
    "director", "president", "executive", "leadership", "official", "memorandum",
    "circular", "announcement", "notice", "directive", "order", "decree",
    "institutional", "corporate", "organizational", "structure", "hierarchy"
  ]
};

/**
 * Fallback: Calculate similarity score between text and category keywords
 * @param {string} text - The text to analyze
 * @param {string[]} keywords - Array of keywords for a category
 * @returns {number} - Similarity score (0-1)
 */
function calculateSimilarity(text, keywords) {
  if (!text || !keywords || keywords.length === 0) return 0;

  const lowerText = text.toLowerCase();
  let matches = 0;
  let totalWeight = 0;

  keywords.forEach((keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    // Check for exact word match (more weight)
    const wordRegex = new RegExp(`\\b${lowerKeyword}\\b`, 'gi');
    const wordMatches = (lowerText.match(wordRegex) || []).length;
    
    // Check for partial match (less weight)
    const partialMatches = lowerText.includes(lowerKeyword) ? 1 : 0;
    
    if (wordMatches > 0) {
      matches += wordMatches * 2; // Exact word matches get double weight
      totalWeight += 2;
    } else if (partialMatches > 0) {
      matches += 1;
      totalWeight += 1;
    }
  });

  // Normalize score
  const maxPossibleScore = keywords.length * 2;
  return totalWeight > 0 ? Math.min(matches / maxPossibleScore, 1) : 0;
}

/**
 * Fallback: Keyword-based categorization
 * @param {string} title - Document title
 * @param {string} description - Document description
 * @returns {Object} - Category prediction with confidence score
 */
function fallbackCategorization(title = "", description = "") {
  const combinedText = `${title} ${description}`.trim();
  
  if (!combinedText) {
    return {
      category: "Institute",
      confidence: 0,
      scores: {},
      method: "fallback"
    };
  }

  const scores = {};
  
  // Calculate score for each category
  Object.keys(categoryKeywords).forEach((category) => {
    const keywords = categoryKeywords[category];
    const titleScore = calculateSimilarity(title, keywords);
    const descScore = calculateSimilarity(description, keywords);
    
    // Weight title more heavily (60%) than description (40%)
    scores[category] = (titleScore * 0.6) + (descScore * 0.4);
  });

  // Find the category with the highest score
  let maxScore = 0;
  let predictedCategory = "Institute";

  Object.keys(scores).forEach((category) => {
    if (scores[category] > maxScore) {
      maxScore = scores[category];
      predictedCategory = category;
    }
  });

  // Calculate confidence
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const confidence = totalScore > 0 ? maxScore / (totalScore / Object.keys(scores).length) : 0;
  const normalizedConfidence = Math.min(confidence, 1);

  return {
    category: predictedCategory,
    confidence: Math.round(normalizedConfidence * 100) / 100,
    scores: scores,
    allScores: Object.entries(scores)
      .map(([cat, score]) => ({ category: cat, score: Math.round(score * 100) / 100 }))
      .sort((a, b) => b.score - a.score),
    method: "keyword-matching"
  };
}

// /**
//  * Categorize a document using OpenAI GPT
//  * Falls back to keyword matching if OpenAI is unavailable
//  * @param {string} title - Document title
//  * @param {string} description - Document description
//  * @returns {Promise<Object>} - Category prediction with confidence score
//  */
// export async function categorizeDocument(title = "", description = "") {
//   const combinedText = `${title} ${description}`.trim();
  
//   if (!combinedText) {
//     return {
//       category: "Institute",
//       confidence: 0,
//       scores: {},
//       method: "default"
//     };
//   }

//   // Use OpenAI if available
//   if (openai) {
//     try {
//       const prompt = `Categorize this document into EXACTLY one of these categories: ${CATEGORIES.join(", ")}.

// Document Title: ${title}
// Document Description: ${description}

// IMPORTANT: Respond with ONLY the exact category name from the list above. Do not include any explanation or additional text.`;

//       const completion = await openai.chat.completions.create({
//         model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: `You are a document categorization expert for an educational institution. 
//             Your task is to categorize documents into one of these categories: ${CATEGORIES.join(", ")}.
//             Always respond with only the exact category name from the provided list. 
//             Be precise and consider the context of educational institutions.`
//           },
//           {
//             role: "user",
//             content: prompt
//           }
//         ],
//         temperature: 0.2, // Low temperature for consistent categorization
//         max_tokens: 30,
//         timeout: 10000 // 10 second timeout
//       });

//       const aiResponse = completion.choices[0].message.content.trim();
      
//       // Find matching category (case-insensitive, partial match)
//       const matchedCategory = CATEGORIES.find(cat => {
//         const lowerResponse = aiResponse.toLowerCase();
//         const lowerCategory = cat.toLowerCase();
//         return lowerResponse.includes(lowerCategory) || lowerCategory.includes(lowerResponse);
//       }) || null;

//       if (matchedCategory) {
//         // Calculate confidence based on response quality
//         // If response exactly matches, high confidence
//         const exactMatch = aiResponse.toLowerCase() === matchedCategory.toLowerCase();
//         const confidence = exactMatch ? 0.95 : 0.85;

//         return {
//           category: matchedCategory,
//           confidence: confidence,
//           scores: {},
//           allScores: CATEGORIES.map(cat => ({
//             category: cat,
//             score: cat === matchedCategory ? confidence : 0
//           })),
//           method: "openai-gpt",
//           rawResponse: aiResponse
//         };
//       } else {
//         // AI response didn't match any category, use fallback
//         console.warn(`OpenAI returned unrecognized category: "${aiResponse}". Using fallback.`);
//         const fallback = fallbackCategorization(title, description);
//         return {
//           ...fallback,
//           method: "openai-fallback",
//           rawResponse: aiResponse
//         };
//       }
//     } catch (error) {
//       console.error("OpenAI API Error:", error.message);
//       // Fallback to keyword matching on error
//       const fallback = fallbackCategorization(title, description);
//       return {
//         ...fallback,
//         method: "openai-error-fallback",
//         error: error.message
//       };
//     }
//   }

//   // No OpenAI API key, use fallback
//   console.warn("OpenAI API key not found. Using keyword-based categorization.");
//   return fallbackCategorization(title, description);
// }

// /**
//  * Batch categorize multiple documents
//  * @param {Array} documents - Array of documents with title and description
//  * @returns {Promise<Array>} - Array of categorized documents
//  */
// export async function categorizeDocuments(documents) {
//   const results = [];
//   for (const doc of documents) {
//     const categorization = await categorizeDocument(doc.title, doc.description);
//     results.push({
//       ...doc,
//       aiCategory: categorization.category,
//       aiConfidence: categorization.confidence,
//       aiScores: categorization.allScores || [],
//       aiMethod: categorization.method
//     });
//   }
//   return results;
// }
