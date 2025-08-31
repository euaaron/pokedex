import { describe, expect, it } from 'vitest'
import type { Pokedex } from './pokedex'
import type { Pokemon } from './pokemon'

describe('models typing', () => {
  it('pokedex shape allows entries', () => {
    const d: Pokedex = { id: 1, name: 'kanto', description: 'desc', region: 'kanto', pokemon_entries: [] }
    expect(d.name).toBe('kanto')
  })

  it('pokemon shape allows basic fields', () => {
    const p: Pokemon = {
      id: 25,
      name: 'pikachu',
      color: 'yellow',
      types: [],
      species: 'pikachu',
      evolutions: [],
      description: '',
      image: '',
      cries: '',
      height: 4,
      weight: 60,
      area: '',
    }
    expect(p.color).toBe('yellow')
  })
})
