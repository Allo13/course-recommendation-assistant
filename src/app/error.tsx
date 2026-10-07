"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-slate-400 text-sm mb-4">{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
      >
        Try again
      </button>
    </div>
  );
}
