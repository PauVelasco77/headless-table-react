import { Suspense, useState, use } from "react";
import { Table } from "../table";
import type { TableColumn } from "../table";
import { getTypeColor, type Pokemon } from "./pokemon-api";
import { Pokedex } from "pokeapi-js-wrapper";
import "../table/table.css";

// Initialize the Pokedex instance
const P = new Pokedex();

// Cache for Pokemon data
const pokemonCache = new Map<string, Promise<Pokemon[]>>();

/**
 * Pokemon list item from the API
 */
interface PokemonListItem {
  readonly name: string;
  readonly url: string;
}

/**
 * Transform raw Pokemon data from the API to our interface
 */
const transformPokemon = (rawPokemon: unknown): Pokemon => {
  const pokemon = rawPokemon as {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: Array<{ type: { name: string } }>;
    sprites: { front_default: string | null; front_shiny: string | null };
    stats: Array<{ base_stat: number; stat: { name: string } }>;
  };

  return {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    types: pokemon.types.map((t) => t.type.name),
    sprites: {
      front_default: pokemon.sprites.front_default || "",
      front_shiny: pokemon.sprites.front_shiny || "",
    },
    stats: {
      hp: pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || 0,
      attack:
        pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat || 0,
      defense:
        pokemon.stats.find((s) => s.stat.name === "defense")?.base_stat || 0,
      speed: pokemon.stats.find((s) => s.stat.name === "speed")?.base_stat || 0,
    },
  };
};

/**
 * Fetch Pokemon data with caching for Suspense using pokeapi-js-wrapper
 */
const fetchPokemonForSuspense = (limit: number = 50): Promise<Pokemon[]> => {
  const cacheKey = `pokemon-${limit}`;

  if (pokemonCache.has(cacheKey)) {
    return pokemonCache.get(cacheKey)!;
  }

  const promise = (async () => {
    try {
      // Add a small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get Pokemon list using the wrapper
      const pokemonList = await P.getPokemonsList({ offset: 0, limit });

      // Fetch detailed data for each Pokemon using the wrapper
      const pokemonPromises = pokemonList.results.map(
        async (pokemon: PokemonListItem) => {
          const detail = await P.getPokemonByName(pokemon.name);
          return transformPokemon(detail);
        },
      );

      return await Promise.all(pokemonPromises);
    } catch (error) {
      throw new Error(
        `Failed to fetch Pokemon: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  })();

  pokemonCache.set(cacheKey, promise);
  return promise;
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
          style={{ width: 32, height: 32, imageRendering: "pixelated" }}
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
              backgroundColor: "#4caf50",
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
              backgroundColor: "#f44336",
            }}
          />
        </div>
      </div>
    ),
  },
];

/**
 * Pokemon table content component that uses Suspense
 */
const PokemonTableContent = ({
  showShiny,
  pokemonPromise,
}: {
  showShiny: boolean;
  pokemonPromise: Promise<Pokemon[]>;
}) => {
  const pokemonData = use(pokemonPromise);

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
              style={{ width: 32, height: 32, imageRendering: "pixelated" }}
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
        <strong>
          ✨ Loaded {pokemonData.length} Pokemon with pokeapi-js-wrapper!
        </strong>
        The data is now cached and ready for instant interactions. Toggle
        between normal and shiny sprites!
      </div>

      <Table
        config={{
          columns: customColumns,
          data: pokemonData,
          sortable: true,
          pagination: {
            enabled: true,
            pageSize: 10,
          },
          filtering: {
            enabled: true,
            searchableColumns: ["name", "types"],
          },
        }}
        onRowClick={(pokemon: Pokemon) => {
          alert(`${pokemon.name} Stats:
HP: ${pokemon.stats.hp}
Attack: ${pokemon.stats.attack}
Defense: ${pokemon.stats.defense}
Speed: ${pokemon.stats.speed}
Types: ${pokemon.types.join(", ")}`);
        }}
      />
    </div>
  );
};

/**
 * Loading fallback component
 */
const PokemonLoadingFallback = ({ pokemonCount }: { pokemonCount: number }) => (
  <div
    style={{
      padding: "2rem",
      textAlign: "center",
      backgroundColor: "#f8fafc",
      border: "2px dashed #cbd5e1",
      borderRadius: "12px",
      margin: "1rem 0",
    }}
  >
    <div
      style={{
        width: "48px",
        height: "48px",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #3b82f6",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        margin: "0 auto 1rem",
      }}
    />
    <h3 style={{ margin: "0 0 0.5rem", color: "#475569" }}>
      Loading {pokemonCount} Pokemon...
    </h3>
    <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
      Using pokeapi-js-wrapper with built-in caching for optimal performance
    </p>
  </div>
);

/**
 * Pokemon Suspense Example
 *
 * Demonstrates React Suspense with Pokemon data using pokeapi-js-wrapper
 * for improved caching and error handling.
 */
export const PokemonSuspenseExample = () => {
  const [pokemonCount, setPokemonCount] = useState(25);
  const [showShiny, setShowShiny] = useState(false);
  const [pokemonPromise, setPokemonPromise] = useState(() =>
    fetchPokemonForSuspense(pokemonCount),
  );

  const handleRefresh = () => {
    // Clear cache and create new promise
    pokemonCache.clear();
    setPokemonPromise(fetchPokemonForSuspense(pokemonCount));
  };

  const handleCountChange = (newCount: number) => {
    setPokemonCount(newCount);
    setPokemonPromise(fetchPokemonForSuspense(newCount));
  };

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
        <strong>⚡ React Suspense with pokeapi-js-wrapper:</strong> This example
        demonstrates React Suspense for data fetching with Pokemon data using
        the pokeapi-js-wrapper library. The wrapper provides built-in caching,
        better error handling, and optimized requests. Data is fetched once and
        cached for subsequent renders.
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
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <label>Pokemon Count:</label>
          <select
            value={pokemonCount}
            onChange={(e) => handleCountChange(Number(e.target.value))}
            style={{
              padding: "0.25rem 0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={showShiny}
            onChange={(e) => setShowShiny(e.target.checked)}
          />
          ✨ Show Shiny Sprites
        </label>

        <button
          onClick={handleRefresh}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          🔄 Refresh Data
        </button>
      </div>

      <Suspense
        fallback={<PokemonLoadingFallback pokemonCount={pokemonCount} />}
      >
        <PokemonTableContent
          showShiny={showShiny}
          pokemonPromise={pokemonPromise}
        />
      </Suspense>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
