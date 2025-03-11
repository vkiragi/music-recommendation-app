import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    // Get access token from our token API route
    const tokenRes = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify-token`
    );
    const accessToken = tokenRes.data.accessToken;

    // Fetch songs from Spotify API
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
