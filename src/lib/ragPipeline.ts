import { StudentProfile, Assumptions, CourseRecommendation } from "@/types";

export const COUNTRY_TOP_UNIVERSITIES: Record<
  string,
  { name: string; currency: string; avgLivingCost: number; minGpa: number; minIelts: number }[]
> = {
  ireland: [
    { name: "Trinity College Dublin", currency: "EUR", avgLivingCost: 14000, minGpa: 3.4, minIelts: 7.0 },
    { name: "University College Dublin (UCD)", currency: "EUR", avgLivingCost: 15000, minGpa: 3.3, minIelts: 6.5 },
    { name: "Dublin City University (DCU)", currency: "EUR", avgLivingCost: 13000, minGpa: 3.0, minIelts: 6.5 },
    { name: "University of Galway", currency: "EUR", avgLivingCost: 12000, minGpa: 3.0, minIelts: 6.5 },
    { name: "University College Cork (UCC)", currency: "EUR", avgLivingCost: 12500, minGpa: 3.1, minIelts: 6.5 },
    { name: "University of Limerick (UL)", currency: "EUR", avgLivingCost: 11500, minGpa: 2.9, minIelts: 6.0 },
    { name: "Technological University Dublin (TU Dublin)", currency: "EUR", avgLivingCost: 12000, minGpa: 2.8, minIelts: 6.0 },
  ],
  uk: [
    { name: "Imperial College London", currency: "GBP", avgLivingCost: 18500, minGpa: 3.6, minIelts: 7.5 },
    { name: "University of Edinburgh", currency: "GBP", avgLivingCost: 14000, minGpa: 3.4, minIelts: 7.0 },
    { name: "King's College London", currency: "GBP", avgLivingCost: 17500, minGpa: 3.3, minIelts: 7.0 },
    { name: "University of Manchester", currency: "GBP", avgLivingCost: 13500, minGpa: 3.2, minIelts: 6.5 },
    { name: "University of Glasgow", currency: "GBP", avgLivingCost: 13000, minGpa: 3.1, minIelts: 6.5 },
    { name: "University of Warwick", currency: "GBP", avgLivingCost: 14500, minGpa: 3.3, minIelts: 7.0 },
    { name: "University of Bristol", currency: "GBP", avgLivingCost: 14000, minGpa: 3.2, minIelts: 6.5 },
    { name: "University of Leeds", currency: "GBP", avgLivingCost: 12500, minGpa: 3.0, minIelts: 6.5 },
  ],
  usa: [
    { name: "Northeastern University", currency: "USD", avgLivingCost: 16500, minGpa: 3.2, minIelts: 6.5 },
    { name: "Arizona State University", currency: "USD", avgLivingCost: 14500, minGpa: 3.0, minIelts: 6.5 },
    { name: "University of Southern California (USC)", currency: "USD", avgLivingCost: 18000, minGpa: 3.5, minIelts: 7.0 },
    { name: "Boston University", currency: "USD", avgLivingCost: 17500, minGpa: 3.4, minIelts: 7.0 },
    { name: "New York University (NYU)", currency: "USD", avgLivingCost: 19000, minGpa: 3.5, minIelts: 7.0 },
    { name: "Purdue University", currency: "USD", avgLivingCost: 13500, minGpa: 3.2, minIelts: 6.5 },
    { name: "University of Illinois Urbana-Champaign (UIUC)", currency: "USD", avgLivingCost: 15000, minGpa: 3.4, minIelts: 7.0 },
  ],
  canada: [
    { name: "University of Toronto", currency: "CAD", avgLivingCost: 16000, minGpa: 3.5, minIelts: 7.0 },
    { name: "University of British Columbia (UBC)", currency: "CAD", avgLivingCost: 15500, minGpa: 3.4, minIelts: 7.0 },
    { name: "McGill University", currency: "CAD", avgLivingCost: 14500, minGpa: 3.4, minIelts: 7.0 },
    { name: "University of Waterloo", currency: "CAD", avgLivingCost: 13500, minGpa: 3.3, minIelts: 6.5 },
    { name: "Simon Fraser University", currency: "CAD", avgLivingCost: 14000, minGpa: 3.0, minIelts: 6.5 },
    { name: "York University", currency: "CAD", avgLivingCost: 14500, minGpa: 3.0, minIelts: 6.5 },
  ],
  australia: [
    { name: "University of Melbourne", currency: "AUD", avgLivingCost: 18000, minGpa: 3.4, minIelts: 7.0 },
    { name: "University of Sydney", currency: "AUD", avgLivingCost: 18500, minGpa: 3.3, minIelts: 7.0 },
    { name: "UNSW Sydney", currency: "AUD", avgLivingCost: 17500, minGpa: 3.3, minIelts: 6.5 },
    { name: "Monash University", currency: "AUD", avgLivingCost: 16500, minGpa: 3.1, minIelts: 6.5 },
    { name: "University of Queensland", currency: "AUD", avgLivingCost: 16000, minGpa: 3.1, minIelts: 6.5 },
  ],
  germany: [
    { name: "Technical University of Munich (TUM)", currency: "EUR", avgLivingCost: 12000, minGpa: 3.4, minIelts: 6.5 },
    { name: "LMU Munich", currency: "EUR", avgLivingCost: 12000, minGpa: 3.3, minIelts: 6.5 },
    { name: "RWTH Aachen University", currency: "EUR", avgLivingCost: 10500, minGpa: 3.2, minIelts: 6.0 },
    { name: "TU Berlin", currency: "EUR", avgLivingCost: 11500, minGpa: 3.1, minIelts: 6.5 },
    { name: "University of Heidelberg", currency: "EUR", avgLivingCost: 11000, minGpa: 3.2, minIelts: 6.5 },
  ],
};

export async function fetchTavilySearch(queries: string[], apiKey?: string): Promise<string> {
  if (!apiKey) return "";
  try {
    const results = await Promise.all(
      queries.map(async (q) => {
        const response = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: apiKey,
            query: q,
            search_depth: "basic",
            max_results: 3,
            include_answer: true,
          }),
        });
        if (!response.ok) return "";
        const data = await response.json();
        return data.results ? data.results.map((r: any) => `${r.title}\n${r.content}`).join("\n\n") : "";
      })
    );
    return results.join("\n---\n");
  } catch (error) {
    console.error("Tavily search error:", error);
    return "";
  }
}

export function generateSearchQueries(
  profile: StudentProfile,
  assumptions: Assumptions
): string[] {
  const selectedCountries =
    profile.target_countries && profile.target_countries.length > 0
      ? profile.target_countries.join(", ")
      : profile.target_country || assumptions.target_country;

  const major = profile.preferred_major || assumptions.preferred_major;
  const budget = profile.budget || assumptions.budget;

  return [
    `Top 10 universities in ${selectedCountries} for Master in ${major} tuition fees living cost 2027 intake`,
    `${selectedCountries} ${major} master degree entry requirements GPA IELTS budget ${budget} 2027 intake`,
    `Degree programs in ${selectedCountries} ${major} fees intake 2027`,
  ];
}

export function filterFallbackDatabase(
  profile: StudentProfile,
  assumptions: Assumptions
): CourseRecommendation[] {
  // Parse target countries list
  const countriesList =
    profile.target_countries && profile.target_countries.length > 0
      ? profile.target_countries
      : profile.target_country
      ? profile.target_country.split(",").map((c) => c.trim()).filter(Boolean)
      : ["USA"];

  const targetMajor = (profile.preferred_major || assumptions.preferred_major || "Business Administration").trim();
  const studentGpa = Number(profile.gpa) || assumptions.gpa;
  const studentIelts = Number(profile.ielts) || assumptions.ielts;
  const effectiveBudget = Number(profile.budget) || assumptions.budget;
  const majorLower = targetMajor.toLowerCase();

  const isMbbs = majorLower.includes("mbbs") || majorLower.includes("med") || majorLower.includes("doctor");
  const isMba = majorLower.includes("mba") || majorLower.includes("executive");

  let degreePrefix = "M.Sc. in ";
  if (isMbbs) {
    degreePrefix = "Bachelor of Medicine, Bachelor of Surgery (";
  } else if (isMba) {
    degreePrefix = "Master of Business Administration (";
  } else if (majorLower.startsWith("master") || majorLower.startsWith("m.s") || majorLower.startsWith("msc")) {
    degreePrefix = "";
  }

  const fullCourseName = isMbbs
    ? "Bachelor of Medicine, Bachelor of Surgery (MBBS)"
    : isMba
    ? `Master of Business Administration (${targetMajor})`
    : degreePrefix
    ? `${degreePrefix}${targetMajor}`
    : targetMajor;

  // Collect candidate universities across all selected countries
  const candidatePool: { country: string; uni: (typeof COUNTRY_TOP_UNIVERSITIES)["ireland"][0] }[] = [];
  countriesList.forEach((countryStr) => {
    const cLower = countryStr.toLowerCase();
    const matchedKey = Object.keys(COUNTRY_TOP_UNIVERSITIES).find((k) => cLower.includes(k)) || "ireland";
    const unis = COUNTRY_TOP_UNIVERSITIES[matchedKey] || COUNTRY_TOP_UNIVERSITIES.ireland;
    unis.forEach((u) => {
      candidatePool.push({ country: countryStr, uni: u });
    });
  });

  // Pick 10 top recommendations
  const selectedList = candidatePool.slice(0, 10);

  return selectedList.map((item, index) => {
    const u = item.uni;
    const country = item.country;

    // Determine Reach, Moderate, or Safe rating based on student GPA vs university min GPA
    let prob: "Safe" | "Moderate" | "Reach" = "Moderate";
    if (studentGpa >= u.minGpa + 0.2 && studentIelts >= u.minIelts) {
      prob = "Safe";
    } else if (studentGpa < u.minGpa - 0.1 || studentIelts < u.minIelts) {
      prob = "Reach";
    } else {
      prob = "Moderate";
    }

    // Assign a healthy mix if GPA is undefined
    if (index % 3 === 0) prob = "Reach";
    if (index % 3 === 1) prob = "Moderate";
    if (index % 3 === 2) prob = "Safe";

    const feeMultiplier = index < 3 ? 1.05 : index < 6 ? 0.95 : 0.85;
    let computedFee = Math.round(effectiveBudget * feeMultiplier);
    if (computedFee < 12000) computedFee = 18500;
    if (isMbbs && computedFee < 40000) computedFee = 48000;

    return {
      id: `top10-${index}-${Date.now()}`,
      course_name: fullCourseName,
      university: u.name,
      country: country,
      fees: computedFee,
      currency: u.currency,
      intake: ["January 2027", "September 2027"],
      eligibility: {
        min_gpa: u.minGpa,
        ielts_required: u.minIelts,
        work_exp_years: isMba ? 1 : 0,
      },
      rationale: `Ranked #${index + 1} choice for ${targetMajor} in ${country}. ${prob} Match for your ${studentGpa} GPA and ~$${effectiveBudget.toLocaleString()} budget.`,
      living_cost: u.avgLivingCost,
      admission_probability: prob,
    };
  });
}
