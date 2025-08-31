export interface DexPokemon {
  entry_number: number;
  pokemon_species: {
    name: string;
    url: string;
  };
}

export interface Pokedex {
  id: number;
  name: string;
  description: string;
  region: string;
  pokemon_entries: DexPokemon[];
}
