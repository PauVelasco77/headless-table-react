import { useState, useRef, useCallback } from "react";
import { AsyncTable } from "../table";
import type { TableColumn } from "../table";
import "../table/table.css";

// Pokemon data types
interface Pokemon {
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
  url?: string;
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

// PokeAPI list response type
interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

// Cache for Pokemon data
const pokemonCache = new Map<string, Promise<Pokemon>>();

/**
 * Fetch Pokemon list with pagination from PokeAPI
 */
const fetchPokemonList = async (
  limit: number = 20,
  offset: number = 0,
): Promise<PokemonListResponse> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Create skeleton Pokemon for loading state
 */
const createSkeletonPokemon = (name: string, url: string): Pokemon => ({
  id: 0,
  name: name,
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
  url,
});

/**
 * Fetch individual Pokemon data
 */
const fetchPokemonByUrl = async (url: string): Promise<Pokemon> => {
  if (pokemonCache.has(url)) {
    return pokemonCache.get(url)!;
  }

  const promise = (async () => {
    // Add random delay to simulate network variance and show loading states
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 2000 + 500),
    );

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon from ${url}`);
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
      isLoading: false,
      url,
    } as Pokemon;
  })();

  pokemonCache.set(url, promise);
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
 * Main Pokemon Row Suspense Example Component using AsyncTable
 */
export const PokemonRowSuspenseExample = () => {
  const [showShiny, setShowShiny] = useState(false);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
  const currentPageDataRef = useRef<Pokemon[]>([]);

  // Force update counter for re-renders

  /**
   * Fetch Pokemon data with server-side pagination for AsyncTable
   * This creates skeleton data first, then loads each Pokemon individually
   */
  const fetchPokemonWithPagination = useCallback(
    async (params: {
      page: number;
      pageSize: number;
      sort?: { key: string; direction: "asc" | "desc" } | null;
      searchQuery?: string;
    }) => {
      try {
        // Calculate offset for PokeAPI pagination
        const offset = (params.page - 1) * params.pageSize;

        // Fetch Pokemon list from PokeAPI
        const pokemonList = await fetchPokemonList(params.pageSize, offset);

        // Create skeleton data first for immediate display
        const skeletonData = pokemonList.results.map((pokemon) =>
          createSkeletonPokemon(pokemon.name, pokemon.url),
        );

        // Set initial skeleton data
        currentPageDataRef.current = [...skeletonData];
        setPokemonData([...skeletonData]);

        // Start loading individual Pokemon in the background
        pokemonList.results.forEach(async (pokemonRef, index) => {
          try {
            const pokemon = await fetchPokemonByUrl(pokemonRef.url);

            // Update the specific row when data loads
            if (currentPageDataRef.current[index]?.url === pokemonRef.url) {
              currentPageDataRef.current[index] = pokemon;
              setPokemonData([...currentPageDataRef.current]);
            }
          } catch (error) {
            console.error(`Failed to load Pokemon ${pokemonRef.name}:`, error);

            // Update with error state
            if (currentPageDataRef.current[index]?.url === pokemonRef.url) {
              currentPageDataRef.current[index] = {
                ...currentPageDataRef.current[index],
                name: `Error loading ${pokemonRef.name}`,
                isLoading: false,
              };
              setPokemonData([...currentPageDataRef.current]);
            }
          }
        });

        // Apply filtering to skeleton data if search query provided
        let filteredData = currentPageDataRef.current;
        if (params.searchQuery) {
          const query = params.searchQuery.toLowerCase();
          filteredData = currentPageDataRef.current.filter(
            (pokemon) =>
              pokemon.name.toLowerCase().includes(query) ||
              pokemon.types.some((type) => type.toLowerCase().includes(query)),
          );
        }

        // Apply sorting to skeleton data if provided
        if (params.sort) {
          filteredData.sort((a, b) => {
            let aValue: unknown;
            let bValue: unknown;

            // Handle nested stat access
            if (params.sort!.key === "hp") {
              aValue = a.stats.hp;
              bValue = b.stats.hp;
            } else if (params.sort!.key === "attack") {
              aValue = a.stats.attack;
              bValue = b.stats.attack;
            } else {
              aValue = a[params.sort!.key as keyof Pokemon];
              bValue = b[params.sort!.key as keyof Pokemon];
            }

            // Handle comparison
            if (aValue === bValue) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;

            let comparison = 0;
            if (typeof aValue === "number" && typeof bValue === "number") {
              comparison = aValue - bValue;
            } else {
              comparison = String(aValue).localeCompare(String(bValue));
            }

            return params.sort!.direction === "desc" ? -comparison : comparison;
          });
        }

        return {
          ok: true,
          data: {
            data: filteredData,
            total: pokemonList.count, // Total count from PokeAPI
          },
        } as const;
      } catch (error) {
        return {
          ok: false,
          error:
            error instanceof Error
              ? error
              : new Error("Failed to fetch Pokemon"),
        } as const;
      }
    },
    [],
  );

  // Use the current pokemonData state for rendering
  const fetchPokemonDataForTable = useCallback(
    async (params: {
      page: number;
      pageSize: number;
      sort?: { key: string; direction: "asc" | "desc" } | null;
      searchQuery?: string;
    }) => {
      // If we have data for this page and it's not the first load, return current data
      if (pokemonData.length > 0 && forceUpdateCounter > 0) {
        let filteredData = pokemonData;

        // Apply filtering if search query provided
        if (params.searchQuery) {
          const query = params.searchQuery.toLowerCase();
          filteredData = pokemonData.filter(
            (pokemon) =>
              pokemon.name.toLowerCase().includes(query) ||
              pokemon.types.some((type) => type.toLowerCase().includes(query)),
          );
        }

        // Apply sorting if provided
        if (params.sort) {
          filteredData = [...filteredData].sort((a, b) => {
            let aValue: unknown;
            let bValue: unknown;

            // Handle nested stat access
            if (params.sort!.key === "hp") {
              aValue = a.stats.hp;
              bValue = b.stats.hp;
            } else if (params.sort!.key === "attack") {
              aValue = a.stats.attack;
              bValue = b.stats.attack;
            } else {
              aValue = a[params.sort!.key as keyof Pokemon];
              bValue = b[params.sort!.key as keyof Pokemon];
            }

            // Handle comparison
            if (aValue === bValue) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;

            let comparison = 0;
            if (typeof aValue === "number" && typeof bValue === "number") {
              comparison = aValue - bValue;
            } else {
              comparison = String(aValue).localeCompare(String(bValue));
            }

            return params.sort!.direction === "desc" ? -comparison : comparison;
          });
        }

        return {
          ok: true,
          data: {
            data: filteredData,
            total: 1000, // Use a large number for total
          },
        } as const;
      }

      // First load - fetch new data
      return fetchPokemonWithPagination(params);
    },
    [pokemonData, forceUpdateCounter, fetchPokemonWithPagination],
  );

  // Define columns for the Pokemon table with loading states
  const pokemonColumns: TableColumn<Pokemon>[] = [
    {
      key: "id",
      header: "#",
      accessor: "id",
      sortable: true,
      width: 60,
      render: (value, row) => {
        console.log("row", row);
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

  const handleRefresh = () => {
    // Clear cache to force fresh data
    pokemonCache.clear();
    setPokemonData([]);
    currentPageDataRef.current = [];
    setForceUpdateCounter(forceUpdateCounter + 1);
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
          🗑️ Clear Cache
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
        <strong>🎭 AsyncTable with Row-Level Loading:</strong> This example
        combines AsyncTable with individual row loading states! The table first
        displays skeleton rows, then each Pokemon loads individually with
        staggered timing. You can see each row transform from skeleton to actual
        data as it loads from the PokeAPI. Search and pagination work while rows
        are still loading!
      </div>

      <AsyncTable
        key={forceUpdateCounter} // Force re-render when data updates
        config={{
          fetchData: fetchPokemonDataForTable,
          columns: pokemonColumns,
          pagination: {
            pageSize: 10,
            enabled: true,
          },
        }}
        className="pokemon-table"
        onRowClick={handleRowClick}
      />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
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
