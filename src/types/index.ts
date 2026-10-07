export interface StudentProfile {
  gpa: string;              // e.g. "3.5" or empty
  target_country: string;   // e.g. "USA" or comma-separated "USA, UK, Ireland"
  target_countries?: string[]; // array of selected countries e.g. ["Ireland", "UK", "Germany"]
  budget: string;           // e.g. "40000" (USD/year)
  preferred_major: string;  // e.g. "Data Science", "Computer Science", "MBA"
  ielts: string;            // e.g. "7.0" or empty
  counselor_notes: string;  // text input from counselor
  gemini_api_key?: string;  // optional Gemini API key
}

export interface Assumptions {
  ielts: number;          // Default: 6.5
  gpa: number;            // Default: 3.2
  budget: number;         // Default: 35000
  work_exp: number;       // Default: 0
  preferred_major: string;// Default: "Computer Science"
  target_country: string; // Default: "USA"
  target_countries?: string[];
}

export interface Eligibility {
  min_gpa: number;
  ielts_required: number;
  work_exp_years: number;
}

export interface CourseRecommendation {
  id: string;
  course_name: string;
  university: string;
  country: string;
  fees: number;
  currency: string;
  intake: string[];
  eligibility: Eligibility;
  rationale: string;
  living_cost: number;
  // Computed client-side / LLM fields
  admission_probability?: 'Safe' | 'Moderate' | 'Reach';
  industry?: string;
  estimated_starting_salary?: number;
  payback_period_years?: number;
}

export interface IndustrySalaryMap {
  [industry: string]: {
    baseline_usd: number;
    title: string;
  };
}

export interface RAGStepLog {
  step: number;
  message: string;
  timestamp: string;
}
