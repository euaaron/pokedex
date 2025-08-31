import axios from 'axios';
import useSWRV from 'swrv';
import type { Pokedex } from '../models/pokedex';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
});

export function usePokemon(id: number) {
  return useSWRV(`pokemon/${id}`, () => api.get(`pokemon/${id}`).then(res => res.data));
}

export function usePokemonSpecies(id: number) {
  return useSWRV<{ color?: { name: string } }>(
    `pokemon-species/${id}`,
    () => api.get(`pokemon-species/${id}`).then(res => res.data)
  );
}

export function usePokemonByName(name: string) {
  return useSWRV(`pokemon/${name}`, () => api.get(`pokemon/${name}`).then(res => res.data));
}

export function usePokedex() {
  return useSWRV('pokedex', () => api.get('pokedex').then(res => res.data));
}

export function usePokedexById(id: number) {
  return useSWRV<Pokedex>(`pokedex/${id}`, () => api.get(`pokedex/${id}`).then(res => res.data));
}

export function usePokedexByName(name: string) {
  return useSWRV(`pokedex/${name}`, () => api.get(`pokedex/${name}`).then(res => res.data));
}
