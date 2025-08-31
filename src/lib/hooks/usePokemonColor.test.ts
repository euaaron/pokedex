import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

// Mock api hook to control species color
const speciesStore: Record<number, any> = {}
vi.mock('../api/pokeapi', () => ({
  usePokemonSpecies: (id: number) => {
    if (!speciesStore[id]) speciesStore[id] = ref<any>(null)
    return { data: speciesStore[id] }
  },
}))

import { usePokemonColor } from './usePokemonColor'
import * as pokeapi from '../api/pokeapi'

describe('usePokemonColor', () => {
  it('returns transparent while loading', () => {
    const color = usePokemonColor(1)
    expect(color.value).toBe('transparent')
  })

  it('maps known colors to hex', () => {
  const ref1 = (pokeapi.usePokemonSpecies(1) as any).data
  ref1.value = { color: { name: 'red' } }
  const color = usePokemonColor(1)
    expect(color.value).toBe('#ef4444')
  })

  it('falls back to provided color string when not in map', () => {
  const ref2 = (pokeapi.usePokemonSpecies(2) as any).data
  ref2.value = { color: { name: 'beige' } }
  const color = usePokemonColor(2)
    expect(color.value).toBe('beige')
  })
})
