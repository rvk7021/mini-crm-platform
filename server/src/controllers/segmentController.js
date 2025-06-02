import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Customer from "../models/Customer.js";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Allowed fields and operators based on your Customer schema
const ALLOWED_FIELDS = new Set([
    'firstName', 'lastName', 'email', 'phone',
    'createdAt', 'totalSpent', 'preferredCategory',
    'preferredDay', 'preferredChannel', 'lastOrder', 'orders'
]);
const ALLOWED_OPERATORS = new Set([
    '$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$size',
    '$in', '$nin', '$regex', '$options', '$exists',
    '$and', '$or', '$not', '$nor'
]);

// Strict system prompt for Gemini
const systemPrompt = `
You are an expert MongoDB query generator. Your sole task is to translate the following natural language description into a valid MongoDB query.
Convert user prompts into **MongoDB filter JSON** using these allowed fields:

Fields:
- firstName (string)
- lastName (string)
- email (string)
- phone (string)
- createdAt (date, ISO)
- totalSpent (number)
- preferredCategory (string)
- preferredDay (string)
- preferredChannel (string)
- lastOrder (date, ISO)
- orders (array) - Use $size for count queries

Rules:
1. Use only allowed operators: $eq, $ne, $gt, $gte, $lt, $lte, $size, $in, $nin, $regex, $options, $exists, $and, $or, $not, $nor
2. For order counts: {"orders": { "$size": X }}
3. For email/name matching: Use "$regex" with "i" option
4. STRICTLY return only the raw filter JSON - NO markdown, NO code blocks, NO explanations, NO formatting, NO extra text.
5. NEVER include update/delete/aggregation or any operation other than filtering.

Examples:

Prompt: "Users who spent exactly $100"
{
  "totalSpent": { "$eq": 100 }
}

Prompt: "Customers with between 2 and 5 orders"
{
  "orders": { "$exists": true, "$gte": 2, "$lte": 5 }
}

Prompt: "Non-Gmail users who haven't ordered since 2023"
{
  "email": { "$not": { "$regex": "@gmail\\.com$", "$options": "i" } },
  "lastOrder": { "$lt": "2023-01-01" }
}

Prompt: "Users with phone numbers starting with +1"
{
  "phone": { "$regex": "^\\\\+1" }
}

Prompt: "Users with no preferred category set"
{
  "preferredCategory": { "$exists": false }
}

Prompt: "Users who ordered on weekends (Saturday/Sunday)"
{
  "preferredDay": { "$in": ["Saturday", "Sunday"] }
}

Prompt: "High spenders with email but no phone"
{
  "totalSpent": { "$gt": 1000 },
  "email": { "$exists": true },
  "phone": { "$exists": false }
}

Prompt: "Users created in last 30 days with at least 1 order"
{
  "createdAt": { "$gte": "2023-06-01" },
  "orders.0": { "$exists": true }
}

Prompt: "Users with invalid email formats"
{
  "email": { "$not": { "$regex": "^[^@]+@[^@]+\\.[^@]+$" } }
}

Prompt: "Users who prefer SMS but haven't ordered this year"
{
  "preferredChannel": "SMS",
  "lastOrder": { "$lt": "2023-01-01" }
}
`;

function validateFilter(filter, path = []) {
    if (typeof filter !== 'object' || filter === null) return null;

    for (const key in filter) {
        const fullPath = [...path, key];

        // Block update operators
        if (key.startsWith('$') && !ALLOWED_OPERATORS.has(key)) {
            return `Disallowed operator ${key} at ${fullPath.join('.')}`;
        }

        if (!key.startsWith('$') && !ALLOWED_FIELDS.has(key)) {
            return `Disallowed field ${key} at ${fullPath.join('.')}`;
        }

        const value = filter[key];
        if (typeof value === 'object') {
            const nested = validateFilter(value, fullPath);
            if (nested) return nested;
        }
    }

    return null;
}

// Sanitizer for AI response (removes markdown/code blocks)
function sanitizeAIResponse(responseText) {
    return responseText
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/```/g, '')
        .replace(/^json\s*/i, '')
        .trim();
}

// Main handler
export const promptSegment = async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-05-20",
            contents: [
                { role: "model", parts: [{ text: systemPrompt }] },
                { role: "user", parts: [{ text: prompt }] }
            ],
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 512
            }
        });

        // Extract AI response text
        const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

        // Sanitize (remove markdown/code blocks)
        const sanitizedResponse = sanitizeAIResponse(responseText);

        if (!sanitizedResponse) {
            return res.status(400).json({
                success: false,
                message: "Empty response from AI model",
                rawResponse: responseText
            });
        }

        let filterQuery;
        try {
            filterQuery = JSON.parse(sanitizedResponse);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Invalid JSON response from AI",
                rawResponse: responseText
            });
        }

        // Validate filter (block malicious actions)
        const validationError = validateFilter(filterQuery);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: "Failed to process your prompt",
                error: validationError
            });
        }

        let query = Customer.find(filterQuery).lean();

        // Optional: Add sorting for "top N" queries
        if (/top\s*\d+/i.test(prompt)) {
            const match = prompt.match(/top\s*(\d+)/i);
            const limit = Math.min(parseInt(match[1], 10) || 10, 100);
            if (/spend|spent|total\s*spent|total\s*spend/i.test(prompt)) {
                query = query.sort({ totalSpent: -1 }).limit(limit);
            }
        }

        const customers = await query;

        return res.status(200).json({
            success: true,
            filter: filterQuery,
            count: customers.length,
            data: customers
        });

    } catch (error) {
        console.error("Processing error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to process your prompt",
            error: error.message
        });
    }
};

export const saveSegment = async (req,res) => {
    const 
}