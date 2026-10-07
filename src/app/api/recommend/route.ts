import { NextRequest, NextResponse } from "next/server";
import { StudentProfile, Assumptions, CourseRecommendation } from "@/types";
import {
  generateSearchQueries,
  fetchTavilySearch,
  filterFallbackDatabase,
} from "@/lib/ragPipeline";

export const runtime = "nodejs";

async function fetchGeminiWithModels(promptText: string, apiKey: string): Promise<CourseRecommendation[]> {
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-2.0-flash-exp",
    "gemini-2.5-flash",
  ];

  for (const model of models) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            tools: [{ googleSearch: {} }],
          }),
        }
      );

      if (geminiRes.ok) {
        const resData = await geminiRes.json();
        const candidateParts = resData.candidates?.[0]?.content?.parts;
        if (candidateParts) {
          const textOutput = candidateParts.map((p: any) => p.text || "").join("\n");
          if (textOutput) {
            const cleanedText = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
            const jsonMatch = cleanedText.match(/\[\s*\{[\s\S]*\}\s*\]/);
            const jsonString = jsonMatch ? jsonMatch[0] : cleanedText;

            const parsed = JSON.parse(jsonString);
            if (Array.isArray(parsed) && parsed.length > 0) {
              console.log(`Live Web Search succeeded via Gemini model: ${model}`);
              return parsed.map((item, idx) => ({
                ...item,
                id: `live-gemini-${idx}-${Date.now()}`,
              }));
            }
          }
        }
      } else {
        const errText = await geminiRes.text();
        console.warn(`Gemini model '${model}' error (${geminiRes.status}):`, errText);
      }
    } catch (err) {
      console.error(`Error calling Gemini model '${model}':`, err);
    }
  }

  return [];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: StudentProfile = body.profile || {};
    const assumptions: Assumptions = body.assumptions || {
      ielts: 6.5,
      gpa: 3.2,
      budget: 35000,
      work_exp: 0,
      preferred_major: "Computer Science",
      target_country: "USA",
    };

    const targetCountries =
      profile.target_countries && profile.target_countries.length > 0
        ? profile.target_countries.join(", ")
        : profile.target_country || assumptions.target_country;

    const activeGeminiKey =
      process.env.GEMINI_API_KEY?.trim() ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ||
      profile.gemini_api_key?.trim();

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: object) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        sendEvent({
          type: "status",
          step: 1,
          message: "Analyzing student profile & multi-country criteria...",
        });

        const queries = generateSearchQueries(profile, assumptions);
        sendEvent({
          type: "status",
          step: 2,
          message: `Generated targeted search queries for "${profile.preferred_major || assumptions.preferred_major}" across ${targetCountries}...`,
          queries,
        });

        sendEvent({
          type: "status",
          step: 3,
          message: activeGeminiKey
            ? "Executing live web search & Google Search Grounding for Top 10 colleges..."
            : "Scanning university catalog & tuition database...",
        });

        const tavilyKey = process.env.TAVILY_API_KEY;
        let retrievedMarkdown = "";
        if (tavilyKey) {
          retrievedMarkdown = await fetchTavilySearch(queries, tavilyKey);
        }

        sendEvent({
          type: "status",
          step: 4,
          message: "Extracting verified Top 10 college recommendations (Reach, Moderate, Safe)...",
        });

        let recommendations: CourseRecommendation[] = [];

        if (activeGeminiKey) {
          const promptText = `You are an expert study abroad admissions counselor. Search Google live for real university courses for upcoming 2027 / 2028 intakes matching this student profile:
Student Goal:
- Preferred Major / Specialization: ${profile.preferred_major || assumptions.preferred_major}
- Target Countries: ${targetCountries}
- Annual Budget: $${profile.budget || assumptions.budget} USD/yr
- Student GPA: ${profile.gpa || assumptions.gpa}
- IELTS Score: ${profile.ielts || assumptions.ielts}
- Counselor Notes: ${profile.counselor_notes || "None"}

Search Context:
${retrievedMarkdown || "Search Google live for verified university programs across the target countries."}

Task: Find 10 real, currently offered university courses/degrees across ${targetCountries} specifically matching ${profile.preferred_major || assumptions.preferred_major} for 2027 / 2028 intake. Rate each course's admission probability for this student as "Reach", "Moderate", or "Safe".

Output ONLY a valid JSON array of 10 objects matching this exact JSON schema (no text outside JSON):
[
  {
    "course_name": "M.Sc. in Business Administration",
    "university": "Trinity Business School",
    "country": "Ireland",
    "fees": 24500,
    "currency": "EUR",
    "intake": ["January 2027", "September 2027","January 2028", "September 2028"],
    "eligibility": {
      "min_gpa": 3.2,
      "ielts_required": 6.5,
      "work_exp_years": 0
    },
    "rationale": "Trinity Business School is triple-accredited located in Dublin's financial district.",
    "living_cost": 14000,
    "admission_probability": "Moderate"
  }
]`;

          recommendations = await fetchGeminiWithModels(promptText, activeGeminiKey);
        }

        // Fallback to high-precision domain database if Gemini key not set or failed
        if (recommendations.length === 0) {
          recommendations = filterFallbackDatabase(profile, assumptions);
        }

        sendEvent({
          type: "status",
          step: 5,
          message: "Finalizing Top 10 course recommendations & payback ROI metrics...",
        });

        sendEvent({
          type: "complete",
          recommendations,
        });

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in /api/recommend route:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
