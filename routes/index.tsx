import { Handlers, PageProps } from "$fresh/server.ts";
import FavoriteButton from "../islands/FavoriteButton.tsx";

interface Character {
  id: string;
  name: string;
  house: string;
  image: string;
  actor: string;
  dateOfBirth: string;
}

export const handler: Handlers = {
  async GET(req, ctx) {
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

    const res = await fetch("https://hp-api.onrender.com/api/characters");
    const characters: Character[] = await res.json();

    return ctx.render({
      characters,
      favorites,
    });
  }

};

export default function Home({ data }: PageProps<{ characters: Character[],  favorites: string[]}>) {
  
  return (
    <div style= {{
      backgroundColor: "#4a4a4a",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <nav style={{
        marginBottom: "30px",
        display: "flex",
        gap: "20px",
      }}>
        <span style={{
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          textDecoration: "none",
        }}>
          Todos
        </span>
        <a href="/favorites"
        style={{
          color: "white",
          fontSize: "18px",
          textDecoration: "none",
        }}>
          Favoritos
        </a>
        </nav>

        < div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          maxWidth: "1400px",
        }}>
          {data.characters.map((character, index) => (
            <div key={index} style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}>
              <div style={{ psition: "absolute", top: "12px", right: "12px", zIndex: 10 }}>
                <FavoriteButton
                  characterId={index.toString()}
                  isFavorite={data.favorites.includes(index.toString())}
                />
            </div>

            <a 
              href={`/characters/${index}`}
              style={{
                textDecoration: "none",
                color: "inherit", }}
              >
                <div style={{
                  width: "100%",
                  height: "250px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "12px",
                }}>
                  {character.image ? (
                    <img
                      src={character.image}
                      alt={character.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#e0e0e0",
                      color: "#999",
                    }}>
                      Sin Imagen
                    </div>
                  )}
                </div>
                <h3 style={{
                  fontWeight: "normal",
                  fontSize: "16px",
                  margin: "0",
                  color: "#333",
                  textAlign: "center",
                }}>
                  {character.name}
                </h3> 
              </a>
              </div>
          ))}
          </div>
    </div>
  );
}