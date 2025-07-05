import { Pokedex } from "pokeapi-js-wrapper";

/**
 * Pokemon API service using pokeapi-js-wrapper
 *
 * This service provides a clean interface for fetching Pokemon data
 * with built-in caching, error handling, and type safety.
 */

// Initialize the Pokedex instance with caching enabled
const P = new Pokedex();

/**
 * Represents a Pokemon with processed data from the PokeAPI
 */
export interface Pokemon {
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
 * Result type for API operations
 */
export type PokemonApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: Error };

/**
 * Parameters for paginated Pokemon fetching
 */
export interface PokemonFetchParams {
  readonly page?: number;
  readonly pageSize?: number;
  readonly sort?: { key: string; direction: "asc" | "desc" } | null;
  readonly searchQuery?: string;
}

/**
 * Paginated Pokemon response
 */
export interface PokemonListData {
  readonly data: Pokemon[];
  readonly total: number;
}

/**
 * Raw Pokemon type structure from the API
 */
interface RawPokemonType {
  readonly type: {
    readonly name: string;
  };
}

/**
 * Raw Pokemon stat structure from the API
 */
interface RawPokemonStat {
  readonly base_stat: number;
  readonly stat: {
    readonly name: string;
  };
}

/**
 * Raw Pokemon data structure from the API
 */
interface RawPokemon {
  readonly id: number;
  readonly name: string;
  readonly height: number;
  readonly weight: number;
  readonly types: RawPokemonType[];
  readonly sprites: {
    readonly front_default: string | null;
    readonly front_shiny: string | null;
  };
  readonly stats: RawPokemonStat[];
}

/**
 * Pokemon list item from the API
 */
interface PokemonListItem {
  readonly name: string;
  readonly url: string;
}

/**
 * Type list item from the API
 */
interface TypeListItem {
  readonly name: string;
  readonly url: string;
}

/**
 * Pokemon entry in type data
 */
interface PokemonTypeEntry {
  readonly pokemon: {
    readonly name: string;
    readonly url: string;
  };
}

/**
 * Type detail response from the API
 */
interface TypeDetailResponse {
  readonly id: number;
  readonly name: string;
  readonly pokemon: PokemonTypeEntry[];
}

/**
 * Transform raw Pokemon data from the API to our interface
 */
const transformPokemon = (rawPokemon: RawPokemon): Pokemon => {
  return {
    id: rawPokemon.id,
    name: rawPokemon.name,
    height: rawPokemon.height,
    weight: rawPokemon.weight,
    types: rawPokemon.types.map((t) => t.type.name),
    sprites: {
      front_default: rawPokemon.sprites.front_default || "",
      front_shiny: rawPokemon.sprites.front_shiny || "",
    },
    stats: {
      hp: rawPokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || 0,
      attack:
        rawPokemon.stats.find((s) => s.stat.name === "attack")?.base_stat || 0,
      defense:
        rawPokemon.stats.find((s) => s.stat.name === "defense")?.base_stat || 0,
      speed:
        rawPokemon.stats.find((s) => s.stat.name === "speed")?.base_stat || 0,
    },
  };
};

/**
 * Fetch Pokemon with server-side pagination using pokeapi-js-wrapper
 */
export const fetchPokemonWithPagination = async (
  params: PokemonFetchParams,
): Promise<PokemonApiResult<PokemonListData>> => {
  try {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const offset = (page - 1) * pageSize;

    // Get Pokemon list with pagination
    const pokemonList = await P.getPokemonsList({ offset, limit: pageSize });

    // Fetch detailed data for each Pokemon using the wrapper
    const pokemonPromises = pokemonList.results.map(
      async (pokemon: PokemonListItem) => {
        const detail = await P.getPokemonByName(pokemon.name);
        return transformPokemon(detail as RawPokemon);
      },
    );

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
        total: pokemonList.count,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error : new Error("Failed to fetch Pokemon"),
    };
  }
};

/**
 * Fetch all Pokemon for client-side operations using pokeapi-js-wrapper
 */
export const fetchAllPokemon = async (): Promise<
  PokemonApiResult<Pokemon[]>
> => {
  try {
    // Get the first 151 Pokemon (original generation) for demo purposes
    // This provides a good balance between comprehensive data and performance
    const pokemonList = await P.getPokemonsList({ offset: 0, limit: 151 });

    // Fetch detailed data for each Pokemon
    const pokemonPromises = pokemonList.results.map(
      async (pokemon: PokemonListItem) => {
        const detail = await P.getPokemonByName(pokemon.name);
        return transformPokemon(detail as RawPokemon);
      },
    );

    const pokemonData = await Promise.all(pokemonPromises);

    return {
      ok: true,
      data: pokemonData,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to fetch all Pokemon"),
    };
  }
};

/**
 * Fetch a single Pokemon by name or ID using pokeapi-js-wrapper
 */
export const fetchPokemonByName = async (
  nameOrId: string | number,
): Promise<PokemonApiResult<Pokemon>> => {
  try {
    const rawPokemon = await P.getPokemonByName(nameOrId);
    const pokemon = transformPokemon(rawPokemon);

    return {
      ok: true,
      data: pokemon,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error
          : new Error(`Failed to fetch Pokemon: ${nameOrId}`),
    };
  }
};

/**
 * Get Pokemon types list using pokeapi-js-wrapper
 */
export const fetchPokemonTypes = async (): Promise<
  PokemonApiResult<string[]>
> => {
  try {
    const typesList = await P.getTypesList();
    const types = typesList.results.map((type: TypeListItem) => type.name);

    return {
      ok: true,
      data: types,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to fetch Pokemon types"),
    };
  }
};

/**
 * Search Pokemon by type using pokeapi-js-wrapper
 */
export const fetchPokemonByType = async (
  typeName: string,
): Promise<PokemonApiResult<Pokemon[]>> => {
  try {
    const typeData = await P.getTypeByName(typeName);

    // Get Pokemon from this type (limit to first 20 for performance)
    const pokemonPromises = (typeData as TypeDetailResponse).pokemon
      .slice(0, 20)
      .map(async (pokemonEntry: PokemonTypeEntry) => {
        const detail = await P.getPokemonByName(pokemonEntry.pokemon.name);
        return transformPokemon(detail as RawPokemon);
      });

    const pokemonData = await Promise.all(pokemonPromises);

    return {
      ok: true,
      data: pokemonData,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error
          : new Error(`Failed to fetch Pokemon of type: ${typeName}`),
    };
  }
};

/**
 * Utility function to get type color for styling
 */
export const getTypeColor = (type: string): string => {
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
