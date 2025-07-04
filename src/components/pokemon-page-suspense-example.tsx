import { useState, useEffect, useCallback } from "react";
import { useTable } from "./table";
import type { TableColumn, TableConfig } from "./table";
import "./table/table.css";

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
const pokemonPageCache = new Map<number, Promise<Pokemon>>();

/**
 * Fetch individual Pokemon data for page-level suspense
 */
const fetchPokemonById = async (id: number): Promise<Pokemon> => {
  if (pokemonPageCache.has(id)) {
    return pokemonPageCache.get(id)!;
  }

  const promise = (async () => {
    // Add random delay to simulate network variance
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1500 + 300),
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

  pokemonPageCache.set(id, promise);
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
 * Pokemon Page Suspense Example Component - Only fetches current page
 */
export const PokemonPageSuspenseExample = () => {
  const [showShiny, setShowShiny] = useState(false);
  const [totalPokemon] = useState(151); // Total Pokemon available (Gen 1)
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [key, setKey] = useState(0);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());

  // Initialize with all Pokemon as skeleton data
  useEffect(() => {
    const skeletonData = Array.from({ length: totalPokemon }, (_, i) =>
      createSkeletonPokemon(i + 1),
    );
    setPokemonData(skeletonData);
    setLoadedPages(new Set());
  }, [totalPokemon, key]);

  // Load Pokemon data for a specific page
  const loadPokemonForPage = useCallback(
    async (page: number, pageSize: number) => {
      if (loadedPages.has(page)) {
        return; // Already loaded this page
      }

      const startId = (page - 1) * pageSize + 1;
      const endId = Math.min(startId + pageSize - 1, totalPokemon);
      const pokemonIds = Array.from(
        { length: endId - startId + 1 },
        (_, i) => startId + i,
      );

      // Mark page as being loaded
      setLoadedPages((prev) => new Set(prev).add(page));

      // Load each Pokemon in the page
      pokemonIds.forEach(async (pokemonId) => {
        try {
          const pokemon = await fetchPokemonById(pokemonId);
          setPokemonData((prev) => {
            const newData = [...prev];
            const dataIndex = pokemonId - 1;
            if (dataIndex >= 0 && dataIndex < newData.length) {
              newData[dataIndex] = pokemon;
            }
            return newData;
          });
        } catch (error) {
          console.error(`Failed to load Pokemon #${pokemonId}:`, error);
        }
      });
    },
    [loadedPages, totalPokemon],
  );

  // Load first page on mount
  useEffect(() => {
    loadPokemonForPage(1, 5);
  }, [loadPokemonForPage]);

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

  // Create table configuration
  const tableConfig: TableConfig<Pokemon> = {
    columns: pokemonColumns,
    data: pokemonData,
    sortable: true,
    pagination: {
      enabled: true,
      pageSize: 5,
    },
    filtering: {
      enabled: true,
    },
  };

  // Use the table hook
  const { state, actions } = useTable(tableConfig);

  // Watch for page changes and load new pages
  useEffect(() => {
    if (state.pagination) {
      loadPokemonForPage(state.pagination.page, state.pagination.pageSize);
    }
  }, [state.pagination, loadPokemonForPage]);

  const handleRefresh = () => {
    // Clear cache and force re-render
    pokemonPageCache.clear();
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
        <button
          onClick={handleRefresh}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔄 Refresh Data
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
          backgroundColor: "#ecfdf5",
          border: "1px solid #10b981",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        <strong>📄 On-Demand Page Loading:</strong> This example only loads
        Pokemon data when you navigate to a specific page! Click "Next" or
        change the page size to see fresh loading animations. Each page is
        loaded only when needed - much more efficient than loading all data
        upfront!
      </div>

      <div className="table-container pokemon-table">
        {/* Search Input */}
        <div className="table-search">
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={state.searchQuery}
            onChange={(e) => actions.setSearchQuery(e.target.value)}
            className="table-search-input"
          />
        </div>

        {/* Table */}
        <table className="table">
          <thead>
            <tr>
              {pokemonColumns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={`table-header ${column.sortable ? "sortable" : ""}`}
                  onClick={() => {
                    if (column.sortable) {
                      const newDirection =
                        state.sort?.key === column.key &&
                        state.sort.direction === "asc"
                          ? "desc"
                          : "asc";
                      actions.setSort({
                        key: column.key,
                        direction: newDirection,
                      });
                    }
                  }}
                >
                  {column.header}
                  {state.sort?.key === column.key && (
                    <span>{state.sort.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.paginatedData.map((pokemon) => (
              <tr
                key={pokemon.id}
                className="table-row clickable"
                onClick={() => handleRowClick(pokemon)}
              >
                {pokemonColumns.map((column) => (
                  <td key={column.key} className="table-cell">
                    {column.render
                      ? column.render(
                          typeof column.accessor === "function"
                            ? column.accessor(pokemon)
                            : pokemon[column.accessor],
                          pokemon,
                        )
                      : String(
                          typeof column.accessor === "function"
                            ? column.accessor(pokemon)
                            : pokemon[column.accessor],
                        )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {state.paginatedData.length === 0 && (
          <div className="table-empty">No Pokemon found</div>
        )}

        {/* Pagination */}
        {state.pagination && (
          <div className="table-pagination">
            <div className="pagination-info">
              Showing{" "}
              {(state.pagination.page - 1) * state.pagination.pageSize + 1}-
              {Math.min(
                state.pagination.page * state.pagination.pageSize,
                state.pagination.total,
              )}{" "}
              of {state.pagination.total} Pokemon
            </div>

            <div className="pagination-controls">
              <button
                onClick={() => actions.setPage(state.pagination!.page - 1)}
                disabled={state.pagination.page <= 1}
                className="pagination-button"
              >
                Previous
              </button>

              <span className="pagination-current">
                Page {state.pagination.page} of{" "}
                {Math.ceil(state.pagination.total / state.pagination.pageSize)}
              </span>

              <button
                onClick={() => actions.setPage(state.pagination!.page + 1)}
                disabled={
                  state.pagination.page >=
                  Math.ceil(state.pagination.total / state.pagination.pageSize)
                }
                className="pagination-button"
              >
                Next
              </button>
            </div>

            <div className="pagination-size">
              <label>
                Rows per page:
                <select
                  value={state.pagination.pageSize}
                  onChange={(e) => actions.setPageSize(Number(e.target.value))}
                  className="pagination-select"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </label>
            </div>
          </div>
        )}
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
