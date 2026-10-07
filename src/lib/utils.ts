import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Eligibility, CourseRecommendation } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  const symbolMap: Record<string, string> = {
    USD: "$",
    GBP: "£",
    EUR: "€",
    CAD: "CA$",
    AUD: "A$",
  };
  const symbol = symbolMap[currency.toUpperCase()] || currency + " ";
  return `${symbol}${amount.toLocaleString("en-US")}`;
}

/**
 * Feature 2: Admission Probability Indicator
 * Compares student GPA & IELTS (actual or assumed) against retrieved eligibility requirements.
 * - Safe: GPA >= min_gpa + 0.2 AND IELTS >= ielts_required
 * - Target: GPA >= min_gpa AND IELTS >= ielts_required - 0.5
 * - Reach: Slightly below criteria
 */
export function calculateAdmissionProbability(
  studentGpa: number,
  studentIelts: number,
  eligibility: Eligibility
): "Safe" | "Target" | "Reach" {
  const gpaDiff = studentGpa - eligibility.min_gpa;
  const ieltsDiff = studentIelts - eligibility.ielts_required;

  if (gpaDiff >= 0.2 && ieltsDiff >= 0) {
    return "Safe";
  } else if (gpaDiff >= -0.15 && ieltsDiff >= -0.5) {
    return "Target";
  } else {
    return "Reach";
  }
}

/**
 * Feature 3: Dynamic ROI & Payback Calculation
 * Calculates Total Investment = fees + living_cost.
 * Estimates Payback Period in years = Total Investment / Estimated Annual Salary.
 */
export function calculatePayback(
  fees: number,
  livingCost: number,
  startingSalary: number
): {
  totalInvestment: number;
  paybackYears: number;
  roiPercentage: number;
} {
  const totalInvestment = fees + livingCost;
  // Assume payback based on annual post-grad net disposable savings (~65% of gross salary after tax/living)
  const annualSavings = startingSalary * 0.65;
  const paybackYears = annualSavings > 0 ? Number((totalInvestment / annualSavings).toFixed(1)) : 0;
  const roiPercentage = totalInvestment > 0 ? Math.round((startingSalary / totalInvestment) * 100) : 0;

  return {
    totalInvestment,
    paybackYears: Math.max(0.4, paybackYears),
    roiPercentage,
  };
}
