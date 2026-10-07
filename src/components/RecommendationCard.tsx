"use client";

import React from "react";
import { CourseRecommendation } from "@/types";
import {
  GraduationCap,
  MapPin,
  Calendar,
  Award,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Briefcase,
  HelpCircle,
} from "lucide-react";

interface RecommendationCardProps {
  course: CourseRecommendation;
  isSelectedForCompare: boolean;
  onToggleCompare: (course: CourseRecommendation) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  course,
  isSelectedForCompare,
  onToggleCompare,
}) => {
  // Admission probability styling (Safe, Moderate, Reach)
  const probStyle =
    course.admission_probability === "Safe"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : course.admission_probability === "Moderate"
      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
      : "bg-purple-500/10 text-purple-400 border-purple-500/30";

  return (
    <div
      className={`bg-slate-900/80 border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg transition-all hover:border-blue-500/40 flex flex-col justify-between gap-4 ${
        isSelectedForCompare
          ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/20"
          : "border-slate-800"
      }`}
    >
      {/* Top Header: University & Course Name */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
              {course.university}
            </span>
            <h3 className="text-base font-bold text-slate-100 leading-snug">
              {course.course_name}
            </h3>
          </div>

          {/* Compare Checkbox */}
          <button
            onClick={() => onToggleCompare(course)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isSelectedForCompare
                ? "bg-blue-600 text-white border-blue-500 shadow-md"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelectedForCompare}
              onChange={() => {}}
              className="w-3.5 h-3.5 rounded text-blue-600 cursor-pointer accent-blue-600"
            />
            <span>Compare</span>
          </button>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2 my-2">
          {/* Country */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            <MapPin className="w-3 h-3 text-emerald-400" />
            {course.country}
          </span>

          {/* Intake */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            <Calendar className="w-3 h-3 text-amber-400" />
            {course.intake.join(", ")}
          </span>

          {/* Admission Probability */}
          {course.admission_probability && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${probStyle}`}
            >
              <CheckCircle className="w-3 h-3" />
              {course.admission_probability} Match
            </span>
          )}
        </div>
      </div>

      {/* Rationale Box */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 leading-relaxed">
        <span className="font-semibold text-blue-400 block mb-1">
          💡 Personalized Recommendation Rationale:
        </span>
        {course.rationale}
      </div>

      {/* Fees & Requirements Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-[10px] text-slate-400 font-medium block">Annual Tuition</span>
          <span className="font-bold text-slate-100 text-sm">
            ${course.fees.toLocaleString()} {course.currency}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Est. Living: ${course.living_cost?.toLocaleString() || "15,000"}/yr
          </span>
        </div>

        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-[10px] text-slate-400 font-medium block">Requirements</span>
          <span className="font-semibold text-slate-200 block">
            Min GPA: <strong className="text-amber-400">{course.eligibility.min_gpa}</strong>
          </span>
          <span className="text-[10px] text-slate-400">
            IELTS: <strong className="text-rose-400">{course.eligibility.ielts_required}</strong>
          </span>
        </div>
      </div>

      {/* ROI & Post-Grad Payback Section */}
      <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-wider block">
              Estimated Post-Grad Starting Salary
            </span>
            <span className="font-bold text-emerald-400 text-sm">
              ${course.estimated_starting_salary?.toLocaleString() || "90,000"} USD/yr
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-medium block">Payback ROI</span>
          <span className="font-extrabold text-emerald-400 text-sm">
            ~{course.payback_period_years || 1.8} Yrs
          </span>
        </div>
      </div>
    </div>
  );
};
