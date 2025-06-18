import { Handlers, PageProps } from "$fresh/server.ts";
import FavoriteButton from "../../islands/FavoriteButton.tsx";

interface Character {
  id: string;
  name: string;
  house: string;
  image: string;
  actor: string;
  dateOfBirth: string;
  ancestry: string;
  patronus: string;
  eyeColor: string;
    hairColor: string;
    alive: boolean;
    hogwartsStudent: boolean;
    hogwartsStaff: boolean;
}

export const handler: Handlers = {
  async GET(req, ctx) {
    const { id} = ctx.params;
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
    const characterIndex = parseInt(id);

    if (characterIndex < 0 || characterIndex >= characters.length) {
        return ctx.render({ characters: null, favorites, characterId: id });
    }
    const character = characters[characterIndex];
    return ctx.render({ characters: character, favorites, characterId: id });
    }
};

export default function CharacterPage({ data }: PageProps<{ character: Character | null, favorites: string[], characterId: string }>) {
  

  if (!data.character) {
    return (
      <div style={{
        backgroundColor: "#4a4a4a",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "white",
      }}>
        <h1> Personaje no encontrado </h1>
        <a href="/" style={{
          color: "#66ccff",
        }}>
          Volver a la página principal
        </a>
      </div>
    );
  }

  const { character } = data;
  return (
    <div style={{
      backgroundColor: "#4a4a4a",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <nav style={{
        marginBottom: "30px",
      }}>
        <a href="/" style={{
          color: "#66ccff",
          fontSize: "16px",
        }}>
          Volver a todos los personajes
        </a> 
      </nav>
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        maxWidth: "800px",
        margin: "0 auto",
        }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
                alignItems: "felx-start",
                marginBottom: "30px",
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: "32px",
                    color: "#333",
                    fontWeight: "bold",
                }}>
                    {character.name}
                </h1>
                    <FavoriteButton
                        characterId={data.characterId}
                        isFavorite={data.favorites.includes(data.characterId)}
                    />
            </div>

            <div style={{
              display: "grid",
                gridTemplateColumns: "300px 1fr",
                gap: "40px",
                alingItems: "start"
            }}>
                <div>
                    {character.image ? (
                        <img src={character.image} alt={character.name} style={{
                            width: "100%",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }} />
                    ) : (
                        <div style={{
                            width: "100%",
                            height: "400px",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#999",
                            fontSize: "16px"
                        }}>
                            Sin imagen disponible
                        </div>
                    )}
                </div>

                <div style= {{ color: "#333" }}>
                    <div style={{ marginBottom: "25px" }}>
                        <h3 style={{
                            margin: "0 0 15px 0",
                            fontSize: "20px",
                            color: "#2c3e50",
                            borderBottom: "2px solid #ecf0f1",
                            paddingBottom: "8px",
                        }}>
                            Información del Personaje
                        </h3>
                        <div style={{ lineHeight: "1.6" }}>
                            <p style= {{ margin: "8p 0"}}><strong> Casa:</strong> {character.house || "Desconocida"}</p>
                            <p style= {{ margin: "8p 0"}}><strong> Actor:</strong> {character.actor || "Desconocido"}</p>
                            <p style= {{ margin: "8p 0"}}><strong> Fecha de Nacimiento:</strong> {character.dateOfBirth || "Desconocida"}</p>
                            <p style= {{ margin: "8p 0"}}><strong> Ascendencia:</strong> {character.ancestry || "Desconocida"}</p>
                        </div>
                    </div>
                    <div style={{ marginBottom: "25px" }}>
                        <h3 style={{
                            margin: "0 0 15px 0",
                            fontSize: "20px",
                            color: "#2c3e50",
                            borderBottom: "2px solid #ecf0f1",
                            paddingBottom: "8px",
                        }}>
                            Características

                        </h3>
                        <div style={{ lineHeight: "1.6" }}>
                            <p style= {{ margin: "8p 0"}}><strong> Patronus:</strong> {character.patronus || "Desconocido"}</p>
                            <p style= {{ margin: "8p 0"}}><strong> Color de Ojos:</strong> {character.eyeColor || "Desconocido"}</p>
                            <p style= {{ margin: "8p 0"}}><strong> Color de Cabello:</strong> {character.hairColor || "Desconocido"}</p>
                        </div>
                    </div>
                    </div>
                    <h3 style={{
                        margin: "0 0 15px 0",
                        fontSize: "20px",
                        color: "#2c3e50",
                        borderBottom: "2px solid #ecf0f1",
                        paddingBottom: "8px",
                        }}
                    >
                        Estado
                    </h3>
                    <div style={{ lineHeight: "1.6" }}>
                        <p style= {{ margin: "8p 0"}}><strong> Vivo:</strong> {character.alive ? "Sí" : "No"}</p>
                            <p style= {{ margin: "8p 0"}}><strong> Estudiante de Hogwarts:</strong> {character.hogwartsStudent ? "Sí" : "No"}</p>
                            <p style= {{ margin: "8p 0"}}><strong> Personal de Hogwarts:</strong> {character.hogwartsStaff ? "Sí" : "No"}</p>
                            </div>
                </div>
            </div>
        </div>
    );
}


        

      
