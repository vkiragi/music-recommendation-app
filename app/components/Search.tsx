"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  preview_url: string | null;
  external_urls: { spotify: string };
}

interface SearchProps {
  resetSearch: boolean;
  setResetSearch: () => void; // Ensure it's always a function
}

export default function Search({ resetSearch, setResetSearch }: SearchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState<string>(searchParams.get("query") || "");
  const [songs, setSongs] = useState<Track[]>([]);

  useEffect(() => {
    if (resetSearch) {
      setQuery(""); // Clear input field
      setSongs([]); // Clear search results
      setResetSearch(); // ✅ Now using a stable function reference
    }
  }, [resetSearch]); // ✅ Now has a stable dependency array

  const fetchSongs = async () => {
    if (!query.trim()) return;
    const res = await fetch(`/api/spotify-search?query=${query}`);
    const data = await res.json();
    setSongs(data.tracks?.items || []);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/?query=${encodeURIComponent(query)}`);
    fetchSongs();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a song..."
          className="flex-1"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="grid gap-4">
        {songs.length === 0 && (
          <p className="text-center text-gray-500">No results found</p>
        )}

        {songs.map((song) => (
          <Card key={song.id} className="flex items-center gap-4 p-4">
            <img
              src={song.album.images[0]?.url}
              alt="Album Cover"
              className="w-16 h-16 rounded-lg"
            />
            <CardContent className="flex-1">
              <p className="font-bold">{song.name}</p>
              <p className="text-sm text-gray-600">
                {song.artists.map((artist) => artist.name).join(", ")}
              </p>
              <a
                href={song.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm"
              >
                Listen on Spotify
              </a>
            </CardContent>
            {song.preview_url && (
              <audio controls className="w-24">
                <source src={song.preview_url} type="audio/mpeg" />
              </audio>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
