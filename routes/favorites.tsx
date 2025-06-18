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
    const allcharacters: Character[] = await res.json();

    const favoriteCharacters = favorites.map(id => ({
        character: allcharacters[parseInt(id)],
        originalIndex: parseInt(id)
    }))
    .filter(item => item.character);

    return ctx.render({
      favoriteCharacters,
      favorites,
    });
}
};
  export default function Favorites({ data }: PageProps<{ favoriteCharacters: Array<{ character: Character, originalIndex: number }>, favorites: string[] }>) {
    return (
      <div style={{
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

            <a href="/" style={{
                color: "white",
                fontSize: "18px",
                textDecoration: "none",
            }}>
                Todos

            </a>
          <span style={{
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            textDecoration: "underline",
          }}>
            Favoritos
          </span>
        </nav>
          {data.favoriteCharacters.length === 0  ?(
            <div style={{
              color: "white",
              fontSize: "18px",
              textAlign: "center",
              padding: "60px 20px",
            }}>
              <p>No tienes personajes favoritos aún.</p>
              <p>Ve a <a href="/" style={{ color: "66ccff" }}>Todos</a> para marcar algunos como favoritos.</p>
            </div>
          ) : (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
            maxWidth: "1400px",
            }}>
            {data.favoriteCharacters.map(({ character, originalIndex }) => (
              <div key={originalIndex} style={{
                backgroundColor: "#white",
                borderRadius: "12px",
                padding: "12px",
                bockShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}>
                <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}>
                  <FavoriteButton
                    characterId={originalIndex.toString()}
                    isFavorite={data.favorites.includes(originalIndex.toString())}
                  />
              </div>
                <a 
                    href={`/characters/${originalIndex}`}
                    style={{
                    textDecoration: "none",
                    color: "inherit",
                    }}>
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
                        Sin imagen
                      </div>
                    )}
                    </div>
                    <h3 style={{
                        fontSize: "16px",
                        margin: "0",
                        color: "#333",
                        fontWeight: "normal",
                        textAlign: "center",
                    }}>
                      {character.name}
                    </h3>
                </a>
                </div>
            ))}
            </div>  
          )}
        </div>
    );
  }