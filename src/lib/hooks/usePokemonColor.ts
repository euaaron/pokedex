import { computed } from 'vue';
import { usePokemonSpecies } from "../api/pokeapi";

export function usePokemonColor(id: number) {
  const { data: species } = usePokemonSpecies(id);

  return computed(() => {
    const color = species.value?.color?.name;
    const map: Record<string, string> = {
      black: '#2e2e2e',
      blue: '#3b82f6',
      brown: '#92400e',
      gray: '#6b7280',
      green: '#10b981',
      pink: '#ec4899',
      purple: '#8b5cf6',
      red: '#ef4444',
      white: '#f3f4f6',
      yellow: '#f59e0b',
    };
    return color ? (map[color] ?? color) : 'transparent';
  });
}
