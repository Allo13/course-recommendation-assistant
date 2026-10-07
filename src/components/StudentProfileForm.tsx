"use client";

import React from "react";
import { StudentProfile } from "@/types";
import {
  User,
  GraduationCap,
  Globe,
  DollarSign,
  Award,
  BookOpen,
  FileText,
  Sparkles,
  RotateCcw,
  Check,
} from "lucide-react";

interface StudentProfileFormProps {
  profile: StudentProfile;
  onChange: (profile: StudentProfile) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const AVAILABLE_COUNTRIES = ["Ireland", "UK", "USA", "Canada", "Australia", "Germany"];



export const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
  profile,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const selectedCountries =
    profile.target_countries && profile.target_countries.length > 0
      ? profile.target_countries
      : profile.target_country
      ? profile.target_country.split(",").map((c) => c.trim()).filter(Boolean)
      : ["USA"];

  const handleChange = (field: keyof StudentProfile, value: any) => {
    onChange({ ...profile, [field]: value });
  };

  const toggleCountry = (country: string) => {
    let updated: string[];
    if (selectedCountries.includes(country)) {
      updated = selectedCountries.filter((c) => c !== country);
      if (updated.length === 0) updated = [country]; // Keep at least one
    } else {
      updated = [...selectedCountries, country];
    }
    onChange({
      ...profile,
      target_countries: updated,
      target_country: updated.join(", "),
    });
  };

  const handleClear = () => {
    onChange({
      gpa: "",
      target_country: "USA",
      target_countries: ["USA"],
      budget: "",
      preferred_major: "",
      ielts: "",
      counselor_notes: "",
    });
  };



  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Form Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Student Profile Input
            </h2>
            <p className="text-[11px] text-slate-400">
              Select target countries & enter known info for Top 10 college ranking.
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          type="button"
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          title="Clear form inputs"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>



      {/* Multi-Select Target Countries */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          Target Countries (Select Multiple)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_COUNTRIES.map((c) => {
            const isSelected = selectedCountries.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCountry(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/30"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                <span>{c}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Preferred Major */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            Preferred Major / Specialization
          </label>
          <input
            type="text"
            placeholder="e.g. Business Administration, Data Science, Biotechnology"
            value={profile.preferred_major}
            onChange={(e) => handleChange("preferred_major", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none transition-all"
          />
        </div>

        {/* Annual Tuition Budget */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            Max Annual Budget (USD/yr)
          </label>
          <input
            type="number"
            placeholder="e.g. 35000 (Blank = Assumed $35k)"
            value={profile.budget}
            onChange={(e) => handleChange("budget", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none transition-all"
          />
        </div>

        {/* GPA */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
            GPA (4.0 Scale)
          </label>
          <input
            type="number"
            step="0.1"
            min="2.0"
            max="4.0"
            placeholder="e.g. 3.4 (Blank = Assumed 3.2)"
            value={profile.gpa}
            onChange={(e) => handleChange("gpa", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none transition-all"
          />
        </div>

        {/* IELTS */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-rose-400" />
            IELTS Score
          </label>
          <input
            type="number"
            step="0.5"
            min="4.0"
            max="9.0"
            placeholder="e.g. 7.0 (Blank = Assumed 6.5)"
            value={profile.ielts}
            onChange={(e) => handleChange("ielts", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none transition-all"
          />
        </div>

        {/* Live Call Notes / Transcript */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            Counselor Live Call Notes & Transcript
          </label>
          <textarea
            rows={3}
            placeholder="Paste transcript or type live call observations, student career goals, financial constraints..."
            value={profile.counselor_notes}
            onChange={(e) => handleChange("counselor_notes", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-4 h-4 animate-spin-slow" />
        <span>{isLoading ? "Generating Top 10 Recommendations..." : "Generate Top 10 Course Recommendations"}</span>
      </button>
    </div>
  );
};
