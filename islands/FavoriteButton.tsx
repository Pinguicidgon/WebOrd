import { useSignal } from '@preact/signals';
import { useCallback, useEffect } from 'preact/hooks';

interface FavoriteButtonProps {
  characterId: string;
    isFavorite: boolean;
}

export default function FavoriteButton({ characterId, isFavorite }: FavoriteButtonProps) {
  const favorite = useSignal(isFavorite);

  useEffect(() => {
    favorite.value = isFavorite;
  }, [isFavorite]);

  const tooggleFavorite = async () => {
    const newFavoriteState = !favorite.value;

    try {
      const response = await fetch('/api/toggle-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ characterId,}),
      });

      if (response.ok) {
        favorite.value = newFavoriteState;

        window.location.reload();
    }
} catch (error) {
    console.error('Error toggling favorite:', error);
    }
};

    return (
        <button
        onClick={tooggleFavorite}
        style={{
            backgroundColor: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            padding: "4px",
            borderRadius: "4px",
            transition: "all 0.2s ease",
            color: favorite.value ? "#ffd700" : "#ccc",
        }}
           title={favorite.value ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
        ★
        </button>
    );
}