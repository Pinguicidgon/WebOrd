import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    const { characterId } = await req.json();
    const cookies = req.headers.get("cookie") || "";
    const favoritesCookie = cookies
      .split("; ")
      .find((c) => c.startsWith("favorites="))
      ?.split("=")[1];

    let favorites: string[] = [];
    if (favoritesCookie) {
      try {
        favorites = JSON.parse(decodeURIComponent(favoritesCookie));
      } catch {
        favorites = [];
      }
    }
    const characterIdStr = characterId.toString();

    if (favorites.includes(characterIdStr)) {
      favorites = favorites.filter(id => id !== characterIdStr);
    } else {
      favorites.push(characterIdStr);
    }

    const headers = new Headers();
    headers.set("Set-Cookie", `favorites=${encodeURIComponent(JSON.stringify(favorites))}; Path=/; HttpOnly; SameSite=Lax`);
    headers.set("Content-Type", "application/json");

    return new Response(JSON.stringify({ success: true, favorites }), {
      status: 200,
      headers,
    });
    }
    };
