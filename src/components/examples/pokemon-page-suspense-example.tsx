import { useState, useCallback } from "react";
import { Table, useAsyncTable } from "../table";
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
}

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

// Cache for individual Pokemon
const pokemonCache = new Map<string, Promise<Pokemon>>();

/**
 * Fetch Pokemon list using PokéAPI pagination
 */
const fetchPokemonList = async (
  limit: number,
  offset: number,
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
 * Fetch individual Pokemon data from PokéAPI
 */
const fetchPokemonByUrl = async (url: string): Promise<Pokemon> => {
  if (pokemonCache.has(url)) {
    return pokemonCache.get(url)!;
  }

  const promise = (async () => {
    // Add random delay to simulate network variance
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1500 + 300),
    );

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${response.statusText}`);
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
 * Pokemon Page Suspense Example Component - Uses PokéAPI pagination
 */
export const PokemonPageSuspenseExample = () => {
  const [showShiny, setShowShiny] = useState(false);

  // Create a fetch function for useAsyncTable that uses PokéAPI pagination
  const fetchPokemonPage = useCallback(
    async (params: {
      page?: number;
      pageSize?: number;
      sort?: { key: string; direction: "asc" | "desc" } | null;
      searchQuery?: string;
    }) => {
      try {
        const page = params.page || 1;
        const pageSize = params.pageSize || 5;

        // Calculate offset for PokéAPI pagination
        const offset = (page - 1) * pageSize;

        // Fetch Pokemon list from PokéAPI
        const pokemonList = await fetchPokemonList(pageSize, offset);

        // Load all Pokemon for this page and wait for completion
        const pokemonPromises = pokemonList.results.map((pokemon) =>
          fetchPokemonByUrl(pokemon.url),
        );

        // Wait for all Pokemon to load
        const pageData = await Promise.all(pokemonPromises);

        // Filter by search query if provided
        let filteredData = pageData;
        if (params.searchQuery) {
          const query = params.searchQuery.toLowerCase();
          filteredData = pageData.filter(
            (pokemon) =>
              pokemon.name.toLowerCase().includes(query) ||
              pokemon.types.some((type) => type.toLowerCase().includes(query)),
          );
        }

        // Sort if requested
        if (params.sort) {
          filteredData.sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (params.sort!.key) {
              case "id":
                aValue = a.id;
                bValue = b.id;
                break;
              case "name":
                aValue = a.name;
                bValue = b.name;
                break;
              case "height":
                aValue = a.height;
                bValue = b.height;
                break;
              case "weight":
                aValue = a.weight;
                bValue = b.weight;
                break;
              case "hp":
                aValue = a.stats.hp;
                bValue = b.stats.hp;
                break;
              case "attack":
                aValue = a.stats.attack;
                bValue = b.stats.attack;
                break;
              default:
                return 0;
            }

            if (typeof aValue === "string") {
              aValue = aValue.toLowerCase();
              bValue = (bValue as string).toLowerCase();
            }

            let comparison = 0;
            if (aValue < bValue) comparison = -1;
            if (aValue > bValue) comparison = 1;

            return params.sort!.direction === "desc" ? -comparison : comparison;
          });
        }

        return {
          ok: true as const,
          data: {
            data: filteredData,
            total: pokemonList.count, // Use actual count from PokéAPI
          },
        };
      } catch (error) {
        return {
          ok: false as const,
          error:
            error instanceof Error
              ? error
              : new Error("Failed to fetch Pokemon"),
        };
      }
    },
    [],
  );

  // Define columns for the Pokemon table
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

  // Use async table hook - this will handle pagination properly
  const { state, error, refetch, isRefetching } = useAsyncTable<Pokemon>({
    fetchData: fetchPokemonPage,
    columns: pokemonColumns,
    initialPageSize: 5,
  });

  const handleRefresh = () => {
    // Clear cache and force re-render
    pokemonCache.clear();
    refetch();
  };

  const handleRowClick = (pokemon: Pokemon) => {
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
        <strong>📄 PokéAPI Pagination:</strong> This example uses the official
        PokéAPI pagination endpoint with proper async/await! Each page fetches
        the Pokemon list, then loads all Pokemon details for that page. Click
        "Next" to see the loading state while the new page data is fetched.
      </div>

      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "1rem",
            padding: "0.5rem",
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "4px",
          }}
        >
          Error: {error.message}
        </div>
      )}

      {isRefetching && (
        <div
          style={{
            color: "blue",
            marginBottom: "1rem",
            padding: "0.5rem",
            backgroundColor: "#dbeafe",
            border: "1px solid #93c5fd",
            borderRadius: "4px",
          }}
        >
          🔄 Loading Pokemon data...
        </div>
      )}

      <Table
        config={{
          columns: pokemonColumns,
          data: state.data,
          sortable: true,
          pagination: { enabled: true, pageSize: 5 },
          filtering: { enabled: true },
        }}
        className="pokemon-table"
        onRowClick={handleRowClick}
      />

      <style>{`
        .pokemon-table .table-row:hover {
          background-color: #f0f9ff !important;
        }
      `}</style>
    </div>
  );
};
