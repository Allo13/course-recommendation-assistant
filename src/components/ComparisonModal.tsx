"use client";

import React from "react";
import { CourseRecommendation } from "@/types";
import { X, CheckCircle, MapPin, DollarSign, Calendar, Award, TrendingUp } from "lucide-react";

interface ComparisonModalProps {
  courses: CourseRecommendation[];
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ courses, onClose }) => {
  if (courses.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>University Course Comparison</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {courses.length} Selected
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side analysis for live student decision making
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Comparison Table */}
        <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-3 text-xs font-semibold text-slate-400 uppercase w-44">Feature</th>
                {courses.map((c) => (
                  <th key={c.id} className="p-3 text-sm font-bold text-white min-w-[200px]">
                    <div className="text-blue-400 text-xs font-medium uppercase">{c.university}</div>
                    <div>{c.course_name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
              {/* Country */}
              <tr>
                <td className="p-3 font-semibold text-slate-400">Country</td>
                {courses.map((c) => (
                  <td key={c.id} className="p-3 font-medium text-slate-200">
                    {c.country}
                  </td>
                ))}
              </tr>

              {/* Annual Tuition */}
              <tr>
                <td className="p-3 font-semibold text-slate-400">Tuition Fee</td>
                {courses.map((c) => (
                  <td key={c.id} className="p-3 font-bold text-amber-400">
                    ${c.fees.toLocaleString()} {c.currency}/yr
                  </td>
                ))}
              </tr>

              {/* Living Expenses */}
              <tr>
                <td className="p-3 font-semibold text-slate-400">Est. Living Expenses</td>
                {courses.map((c) => (
                  <td key={c.id} className="p-3">
                    ${c.living_cost?.toLocaleString() || "15,000"}/yr
                  </td>
                ))}
              </tr>

              {/* Min Eligibility */}
              <tr>
                <td className="p-3 font-semibold text-slate-400">Eligibility Criteria</td>
                {courses.map((c) => (
                  <td key={c.id} className="p-3">
                    <div>GPA: {c.eligibility.min_gpa}</div>
                    <div>IELTS: {c.eligibility.ielts_required}</div>
                  </td>
                ))}
              </tr>

              {/* Post-Grad Salary */}
              <tr>
                <td className="p-3 font-semibold text-slate-400">Est. Starting Salary</td>
                {courses.map((c) => (
                  <td key={c.id} className="p-3 font-bold text-emerald-400">
                    ${c.estimated_starting_salary?.toLocaleString() || "90,000"} USD/yr
                  </td>
                ))}
              </tr>

              {/* Payback ROI */}
              <tr>
                <td className="p-3 font-semibold text-slate-400">Payback Period</td>
                {courses.map((c) => (
                  <td key={c.id} className="p-3 font-extrabold text-emerald-400">
                    ~{c.payback_period_years || 1.8} Years
                  </td>
                ))}
              </tr>

              {/* Intakes */}
              <tr>
                <td className="p-3 font-semibold text-slate-400">Available Intakes</td>
                {courses.map((c) => (
                  <td key={c.id} className="p-3">
                    {c.intake.join(", ")}
                  </td>
                ))}
              </tr>

              {/* Rationale */}
              <tr>
                <td className="p-3 font-semibold text-slate-400">Recommendation Rationale</td>
                {courses.map((c) => (
                  <td key={c.id} className="p-3 text-[11px] leading-relaxed text-slate-300">
                    {c.rationale}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
