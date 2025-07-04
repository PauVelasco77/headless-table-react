import { useState, useEffect } from "react";
import { Table } from "../table";
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
  url?: string; // Added for PokeAPI reference
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

// Cache for individual Pokemon
const pokemonRowCache = new Map<string, Promise<Pokemon>>();

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
 * Fetch individual Pokemon data for row-level suspense
 */
const fetchPokemonByUrl = async (url: string): Promise<Pokemon> => {
  if (pokemonRowCache.has(url)) {
    return pokemonRowCache.get(url)!;
  }

  const promise = (async () => {
    // Add random delay to simulate network variance
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
      url,
    } as Pokemon;
  })();

  pokemonRowCache.set(url, promise);
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
const createSkeletonPokemon = (name: string, url: string): Pokemon => ({
  id: 0,
  name: `Loading ${name}...`,
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
 * Main Pokemon Row Suspense Example Component using Table with PokeAPI pagination
 */
export const PokemonRowSuspenseExample = () => {
  const [showShiny, setShowShiny] = useState(false);
  const [key, setKey] = useState(0);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  // Load Pokemon list and individual Pokemon data
  useEffect(() => {
    const loadPokemonPage = async () => {
      setLoading(true);
      try {
        // Calculate offset for current page
        const offset = (currentPage - 1) * pageSize;

        // Fetch Pokemon list from PokeAPI
        const listResponse = await fetchPokemonList(pageSize, offset);
        setTotalCount(listResponse.count);

        // Create skeleton data first
        const skeletonData = listResponse.results.map((pokemon) =>
          createSkeletonPokemon(pokemon.name, pokemon.url),
        );
        setPokemonData(skeletonData);

        // Load each Pokemon individually
        listResponse.results.forEach(async (pokemonRef, index) => {
          try {
            const pokemon = await fetchPokemonByUrl(pokemonRef.url);
            setPokemonData((prev) => {
              const newData = [...prev];
              newData[index] = pokemon;
              return newData;
            });
          } catch (error) {
            console.error(`Failed to load Pokemon ${pokemonRef.name}:`, error);
          }
        });
      } catch (error) {
        console.error("Failed to load Pokemon list:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPokemonPage();
  }, [currentPage, pageSize, key]);

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

  // Handle page changes from Table component
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle page size changes from Table component
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
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
          🔄 Refresh Current Page
        </button>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={showShiny}
            onChange={(e) => setShowShiny(e.target.checked)}
          />
          ✨ Show Shiny Sprites
        </label>

        <div style={{ fontSize: "14px", color: "#666" }}>
          Total Pokemon: {totalCount.toLocaleString()}
        </div>
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
        <strong>🎭 PokeAPI Pagination with Row-Level Suspense:</strong> This now
        uses the PokeAPI's official pagination system! Navigate through all{" "}
        {totalCount.toLocaleString()} Pokemon using the pagination controls.
        Each Pokemon loads individually with skeleton loading states. The Table
        component handles pagination seamlessly with the PokeAPI's offset/limit
        system.
      </div>

      <Table
        config={{
          columns: pokemonColumns,
          data: pokemonData,
          sortable: true,
          pagination: {
            enabled: true,
            pageSize: pageSize,
          },
          filtering: {
            enabled: true, // Enable filtering - you can search while loading!
          },
        }}
        className="pokemon-table"
        onRowClick={handleRowClick}
      />

      {/* Custom pagination controls that sync with PokeAPI */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        <div>
          Page {currentPage} of {Math.ceil(totalCount / pageSize)} •{" "}
          {totalCount.toLocaleString()} total Pokemon
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            style={{
              padding: "0.25rem 0.75rem",
              backgroundColor:
                currentPage <= 1 || loading ? "#e5e5e5" : "#3b82f6",
              color: currentPage <= 1 || loading ? "#999" : "white",
              border: "none",
              borderRadius: "4px",
              cursor: currentPage <= 1 || loading ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            disabled={loading}
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: loading ? "#f5f5f5" : "white",
            }}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage >= Math.ceil(totalCount / pageSize) || loading
            }
            style={{
              padding: "0.25rem 0.75rem",
              backgroundColor:
                currentPage >= Math.ceil(totalCount / pageSize) || loading
                  ? "#e5e5e5"
                  : "#3b82f6",
              color:
                currentPage >= Math.ceil(totalCount / pageSize) || loading
                  ? "#999"
                  : "white",
              border: "none",
              borderRadius: "4px",
              cursor:
                currentPage >= Math.ceil(totalCount / pageSize) || loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>

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
