import { useState, useEffect } from "react";
import { Table } from "../table";
import type { TableColumn } from "../table";
import "../table/table.css";

// Pokemon data types
interface Pokemon extends Record<string, unknown> {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  isLoading?: boolean;
}

interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

// Cache for individual Pokemon
const pokemonRowCache = new Map<number, Promise<Pokemon>>();

/**
 * Fetch individual Pokemon data for row-level suspense
 */
const fetchPokemonById = async (id: number): Promise<Pokemon> => {
  if (pokemonRowCache.has(id)) {
    return pokemonRowCache.get(id)!;
  }

  const promise = (async () => {
    // Add random delay to simulate network variance
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 2000 + 500),
    );

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon #${id}`);
    }

    const detail: PokemonDetailResponse = await response.json();

    return {
      id: detail.id,
      name: detail.name,
      height: detail.height,
      weight: detail.weight,
      types: detail.types.map((t) => t.type.name),
      sprites: {
        front_default: detail.sprites.front_default,
        front_shiny: detail.sprites.front_shiny,
      },
      stats: {
        hp: detail.stats.find((s) => s.stat.name === "hp")?.base_stat || 0,
        attack:
          detail.stats.find((s) => s.stat.name === "attack")?.base_stat || 0,
        defense:
          detail.stats.find((s) => s.stat.name === "defense")?.base_stat || 0,
        speed:
          detail.stats.find((s) => s.stat.name === "speed")?.base_stat || 0,
      },
    } as Pokemon;
  })();

  pokemonRowCache.set(id, promise);
  return promise;
};

// Helper function to get type colors
const getTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };
  return typeColors[type] || "#68A090";
};

/**
 * Placeholder Pokemon for skeleton loading
 */
const createSkeletonPokemon = (id: number): Pokemon => ({
  id,
  name: `Loading Pokemon #${id}...`,
  height: 0,
  weight: 0,
  types: ["unknown"],
  sprites: {
    front_default: "",
    front_shiny: "",
  },
  stats: {
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0,
  },
  isLoading: true,
});

/**
 * Main Pokemon Row Suspense Example Component using Table
 */
export const PokemonRowSuspenseExample = () => {
  const [pokemonCount, setPokemonCount] = useState(10);
  const [showShiny, setShowShiny] = useState(false);
  const [key, setKey] = useState(0);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);

  // Initialize with skeleton data
  useEffect(() => {
    const pokemonIds = Array.from({ length: pokemonCount }, (_, i) => i + 1);
    const skeletonData = pokemonIds.map(createSkeletonPokemon);
    setPokemonData(skeletonData);

    // Load each Pokemon individually
    pokemonIds.forEach(async (pokemonId, index) => {
      try {
        const pokemon = await fetchPokemonById(pokemonId);
        setPokemonData((prev) => {
          const newData = [...prev];
          newData[index] = pokemon;
          return newData;
        });
      } catch (error) {
        console.error(`Failed to load Pokemon #${pokemonId}:`, error);
      }
    });
  }, [pokemonCount, key]);

  // Define columns for the Pokemon table
  const pokemonColumns: TableColumn<Pokemon>[] = [
    {
      key: "id",
      header: "#",
      accessor: "id",
      sortable: true,
      width: 60,
      render: (value, row) => {
        if (row.isLoading) {
          return (
            <div
              style={{
                width: "40px",
                height: "16px",
                backgroundColor: "#e5e5e5",
                borderRadius: "4px",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          );
        }
        return `#${String(value).padStart(3, "0")}`;
      },
    },
    {
      key: "sprite",
      header: "Sprite",
      accessor: "sprites",
      width: 80,
      render: (value, row) => {
        if (row.isLoading) {
          return (
            <div
              style={{
                width: 32,
                height: 32,
                backgroundColor: "#e5e5e5",
                borderRadius: "4px",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          );
        }
        return (
          <div style={{ display: "flex", gap: "4px" }}>
            <img
              src={
                showShiny
                  ? (value as Pokemon["sprites"]).front_shiny
                  : (value as Pokemon["sprites"]).front_default
              }
              alt={row.name}
              style={{ width: 32, height: 32 }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        );
      },
    },
    {
      key: "name",
      header: "Name",
      accessor: "name",
      sortable: true,
      render: (value, row) => {
        if (row.isLoading) {
          return (
            <div
              style={{
                width: "80px",
                height: "16px",
                backgroundColor: "#e5e5e5",
                borderRadius: "4px",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          );
        }
        return (
          <span
            style={{
              textTransform: "capitalize",
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            {String(value)}
          </span>
        );
      },
    },
    {
      key: "types",
      header: "Types",
      accessor: "types",
      render: (value, row) => {
        if (row.isLoading) {
          return (
            <div style={{ display: "flex", gap: "4px" }}>
              <div
                style={{
                  width: "50px",
                  height: "20px",
                  backgroundColor: "#e5e5e5",
                  borderRadius: "12px",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  width: "40px",
                  height: "20px",
                  backgroundColor: "#e5e5e5",
                  borderRadius: "12px",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: "0.2s",
                }}
              />
            </div>
          );
        }
        return (
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {(value as string[]).map((type, index) => (
              <span
                key={index}
                style={{
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  backgroundColor: getTypeColor(type),
                  color: "white",
                  textTransform: "capitalize",
                }}
              >
                {type}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "height",
      header: "Height",
      accessor: "height",
      sortable: true,
      width: 80,
      render: (value, row) => {
        if (row.isLoading) {
          return (
            <div
              style={{
                width: "40px",
                height: "16px",
                backgroundColor: "#e5e5e5",
                borderRadius: "4px",
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: "0.1s",
              }}
            />
          );
        }
        return `${Number(value) / 10}m`;
      },
    },
    {
      key: "weight",
      header: "Weight",
      accessor: "weight",
      sortable: true,
      width: 80,
      render: (value, row) => {
        if (row.isLoading) {
          return (
            <div
              style={{
                width: "45px",
                height: "16px",
                backgroundColor: "#e5e5e5",
                borderRadius: "4px",
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: "0.3s",
              }}
            />
          );
        }
        return `${Number(value) / 10}kg`;
      },
    },
    {
      key: "hp",
      header: "HP",
      accessor: (row) => row.stats.hp,
      sortable: true,
      width: 60,
      render: (value, row) => {
        if (row.isLoading) {
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div
                style={{
                  width: "20px",
                  height: "16px",
                  backgroundColor: "#e5e5e5",
                  borderRadius: "4px",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: "0.4s",
                }}
              />
              <div
                style={{
                  width: "40px",
                  height: "4px",
                  backgroundColor: "#e5e5e5",
                  borderRadius: "2px",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: "0.5s",
                }}
              />
            </div>
          );
        }
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span>{String(value)}</span>
            <div
              style={{
                width: "40px",
                height: "4px",
                backgroundColor: "#e5e5e5",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, (Number(value) / 255) * 100)}%`,
                  height: "100%",
                  backgroundColor: "#ef4444",
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "attack",
      header: "Attack",
      accessor: (row) => row.stats.attack,
      sortable: true,
      width: 80,
      render: (value, row) => {
        if (row.isLoading) {
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div
                style={{
                  width: "25px",
                  height: "16px",
                  backgroundColor: "#e5e5e5",
                  borderRadius: "4px",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: "0.6s",
                }}
              />
              <div
                style={{
                  width: "40px",
                  height: "4px",
                  backgroundColor: "#e5e5e5",
                  borderRadius: "2px",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: "0.7s",
                }}
              />
            </div>
          );
        }
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span>{String(value)}</span>
            <div
              style={{
                width: "40px",
                height: "4px",
                backgroundColor: "#e5e5e5",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, (Number(value) / 255) * 100)}%`,
                  height: "100%",
                  backgroundColor: "#f97316",
                }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const handleRefresh = () => {
    // Clear cache and force re-render
    pokemonRowCache.clear();
    setKey((prev) => prev + 1);
  };

  const handleRowClick = (pokemon: Pokemon) => {
    if (pokemon.isLoading) {
      return; // Don't show alert for loading rows
    }
    alert(`${pokemon.name} Stats:
HP: ${pokemon.stats.hp}
Attack: ${pokemon.stats.attack}
Defense: ${pokemon.stats.defense}
Speed: ${pokemon.stats.speed}

Types: ${pokemon.types.join(", ")}`);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          Pokemon Count:
          <select
            value={pokemonCount}
            onChange={(e) => setPokemonCount(Number(e.target.value))}
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value={5}>5 Pokemon</option>
            <option value={10}>10 Pokemon</option>
            <option value={15}>15 Pokemon</option>
            <option value={25}>25 Pokemon</option>
          </select>
        </label>

        <button
          onClick={handleRefresh}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔄 Refresh All Rows
        </button>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={showShiny}
            onChange={(e) => setShowShiny(e.target.checked)}
          />
          ✨ Show Shiny Sprites
        </label>
      </div>

      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#fef3c7",
          border: "1px solid #fbbf24",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        <strong>🎭 Row-Level Suspense with Table Component:</strong> This uses
        our reusable Table component with pagination and filtering! Each Pokemon
        loads individually and updates the table row as data becomes available.
        Navigate between pages to see different Pokemon loading, or search while
        data is still loading!
      </div>

      <Table<Pokemon>
        config={{
          columns: pokemonColumns,
          data: pokemonData,
          sortable: true,
          pagination: {
            enabled: true,
            pageSize: 5, // Show 5 Pokemon per page to see loading effect better
          },
          filtering: {
            enabled: true, // Enable filtering too - you can search while loading!
          },
        }}
        className="pokemon-table"
        onRowClick={handleRowClick}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pokemon-table .table-row:hover {
          background-color: #f0f9ff !important;
        }
      `}</style>
    </div>
  );
};
