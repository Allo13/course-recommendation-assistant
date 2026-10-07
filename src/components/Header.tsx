"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: App Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="h-5.5 w-5.5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white text-lg leading-tight tracking-tight">
              Course Rec <span className="text-blue-600 dark:text-blue-400">Assistant</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Study Abroad Counselor Companion
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
