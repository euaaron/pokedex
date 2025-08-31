import { describe, expect, it, vi } from 'vitest'

// Mock axios to capture GET calls (no external top-level state)
vi.mock('axios', () => {
  const state: { lastUrl?: string } = {}
  const get = vi.fn((url: string) => {
    state.lastUrl = url
    return Promise.resolve({ data: { url } })
  })
  return {
    default: {
      create: vi.fn(() => ({ get })),
    },
    __axiosMock: { get, state },
  }
})

// Mock swrv to expose key and fetcher without side effects
vi.mock('swrv', () => {
  return {
    default: (key: string, fetcher: () => Promise<any>) => ({ key, fetcher, data: null }),
  }
})

import {
  usePokemon,
  usePokemonByName,
  usePokemonSpecies,
  usePokedex,
  usePokedexById,
  usePokedexByName,
} from './pokeapi'

describe('pokeapi wrappers', () => {
  it('usePokemon builds correct key and fetcher', async () => {
    const r = usePokemon(25) as any
    expect(r.key).toBe('pokemon/25')
    await expect(r.fetcher()).resolves.toEqual({ url: 'pokemon/25' })
  })

  it('usePokemonByName uses name key', async () => {
    const r = usePokemonByName('pikachu') as any
    expect(r.key).toBe('pokemon/pikachu')
    await expect(r.fetcher()).resolves.toEqual({ url: 'pokemon/pikachu' })
  })

  it('usePokemonSpecies hits species endpoint', async () => {
    const r = usePokemonSpecies(1) as any
    expect(r.key).toBe('pokemon-species/1')
    await expect(r.fetcher()).resolves.toEqual({ url: 'pokemon-species/1' })
  })

  it('usePokedex lists pokedex', async () => {
    const r = usePokedex() as any
    expect(r.key).toBe('pokedex')
    await expect(r.fetcher()).resolves.toEqual({ url: 'pokedex' })
  })

  it('usePokedexById uses id key', async () => {
    const r = usePokedexById(1) as any
    expect(r.key).toBe('pokedex/1')
    await expect(r.fetcher()).resolves.toEqual({ url: 'pokedex/1' })
  })

  it('usePokedexByName uses name key', async () => {
    const r = usePokedexByName('kanto') as any
    expect(r.key).toBe('pokedex/kanto')
    await expect(r.fetcher()).resolves.toEqual({ url: 'pokedex/kanto' })
  })
})
