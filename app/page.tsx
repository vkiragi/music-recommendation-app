"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import Search from "./components/Search";

export default function Home() {
  const router = useRouter();
  const [resetSearch, setResetSearch] = useState(false);

  // ✅ Ensure setResetSearch is stable using useCallback
  const handleResetSearch = useCallback(() => {
    setResetSearch(false);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8">
      <h1
        onClick={() => {
          router.replace("/"); // Update URL to "/"
          setResetSearch(true); // Trigger reset
        }}
        className="text-2xl font-bold hover:underline cursor-pointer"
      >
        🎵 AI-Powered Music Search
      </h1>

      <Search resetSearch={resetSearch} setResetSearch={handleResetSearch} />
    </main>
  );
}
