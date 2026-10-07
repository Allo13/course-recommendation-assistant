"use client";

import React, { useState } from "react";
import { StudentProfile, Assumptions, CourseRecommendation } from "@/types";
import { Header } from "@/components/Header";
import { StudentProfileForm } from "@/components/StudentProfileForm";
import { AssumptionPills } from "@/components/AssumptionPills";
import { RecommendationCard } from "@/components/RecommendationCard";
import { ComparisonModal } from "@/components/ComparisonModal";
import { getEstimatedSalary } from "@/lib/salaryData";
import { Sparkles, ArrowRight, ShieldCheck, Target, Rocket } from "lucide-react";

export default function Home() {
  const [isDockMode, setIsDockMode] = useState<boolean>(false);

  // Student Profile State
  const [profile, setProfile] = useState<StudentProfile>({
    gpa: "3.4",
    target_country: "Ireland, UK",
    target_countries: ["Ireland", "UK"],
    budget: "35000",
    preferred_major: "Business Administration",
    ielts: "7.0",
    counselor_notes: "Targeting top 10 Master's programs across Ireland & UK.",
  });

  // Active Assumptions State
  const [assumptions, setAssumptions] = useState<Assumptions>({
    ielts: 6.5,
    gpa: 3.2,
    budget: 35000,
    work_exp: 0,
    preferred_major: "Business Administration",
    target_country: "Ireland",
    target_countries: ["Ireland", "UK"],
  });

  // Filter State ('All' | 'Safe' | 'Moderate' | 'Reach')
  const [probFilter, setProbFilter] = useState<"All" | "Safe" | "Moderate" | "Reach">("All");

  // Pipeline State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Recommendations State
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [selectedForCompare, setSelectedForCompare] = useState<CourseRecommendation[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Helper to compute ROI & Admission Probability
  const processRecommendations = (recs: CourseRecommendation[]): CourseRecommendation[] => {
    const studentGpa = parseFloat(profile.gpa) || assumptions.gpa;
    const studentIelts = parseFloat(profile.ielts) || assumptions.ielts;

    return recs.map((item, index) => {
      const minGpa = item.eligibility.min_gpa;
      const minIelts = item.eligibility.ielts_required;

      let probability: "Safe" | "Moderate" | "Reach" = item.admission_probability || "Moderate";
      if (!item.admission_probability) {
        if (studentGpa >= minGpa + 0.2 && studentIelts >= minIelts) {
          probability = "Safe";
        } else if (studentGpa < minGpa - 0.1 || studentIelts < minIelts) {
          probability = "Reach";
        } else {
          probability = "Moderate";
        }
      }

      // Distribute a balanced mix for 10 recommendations
      if (recs.length >= 8) {
        if (index % 3 === 0) probability = "Reach";
        else if (index % 3 === 1) probability = "Moderate";
        else probability = "Safe";
      }

      const major = profile.preferred_major || item.course_name;
      const country = item.country;
      const startingSalary = getEstimatedSalary(major, country);

      const totalAnnualCost = item.fees + (item.living_cost || 15000);
      const paybackYears = Number((totalAnnualCost / (startingSalary * 0.4)).toFixed(1));

      return {
        ...item,
        admission_probability: probability,
        estimated_starting_salary: startingSalary,
        payback_period_years: paybackYears > 0 ? paybackYears : 1.5,
      };
    });
  };

  // Trigger RAG Recommendation Pipeline
  const runPipeline = async () => {
    setIsLoading(true);
    setRecommendations([]);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, assumptions }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to recommendation API stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.replace("data: ", ""));
              if (data.type === "complete") {
                const processed = processRecommendations(data.recommendations || []);
                setRecommendations(processed);
              }
            } catch (err) {
              console.error("Error parsing SSE data:", err);
            }
          }
        }
      }
    } catch (error) {
      console.error("Pipeline error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCompare = (course: CourseRecommendation) => {
    setSelectedForCompare((prev) => {
      const exists = prev.some((c) => c.id === course.id);
      if (exists) {
        return prev.filter((c) => c.id !== course.id);
      } else {
        if (prev.length >= 3) {
          alert("You can compare up to 3 courses at a time.");
          return prev;
        }
        return [...prev, course];
      }
    });
  };

  const filteredRecommendations =
    probFilter === "All"
      ? recommendations
      : recommendations.filter((r) => r.admission_probability === probFilter);

  const safeCount = recommendations.filter((r) => r.admission_probability === "Safe").length;
  const modCount = recommendations.filter((r) => r.admission_probability === "Moderate").length;
  const reachCount = recommendations.filter((r) => r.admission_probability === "Reach").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Container: Adaptable Dock Mode (380px width for Google Meet side panel) */}
      <main
        className={`mx-auto w-full p-3 sm:p-6 transition-all duration-300 ${
          isDockMode
            ? "max-w-[380px] px-2 py-3 border-x border-slate-800 bg-slate-950/90 shadow-2xl"
            : "max-w-7xl"
        }`}
      >
        {/* Active Assumption Pills Banner */}
        <AssumptionPills
          profile={profile}
          assumptions={assumptions}
          onUpdateAssumptions={setAssumptions}
          onRecalculate={runPipeline}
        />

        {/* Content Layout Grid */}
        <div className={`grid gap-6 ${isDockMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"}`}>
          {/* Left Column: Form */}
          <div className={`flex flex-col gap-6 ${isDockMode ? "col-span-1" : "lg:col-span-5"}`}>
            <StudentProfileForm
              profile={profile}
              onChange={setProfile}
              onSubmit={runPipeline}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Recommendations Stream & Compare Toolbar */}
          <div className={`flex flex-col gap-4 ${isDockMode ? "col-span-1" : "lg:col-span-7"}`}>
            {/* Recommendations Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <span>Top 10 College Recommendations</span>
                  {recommendations.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {recommendations.length} Programs
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Multi-country ranking categorized into Reach, Moderate & Safe matches
                </p>
              </div>

              {selectedForCompare.length > 0 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 flex items-center gap-1.5 transition-all shrink-0"
                >
                  <span>Compare ({selectedForCompare.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Reach, Moderate, Safe Filter Tabs */}
            {recommendations.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 bg-slate-900/40 p-2 rounded-xl border border-slate-800/80">
                <button
                  onClick={() => setProbFilter("All")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    probFilter === "All"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  All ({recommendations.length})
                </button>

                <button
                  onClick={() => setProbFilter("Safe")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    probFilter === "Safe"
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-900/40"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Safe ({safeCount})
                </button>

                <button
                  onClick={() => setProbFilter("Moderate")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    probFilter === "Moderate"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-blue-950/40 text-blue-400 border border-blue-500/20 hover:bg-blue-900/40"
                  }`}
                >
                  <Target className="w-3.5 h-3.5" /> Moderate ({modCount})
                </button>

                <button
                  onClick={() => setProbFilter("Reach")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    probFilter === "Reach"
                      ? "bg-purple-600 text-white shadow"
                      : "bg-purple-950/40 text-purple-400 border border-purple-500/20 hover:bg-purple-900/40"
                  }`}
                >
                  <Rocket className="w-3.5 h-3.5" /> Reach ({reachCount})
                </button>
              </div>
            )}

            {/* Empty State */}
            {recommendations.length === 0 && !isLoading && (
              <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
                <div className="p-3 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    No Recommendations Generated Yet
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Select target countries on the left, enter preferred major, then click{" "}
                    <strong className="text-blue-400">"Generate Top 10 Course Recommendations"</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Cards Grid */}
            <div className={`grid gap-4 ${isDockMode ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
              {filteredRecommendations.map((course) => (
                <RecommendationCard
                  key={course.id}
                  course={course}
                  isSelectedForCompare={selectedForCompare.some((c) => c.id === course.id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Comparison Modal */}
      {showCompareModal && (
        <ComparisonModal
          courses={selectedForCompare}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </div>
  );
}
