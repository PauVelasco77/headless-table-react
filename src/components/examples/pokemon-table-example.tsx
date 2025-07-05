import { AsyncTable, SimpleAsyncTable } from "../table";
import type { TableColumn } from "../table";
import {
  fetchPokemonWithPagination,
  fetchAllPokemon,
  getTypeColor,
  type Pokemon,
} from "./pokemon-api";
import "../table/table.css";

/**
 * Pokemon table columns configuration
 */
const pokemonColumns: TableColumn<Pokemon>[] = [
  {
    key: "id",
    header: "ID",
    accessor: "id",
    sortable: true,
    render: (value) => `#${String(value).padStart(3, "0")}`,
  },
  {
    key: "sprite",
    header: "Sprite",
    accessor: "sprites.front_default",
    render: (value, row) => (
      <img
        src={value as string}
        alt={`${row.name} sprite`}
        width={48}
        height={48}
        style={{ imageRendering: "pixelated" }}
      />
    ),
  },
  {
    key: "name",
    header: "Name",
    accessor: "name",
    sortable: true,
    render: (value) => (
      <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>
        {value as string}
      </span>
    ),
  },
  {
    key: "types",
    header: "Types",
    accessor: "types",
    render: (value) => (
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {(value as string[]).map((type) => (
          <span
            key={type}
            style={{
              backgroundColor: getTypeColor(type),
              color: "white",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "bold",
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
    render: (value) => `${(value as number) / 10} m`,
  },
  {
    key: "weight",
    header: "Weight",
    accessor: "weight",
    sortable: true,
    render: (value) => `${(value as number) / 10} kg`,
  },
  {
    key: "hp",
    header: "HP",
    accessor: "stats.hp",
    sortable: true,
    render: (value) => (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>{value as number}</span>
        <div
          style={{
            width: "60px",
            height: "8px",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(((value as number) / 255) * 100, 100)}%`,
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
    accessor: "stats.attack",
    sortable: true,
    render: (value) => (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>{value as number}</span>
        <div
          style={{
            width: "60px",
            height: "8px",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(((value as number) / 255) * 100, 100)}%`,
              height: "100%",
              backgroundColor: "#f44336",
            }}
          />
        </div>
      </div>
    ),
  },
  {
    key: "defense",
    header: "Defense",
    accessor: "stats.defense",
    sortable: true,
    render: (value) => (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>{value as number}</span>
        <div
          style={{
            width: "60px",
            height: "8px",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(((value as number) / 255) * 100, 100)}%`,
              height: "100%",
              backgroundColor: "#2196f3",
            }}
          />
        </div>
      </div>
    ),
  },
  {
    key: "speed",
    header: "Speed",
    accessor: "stats.speed",
    sortable: true,
    render: (value) => (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>{value as number}</span>
        <div
          style={{
            width: "60px",
            height: "8px",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(((value as number) / 255) * 100, 100)}%`,
              height: "100%",
              backgroundColor: "#ff9800",
            }}
          />
        </div>
      </div>
    ),
  },
];

/**
 * Pokemon Server-Side Table Example
 *
 * Demonstrates server-side pagination, sorting, and filtering using AsyncTable
 * with the pokeapi-js-wrapper for improved caching and error handling.
 */
export const PokemonServerSideExample = () => {
  return (
    <div>
      <h3>🐱 Pokemon Server-Side Table (with pokeapi-js-wrapper)</h3>
      <p>
        Server-side pagination with PokeAPI using the pokeapi-js-wrapper
        library. Features built-in caching, better error handling, and optimized
        requests.
      </p>
      <AsyncTable
        config={{
          fetchData: fetchPokemonWithPagination,
          columns: pokemonColumns,
          pagination: { enabled: true, pageSize: 12 },
          filtering: { enabled: true, searchableColumns: ["name", "types"] },
          sortable: true,
        }}
        onRowClick={(pokemon) =>
          console.log(`Clicked on ${pokemon.name} (#${pokemon.id})`)
        }
      />
    </div>
  );
};

/**
 * Pokemon Client-Side Table Example
 *
 * Demonstrates client-side operations using SimpleAsyncTable with all Pokemon
 * data loaded once and cached by the pokeapi-js-wrapper.
 */
export const PokemonClientSideExample = () => {
  return (
    <div>
      <h3>⚡ Pokemon Client-Side Table (with pokeapi-js-wrapper)</h3>
      <p>
        Client-side operations with first 151 Pokemon loaded once using
        pokeapi-js-wrapper. All pagination, sorting, and filtering happens
        locally with excellent caching performance.
      </p>
      <SimpleAsyncTable
        config={{
          fetchData: fetchAllPokemon,
          columns: pokemonColumns,
          pagination: { enabled: true, pageSize: 15 },
          filtering: { enabled: true, searchableColumns: ["name", "types"] },
          sortable: true,
        }}
        showRefreshButton={true}
        onRowClick={(pokemon) =>
          console.log(`Clicked on ${pokemon.name} (#${pokemon.id})`)
        }
      />
    </div>
  );
};
