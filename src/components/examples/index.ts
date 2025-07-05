/**
 * Table examples exports
 */

// Basic table examples
export { FullFeaturedTableExample } from "./full-featured-table-example";
export { SimpleTableExample } from "./simple-table-example";
export { ActionButtonTableExample } from "./action-button-table-example";
export { TypeSafeTableExample } from "./typesafe-table-example";

// Async table examples
export {
  ServerSideTableExample,
  ClientSideTableExample,
  CustomAsyncTableExample,
} from "./async-table-examples";

// Pokemon table examples
export {
  PokemonServerSideExample,
  PokemonClientSideExample,
} from "./pokemon-table-example";

// Pokemon Suspense examples
export { PokemonSuspenseExample } from "./pokemon-suspense-example";
export { PokemonRowSuspenseExample } from "./pokemon-row-suspense-example";
export { PokemonPageSuspenseExample } from "./pokemon-page-suspense-example";

// Shared types and data
export type { User } from "./types";
export { sampleUsers } from "./types";

// Pokemon API service
export type {
  Pokemon,
  PokemonApiResult,
  PokemonFetchParams,
  PokemonListData,
} from "./pokemon-api";
export {
  fetchPokemonWithPagination,
  fetchAllPokemon,
  fetchPokemonByName,
  fetchPokemonTypes,
  fetchPokemonByType,
  getTypeColor,
} from "./pokemon-api";
