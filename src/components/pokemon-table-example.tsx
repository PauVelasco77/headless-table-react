import { useState } from "react";
import { Table, useAsyncTable, useSimpleAsyncTable } from "./table";
import type { TableColumn } from "./table";
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
}

// Pokemon API response types
interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
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

/**
 * Fetch Pokemon list with server-side pagination
 */
const fetchPokemonWithPagination = async (params: {
  page?: number;
  pageSize?: number;
  sort?: { key: string; direction: "asc" | "desc" } | null;
  searchQuery?: string;
}) => {
  try {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const offset = (page - 1) * pageSize;

    // Fetch Pokemon list
    const listResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`,
    );

    if (!listResponse.ok) {
      return {
        ok: false,
        error: new Error("Failed to fetch Pokemon list"),
      } as const;
    }

    const listData: PokemonListResponse = await listResponse.json();

    // Fetch detailed data for each Pokemon
    const pokemonPromises = listData.results.map(async (pokemon) => {
      const detailResponse = await fetch(pokemon.url);
      const detail: PokemonDetailResponse = await detailResponse.json();

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
    });

    const pokemonData = await Promise.all(pokemonPromises);

    // Apply search filter if provided
    let filteredData = pokemonData;
    if (params.searchQuery?.trim()) {
      const query = params.searchQuery.toLowerCase();
      filteredData = pokemonData.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(query) ||
          pokemon.types.some((type) => type.toLowerCase().includes(query)),
      );
    }

    // Apply sorting if provided
    if (params.sort) {
      filteredData.sort((a, b) => {
        const aValue = a[params.sort!.key as keyof Pokemon];
        const bValue = b[params.sort!.key as keyof Pokemon];

        let comparison = 0;
        const aStr = String(aValue);
        const bStr = String(bValue);

        if (aStr < bStr) comparison = -1;
        if (aStr > bStr) comparison = 1;

        return params.sort!.direction === "desc" ? -comparison : comparison;
      });
    }

    return {
      ok: true,
      data: {
        data: filteredData,
        total: listData.count, // Total Pokemon count from API
      },
    } as const;
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error : new Error("Unknown error occurred"),
    } as const;
  }
};

/**
 * Fetch all Pokemon data at once (first 151 Pokemon for demo)
 */
const fetchAllPokemon = async () => {
  try {
    // Fetch first 151 Pokemon (original generation)
    const listResponse = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=151",
    );

    if (!listResponse.ok) {
      return {
        ok: false,
        error: new Error("Failed to fetch Pokemon list"),
      } as const;
    }

    const listData: PokemonListResponse = await listResponse.json();

    // Fetch detailed data for each Pokemon (this will take a while!)
    const pokemonPromises = listData.results.map(async (pokemon) => {
      const detailResponse = await fetch(pokemon.url);
      const detail: PokemonDetailResponse = await detailResponse.json();

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
    });

    const pokemonData = await Promise.all(pokemonPromises);

    return { ok: true, data: pokemonData } as const;
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error : new Error("Unknown error occurred"),
    } as const;
  }
};

// Column definitions for Pokemon table
const pokemonColumns: TableColumn<Pokemon>[] = [
  {
    key: "id",
    header: "#",
    accessor: "id",
    sortable: true,
    width: 60,
    render: (value) => `#${String(value).padStart(3, "0")}`,
  },
  {
    key: "sprite",
    header: "Sprite",
    accessor: "sprites",
    width: 80,
    render: (value, row) => (
      <div style={{ display: "flex", gap: "4px" }}>
        <img
          src={String((value as Pokemon["sprites"]).front_default)}
          alt={row.name}
          style={{ width: 32, height: 32 }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    ),
  },
  {
    key: "name",
    header: "Name",
    accessor: "name",
    sortable: true,
    render: (value) => (
      <span
        style={{
          textTransform: "capitalize",
          fontWeight: "bold",
          color: "#2563eb",
        }}
      >
        {String(value)}
      </span>
    ),
  },
  {
    key: "types",
    header: "Types",
    accessor: "types",
    render: (value) => (
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
    ),
  },
  {
    key: "height",
    header: "Height",
    accessor: "height",
    sortable: true,
    width: 80,
    render: (value) => `${Number(value) / 10}m`,
  },
  {
    key: "weight",
    header: "Weight",
    accessor: "weight",
    sortable: true,
    width: 80,
    render: (value) => `${Number(value) / 10}kg`,
  },
  {
    key: "hp",
    header: "HP",
    accessor: (row) => row.stats.hp,
    sortable: true,
    width: 60,
    render: (value) => (
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
    ),
  },
  {
    key: "attack",
    header: "Attack",
    accessor: (row) => row.stats.attack,
    sortable: true,
    width: 80,
    render: (value) => (
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
    ),
  },
];

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
 * Example 1: Pokemon with server-side pagination
 */
export const PokemonServerSideExample = () => {
  const {
    state,
    columns: tableColumns,
    error,
    refetch,
    isRefetching,
  } = useAsyncTable<Pokemon>({
    fetchData: fetchPokemonWithPagination,
    columns: pokemonColumns,
    initialPageSize: 10,
  });

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
          onClick={refetch}
          disabled={state.loading || isRefetching}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor:
              state.loading || isRefetching ? "#6b7280" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: state.loading || isRefetching ? "not-allowed" : "pointer",
          }}
        >
          {isRefetching ? "🔄 Refetching..." : "🔄 Refresh Pokemon"}
        </button>

        {state.loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#3b82f6",
              fontWeight: "bold",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid #3b82f6",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            Loading Pokemon data...
          </div>
        )}

        {error && (
          <div
            style={{
              color: "#dc2626",
              fontSize: "14px",
              padding: "0.5rem",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "4px",
            }}
          >
            ⚠️ Error: {error.message}
          </div>
        )}
      </div>

      <Table<Pokemon>
        config={{
          columns: tableColumns,
          data: state.data,
          sortable: true,
          pagination: {
            enabled: true,
            pageSize: state.pagination?.pageSize ?? 10,
          },
          filtering: {
            enabled: true,
          },
        }}
        className="pokemon-table"
        onRowClick={(pokemon) => {
          alert(`You clicked on ${pokemon.name}! 
Type(s): ${pokemon.types.join(", ")}
Height: ${pokemon.height / 10}m
Weight: ${pokemon.weight / 10}kg`);
        }}
      />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

/**
 * Example 2: Load all Pokemon at once (first 151)
 */
export const PokemonClientSideExample = () => {
  const { state, actions, error, refetch, isRefetching } =
    useSimpleAsyncTable<Pokemon>({
      fetchData: fetchAllPokemon,
      columns: pokemonColumns,
      pagination: {
        enabled: true,
        pageSize: 15,
      },
      filtering: {
        enabled: true,
        searchableColumns: ["name", "types"],
      },
    });

  const [showShiny, setShowShiny] = useState(false);

  // Custom columns that can show shiny sprites
  const customColumns = pokemonColumns.map((col) => {
    if (col.key === "sprite") {
      return {
        ...col,
        render: (value: unknown, row: Pokemon) => (
          <div style={{ display: "flex", gap: "4px" }}>
            <img
              src={
                showShiny ? row.sprites.front_shiny : row.sprites.front_default
              }
              alt={row.name}
              style={{ width: 32, height: 32 }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ),
      };
    }
    return col;
  });

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
          onClick={refetch}
          disabled={state.loading || isRefetching}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor:
              state.loading || isRefetching ? "#6b7280" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: state.loading || isRefetching ? "not-allowed" : "pointer",
          }}
        >
          {isRefetching
            ? "⏳ Loading 151 Pokemon..."
            : "📥 Load All Pokemon (Gen 1)"}
        </button>

        <button
          onClick={actions.reset}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔄 Reset Filters
        </button>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={showShiny}
            onChange={(e) => setShowShiny(e.target.checked)}
          />
          ✨ Show Shiny Sprites
        </label>

        {state.loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#10b981",
              fontWeight: "bold",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid #10b981",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            Loading all 151 Pokemon... This may take a moment!
          </div>
        )}

        {error && (
          <div
            style={{
              color: "#dc2626",
              fontSize: "14px",
              padding: "0.5rem",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "4px",
            }}
          >
            ⚠️ Error: {error.message}
          </div>
        )}
      </div>

      {state.data.length > 0 && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            backgroundColor: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          📊 Loaded {state.data.length} Pokemon! Use search to filter by name or
          type.
        </div>
      )}

      <Table<Pokemon>
        config={{
          columns: customColumns,
          data: state.data,
          sortable: true,
          pagination: {
            enabled: true,
            pageSize: state.pagination?.pageSize ?? 15,
          },
          filtering: {
            enabled: true,
            searchableColumns: ["name", "types"],
          },
        }}
        className="pokemon-table"
        onRowClick={(pokemon) => {
          alert(`${pokemon.name} Stats:
          HP: ${pokemon.stats.hp}
          Attack: ${pokemon.stats.attack}
          Defense: ${pokemon.stats.defense}
          Speed: ${pokemon.stats.speed}
          Types: ${pokemon.types.join(", ")}`);
        }}
      />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .pokemon-table .table-row:hover {
          background-color: #f0f9ff !important;
        }
      `}</style>
    </div>
  );
};
