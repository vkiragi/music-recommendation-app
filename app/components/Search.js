"use client"; // This is necessary for Next.js App Router components using state
import { useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    if (!query) return;
    const res = await fetch(`/api/spotify-search?query=${query}`);
    const data = await res.json();
    setSongs(data.tracks.items);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a song..."
        className="border p-2 rounded"
      />
      <button
        onClick={fetchSongs}
        className="ml-2 p-2 bg-blue-500 text-white rounded"
      >
        Search
      </button>

      <ul className="mt-4">
        {songs.map((song) => (
          <li key={song.id}>
            {song.name} - {song.artists[0].name}
          </li>
        ))}
      </ul>
    </div>
  );
}
