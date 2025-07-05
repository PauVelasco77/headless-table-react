import { useState } from "react";
import { AsyncTable, SimpleAsyncTable } from "../table";
import type { TableColumn } from "../table";
import "../table/table.css";

/**
 * Represents a Pokemon with processed data from the PokeAPI
 *
 * This interface defines the structure of Pokemon data after processing
 * the raw API response into a more usable format for table display.
 */
interface Pokemon {
  /** Unique Pokemon ID number */
  readonly id: number;
  /** Pokemon name (e.g., "pikachu", "charizard") */
  readonly name: string;
  /** Height in decimeters (1 decimeter = 10 cm) */
  readonly height: number;
  /** Weight in hectograms (1 hectogram = 100 grams) */
  readonly weight: number;
  /** Array of Pokemon types (e.g., ["electric"], ["fire", "flying"]) */
  readonly types: string[];
  /** Sprite images for the Pokemon */
  readonly sprites: {
    /** URL to the default front-facing sprite */
    readonly front_default: string;
    /** URL to the shiny variant front-facing sprite */
    readonly front_shiny: string;
  };
  /** Base stats for the Pokemon */
  readonly stats: {
    /** Hit Points (HP) base stat */
    readonly hp: number;
    /** Attack base stat */
    readonly attack: number;
    /** Defense base stat */
    readonly defense: number;
    /** Speed base stat */
    readonly speed: number;
  };
}

/**
 * Response structure from the PokeAPI list endpoint
 *
 * This interface represents the paginated list response when fetching
 * multiple Pokemon from the API.
 */
interface PokemonListResponse {
  /** Total number of Pokemon available */
  readonly count: number;
  /** URL to the next page of results, null if on last page */
  readonly next: string | null;
  /** URL to the previous page of results, null if on first page */
  readonly previous: string | null;
  /** Array of Pokemon basic info with URLs to detailed data */
  readonly results: Array<{
    /** Pokemon name */
    readonly name: string;
    /** URL to fetch detailed Pokemon data */
    readonly url: string;
  }>;
}

/**
 * Response structure from the PokeAPI detail endpoint
 *
 * This interface represents the detailed Pokemon data returned when
 * fetching a specific Pokemon by ID or name from the API.
 */
interface PokemonDetailResponse {
  /** Unique Pokemon ID number */
  readonly id: number;
  /** Pokemon name */
  readonly name: string;
  /** Height in decimeters */
  readonly height: number;
  /** Weight in hectograms */
  readonly weight: number;
  /** Array of type information with nested structure */
  readonly types: Array<{
    readonly type: {
      /** Type name (e.g., "electric", "fire") */
      readonly name: string;
    };
  }>;
  /** Sprite image URLs */
  readonly sprites: {
    /** URL to default front sprite */
    readonly front_default: string;
    /** URL to shiny front sprite */
    readonly front_shiny: string;
  };
  /** Array of stat information with nested structure */
  readonly stats: Array<{
    /** The base stat value */
    readonly base_stat: number;
    readonly stat: {
      /** Stat name (e.g., "hp", "attack", "defense", "speed") */
      readonly name: string;
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
 * Example 1: Pokemon with server-side pagination using AsyncTable
 */
export const PokemonServerSideExample = () => {
  return (
    <div>
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
        <strong>🐱 Server-Side Pokemon AsyncTable:</strong> This example
        demonstrates server-side pagination with real PokeAPI data. Each page
        loads 10 Pokemon with their sprites, types, and stats. Search and
        sorting trigger new API calls with debounced search functionality.
      </div>

      <AsyncTable
        config={{
          fetchData: fetchPokemonWithPagination,
          columns: pokemonColumns,
          pagination: {
            enabled: true,
            pageSize: 10,
          },
          filtering: {
            enabled: true,
            searchableColumns: ["name", "types"],
          },
          sortable: true,
        }}
        className="pokemon-table"
        onRowClick={(pokemon: Pokemon) => {
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
 * Example 2: Load all Pokemon at once (first 151) using SimpleAsyncTable
 */
export const PokemonClientSideExample = () => {
  const [showShiny, setShowShiny] = useState(false);

  // Custom columns that can show shiny sprites
  const customColumns = pokemonColumns.map((col) => {
    if (col.key === "sprite") {
      return {
        ...col,
        render: (_: unknown, row: Pokemon) => (
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
          padding: "0.75rem",
          backgroundColor: "#f0fdf4",
          border: "1px solid #10b981",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        <strong>⚡ Client-Side Pokemon SimpleAsyncTable:</strong> This example
        loads all 151 Generation 1 Pokemon at once, then performs all operations
        (pagination, sorting, filtering) on the client side for instant
        responses. Toggle between normal and shiny sprites!
      </div>

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
          <input
            type="checkbox"
            checked={showShiny}
            onChange={(e) => setShowShiny(e.target.checked)}
          />
          ✨ Show Shiny Sprites
        </label>
      </div>

      <SimpleAsyncTable
        config={{
          fetchData: fetchAllPokemon,
          columns: customColumns,
          pagination: {
            enabled: true,
            pageSize: 15,
          },
          filtering: {
            enabled: true,
            searchableColumns: ["name", "types"],
          },
          sortable: true,
        }}
        className="pokemon-table"
        showRefreshButton={true}
        onRowClick={(pokemon: Pokemon) => {
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
