import { Suspense, useState, use } from "react";
import { Table } from "./table";
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

// Cache for Pokemon data
const pokemonCache = new Map<string, Promise<Pokemon[]>>();

/**
 * Fetch Pokemon data with caching for Suspense
 */
const fetchPokemonForSuspense = (limit: number = 50): Promise<Pokemon[]> => {
  const cacheKey = `pokemon-${limit}`;

  if (pokemonCache.has(cacheKey)) {
    return pokemonCache.get(cacheKey)!;
  }

  const promise = (async () => {
    // Add a small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const listResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
    );

    if (!listResponse.ok) {
      throw new Error("Failed to fetch Pokemon list");
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

    return await Promise.all(pokemonPromises);
  })();

  pokemonCache.set(cacheKey, promise);
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

/**
 * Component that fetches and displays Pokemon data using Suspense
 */
const PokemonTableContent = ({
  showShiny,
  pokemonPromise,
}: {
  showShiny: boolean;
  pokemonPromise: Promise<Pokemon[]>;
}) => {
  // Use the React 18 'use' hook to suspend until data is ready
  const data = use(pokemonPromise);

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
    <>
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
        📊 Loaded {data.length} Pokemon! Use search to filter by name or type.
      </div>

      <Table<Pokemon>
        config={{
          columns: customColumns,
          data,
          sortable: true,
          pagination: {
            enabled: true,
            pageSize: 15,
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
    </>
  );
};

/**
 * Loading fallback component
 */
const PokemonLoadingFallback = ({ pokemonCount }: { pokemonCount: number }) => (
  <div
    style={{
      textAlign: "center",
      padding: "3rem 1rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "12px",
      color: "white",
      margin: "1rem 0",
    }}
  >
    <div
      style={{
        width: "60px",
        height: "60px",
        border: "4px solid rgba(255,255,255,0.3)",
        borderTop: "4px solid white",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        margin: "0 auto 1rem",
      }}
    />
    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem" }}>
      🔄 Loading {pokemonCount} Pokemon...
    </h3>
    <p style={{ margin: 0, opacity: 0.9 }}>
      Fetching data from the Pokemon API with Suspense!
    </p>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

/**
 * Main Pokemon Suspense Example Component
 */
export const PokemonSuspenseExample = () => {
  const [pokemonCount, setPokemonCount] = useState(25);
  const [showShiny, setShowShiny] = useState(false);
  const [key, setKey] = useState(0); // Used to force re-render

  const handleRefresh = () => {
    // Clear cache and force re-render
    pokemonCache.clear();
    setKey((prev) => prev + 1);
  };

  // Create the promise for the current pokemon count
  const pokemonPromise = fetchPokemonForSuspense(pokemonCount);

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
            <option value={25}>25 Pokemon</option>
            <option value={50}>50 Pokemon</option>
            <option value={100}>100 Pokemon</option>
            <option value={151}>151 Pokemon (Gen 1)</option>
          </select>
        </label>

        <button
          onClick={handleRefresh}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#8b5cf6",
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
          backgroundColor: "#f3f4f6",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        <strong>🚀 Suspense Demo:</strong> This example uses React Suspense for
        declarative loading states. The table will suspend while fetching
        Pokemon data, showing a beautiful loading fallback.
      </div>

      <Suspense
        fallback={<PokemonLoadingFallback pokemonCount={pokemonCount} />}
      >
        <PokemonTableContent
          key={key}
          showShiny={showShiny}
          pokemonPromise={pokemonPromise}
        />
      </Suspense>

      <style>{`
        .pokemon-table .table-row:hover {
          background-color: #f0f9ff !important;
        }
      `}</style>
    </div>
  );
};
