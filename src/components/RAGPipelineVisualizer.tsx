"use client";

import React from "react";
import { RAGStepLog } from "@/types";
import { CheckCircle2, Loader2, Search, Database, Cpu, DollarSign, ListFilter } from "lucide-react";

interface RAGPipelineVisualizerProps {
  logs: RAGStepLog[];
  currentStep: number;
  queries: string[];
  isComplete: boolean;
}

const RAG_STEPS = [
  { step: 1, title: "Profile Analysis", icon: ListFilter, desc: "Process profile & assumptions" },
  { step: 2, title: "Query Expansion", icon: Search, desc: "Generate targeted web search queries" },
  { step: 3, title: "Retrieval", icon: Database, desc: "Scan web & university databases via Tavily" },
  { step: 4, title: "LLM Extraction", icon: Cpu, desc: "Extract tuition fees, IELTS & GPA criteria" },
  { step: 5, title: "ROI Calculation", icon: DollarSign, desc: "Compute post-grad salary & payback period" },
];

export const RAGPipelineVisualizer: React.FC<RAGPipelineVisualizerProps> = ({
  logs,
  currentStep,
  queries,
  isComplete,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Live RAG Retrieval Pipeline Execution
            </h3>
            <p className="text-[11px] text-slate-400">
              {isComplete
                ? "Pipeline execution completed successfully"
                : `Active Execution Phase: Step ${currentStep} of 5`}
            </p>
          </div>
        </div>
        {isComplete && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
          </span>
        )}
      </div>

      {/* Steps Visual Progress Bar */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {RAG_STEPS.map((s) => {
          const Icon = s.icon;
          const isDone = s.step < currentStep || isComplete;
          const isCurrent = s.step === currentStep && !isComplete;

          return (
            <div
              key={s.step}
              className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                isDone
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                  : isCurrent
                  ? "bg-blue-950/40 border-blue-500/50 text-blue-300 ring-2 ring-blue-500/20 animate-pulse"
                  : "bg-slate-950/40 border-slate-800/80 text-slate-600"
              }`}
            >
              <div className="mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 opacity-50" />
                )}
              </div>
              <span className="text-[11px] font-bold leading-tight hidden sm:block">{s.title}</span>
              <span className="text-[9px] opacity-75 hidden md:block mt-0.5">{s.desc}</span>
            </div>
          );
        })}
      </div>

      {/* Generated Search Queries Display */}
      {queries.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Generated Expanded Queries (Step 2):
          </span>
          <div className="flex flex-col gap-1">
            {queries.map((q, i) => (
              <div
                key={i}
                className="text-xs font-mono bg-slate-900 border border-slate-800/60 text-blue-300 px-2.5 py-1 rounded-lg flex items-center gap-2"
              >
                <Search className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="truncate">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Execution Log Stream */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 max-h-36 overflow-y-auto font-mono text-[11px] flex flex-col gap-1.5 scrollbar-thin">
        {logs.length === 0 ? (
          <span className="text-slate-600 italic">Waiting to trigger RAG pipeline...</span>
        ) : (
          logs.map((l, i) => (
            <div key={i} className="flex items-start gap-2 text-slate-300">
              <span className="text-slate-500 shrink-0">[{l.timestamp}]</span>
              <span className="font-semibold text-blue-400 shrink-0">Step {l.step}:</span>
              <span>{l.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
