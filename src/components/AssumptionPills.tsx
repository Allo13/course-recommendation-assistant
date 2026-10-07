"use client";

import React, { useState } from "react";
import { Assumptions, StudentProfile } from "@/types";
import { Sliders, Check, RotateCcw, AlertCircle, ChevronDown } from "lucide-react";

interface AssumptionPillsProps {
  profile: StudentProfile;
  assumptions: Assumptions;
  onUpdateAssumptions: (updated: Assumptions) => void;
  onRecalculate?: () => void;
}

export const AssumptionPills: React.FC<AssumptionPillsProps> = ({
  profile,
  assumptions,
  onUpdateAssumptions,
  onRecalculate,
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);

  // Determine which fields are relying on assumptions because student profile input is blank
  const isIeltsAssumed = !profile.ielts || profile.ielts.trim() === "";
  const isGpaAssumed = !profile.gpa || profile.gpa.trim() === "";
  const isBudgetAssumed = !profile.budget || profile.budget.trim() === "";
  const isCountryAssumed = !profile.target_country || profile.target_country.trim() === "";
  const isMajorAssumed = !profile.preferred_major || profile.preferred_major.trim() === "";

  const hasAnyAssumptions =
    isIeltsAssumed || isGpaAssumed || isBudgetAssumed || isCountryAssumed || isMajorAssumed;

  if (!hasAnyAssumptions) {
    return null;
  }

  const handleSliderChange = (key: keyof Assumptions, val: number | string) => {
    const updated = { ...assumptions, [key]: val };
    onUpdateAssumptions(updated);
    if (onRecalculate) {
      onRecalculate();
    }
  };

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 sm:p-4 mb-4 backdrop-blur-sm transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Active Assumption Pills (Feature 1)
          </span>
        </div>
        <span className="text-[11px] text-amber-700 dark:text-amber-400/90 font-medium">
          Click any pill to adjust & instantly recalculate
        </span>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {/* IELTS Assumption Pill */}
        {isIeltsAssumed && (
          <div className="relative">
            <button
              onClick={() => setEditingField(editingField === "ielts" ? null : "ielts")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                editingField === "ielts"
                  ? "bg-amber-500 text-white border-amber-600 ring-2 ring-amber-400/50 shadow-md"
                  : "bg-white dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700/60 hover:bg-amber-100/70"
              }`}
            >
              <span>Assumed: IELTS {assumptions.ielts}</span>
              <Sliders className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </button>

            {editingField === "ielts" && (
              <div className="absolute left-0 top-full mt-2 z-30 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-xl">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <span>Target IELTS Score</span>
                  <span className="font-bold text-amber-600">{assumptions.ielts}</span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="9.0"
                  step="0.5"
                  value={assumptions.ielts}
                  onChange={(e) => handleSliderChange("ielts", parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>5.0</span>
                  <span>6.5</span>
                  <span>9.0</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GPA Assumption Pill */}
        {isGpaAssumed && (
          <div className="relative">
            <button
              onClick={() => setEditingField(editingField === "gpa" ? null : "gpa")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                editingField === "gpa"
                  ? "bg-amber-500 text-white border-amber-600 ring-2 ring-amber-400/50 shadow-md"
                  : "bg-white dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700/60 hover:bg-amber-100/70"
              }`}
            >
              <span>Assumed: GPA {assumptions.gpa} / 4.0</span>
              <Sliders className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </button>

            {editingField === "gpa" && (
              <div className="absolute left-0 top-full mt-2 z-30 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-xl">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <span>Assumed GPA</span>
                  <span className="font-bold text-amber-600">{assumptions.gpa}</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="4.0"
                  step="0.1"
                  value={assumptions.gpa}
                  onChange={(e) => handleSliderChange("gpa", parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>2.0</span>
                  <span>3.0</span>
                  <span>4.0</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Budget Assumption Pill */}
        {isBudgetAssumed && (
          <div className="relative">
            <button
              onClick={() => setEditingField(editingField === "budget" ? null : "budget")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                editingField === "budget"
                  ? "bg-amber-500 text-white border-amber-600 ring-2 ring-amber-400/50 shadow-md"
                  : "bg-white dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700/60 hover:bg-amber-100/70"
              }`}
            >
              <span>Assumed: Budget ${assumptions.budget.toLocaleString()}</span>
              <Sliders className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </button>

            {editingField === "budget" && (
              <div className="absolute left-0 top-full mt-2 z-30 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-xl">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <span>Target Annual Budget</span>
                  <span className="font-bold text-amber-600">${assumptions.budget.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="80000"
                  step="2500"
                  value={assumptions.budget}
                  onChange={(e) => handleSliderChange("budget", parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>$10k</span>
                  <span>$40k</span>
                  <span>$80k</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Target Country Assumption Pill */}
        {isCountryAssumed && (
          <div className="relative">
            <button
              onClick={() => setEditingField(editingField === "country" ? null : "country")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                editingField === "country"
                  ? "bg-amber-500 text-white border-amber-600 ring-2 ring-amber-400/50 shadow-md"
                  : "bg-white dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700/60 hover:bg-amber-100/70"
              }`}
            >
              <span>Assumed: Country {assumptions.target_country}</span>
              <ChevronDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </button>

            {editingField === "country" && (
              <div className="absolute left-0 top-full mt-2 z-30 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xl">
                {["USA", "UK", "Canada", "Australia", "Germany", "Ireland"].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      handleSliderChange("target_country", c);
                      setEditingField(null);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                      assumptions.target_country === c
                        ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>{c}</span>
                    {assumptions.target_country === c && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
