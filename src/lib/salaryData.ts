import { IndustrySalaryMap } from "@/types";

export const INDUSTRY_SALARIES: IndustrySalaryMap = {
  "Data Science / AI": {
    baseline_usd: 95000,
    title: "Data Science & AI Specialist",
  },
  "Computer Science / Software": {
    baseline_usd: 98000,
    title: "Software Engineer / Tech Architect",
  },
  "Business / MBA / Finance": {
    baseline_usd: 88000,
    title: "Financial Analyst / Management Consultant",
  },
  "Engineering (Civil/Mech/Elec)": {
    baseline_usd: 82000,
    title: "Project / Systems Engineer",
  },
  "Healthcare / Biotech": {
    baseline_usd: 78000,
    title: "Biomedical Scientist / Healthcare Admin",
  },
  "Design / Media / Humanities": {
    baseline_usd: 65000,
    title: "UX Designer / Media Specialist",
  },
};

/**
 * Country cost of living / starting salary multiplier map
 */
export const COUNTRY_SALARY_MULTIPLIERS: Record<string, number> = {
  USA: 1.0,
  UK: 0.85,
  Canada: 0.88,
  Australia: 0.92,
  Germany: 0.82,
  Ireland: 0.84,
  Singapore: 0.90,
};

export function getEstimatedSalary(major: string, country: string): number {
  let baseSalary = 85000; // fallback

  const matchedKey = Object.keys(INDUSTRY_SALARIES).find((key) =>
    major.toLowerCase().includes(key.split(" ")[0].toLowerCase())
  );

  if (matchedKey) {
    baseSalary = INDUSTRY_SALARIES[matchedKey].baseline_usd;
  } else if (major.toLowerCase().includes("data") || major.toLowerCase().includes("ai")) {
    baseSalary = 95000;
  } else if (major.toLowerCase().includes("comp") || major.toLowerCase().includes("soft")) {
    baseSalary = 98000;
  } else if (major.toLowerCase().includes("business") || major.toLowerCase().includes("mba") || major.toLowerCase().includes("finance")) {
    baseSalary = 88000;
  } else if (major.toLowerCase().includes("engineer")) {
    baseSalary = 82000;
  }

  const multiplier = COUNTRY_SALARY_MULTIPLIERS[country] || 1.0;
  return Math.round(baseSalary * multiplier);
}
