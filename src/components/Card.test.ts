import { describe, expect, it, vi, beforeAll, beforeEach } from 'vitest'
import { ref } from 'vue'
import { shallowMount } from '@vue/test-utils'

const mockUsePokemon = vi.fn()
vi.mock('../lib/api/pokeapi', () => ({
  usePokemon: (...args: any[]) => mockUsePokemon(...args),
}))
vi.mock('../lib/hooks/usePokemonColor', () => ({
  usePokemonColor: () => ref('#ff0000') as any,
}))

import Card from './Card.vue'

describe('Card', () => {
  beforeAll(() => {
    // mock audio to avoid actual playback
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined as any)
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })
  beforeEach(() => {
    mockUsePokemon.mockReturnValue({ data: ref({ sprites: { front_default: 'img.png' }, cries: { latest: 'cry.mp3' } }) })
  })

  it('applies CSS var color and renders basic structure', () => {
    const wrapper = shallowMount(Card, {
      props: {
        dexPokemon: { entry_number: 1, pokemon_species: { name: 'bulbasaur', url: '' } },
        muteCries: true,
      },
    })
    const btn = wrapper.find('button')
    expect(btn.attributes('style')).toContain('--pokemon-color')
    expect(wrapper.text()).toContain('bulbasaur')
    // image and audio should be present when pokemon and crySrc exist
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('audio').exists()).toBe(true)
  })

  it('does not play cry when muted', async () => {
    const playSpy = vi.spyOn(HTMLMediaElement.prototype, 'play')
    const wrapper = shallowMount(Card, {
      props: {
        dexPokemon: { entry_number: 1, pokemon_species: { name: 'bulbasaur', url: '' } },
        muteCries: true,
      },
    })
    await wrapper.find('button').trigger('click')
    expect(playSpy).not.toHaveBeenCalled()
  })

  it('plays cry once on click when unmuted', async () => {
    const playSpy = vi.spyOn(HTMLMediaElement.prototype, 'play')
    const wrapper = shallowMount(Card, {
      props: {
        dexPokemon: { entry_number: 4, pokemon_species: { name: 'charmander', url: '' } },
        muteCries: false,
      },
    })
    await wrapper.find('button').trigger('click')
    expect(playSpy).toHaveBeenCalledTimes(1)
  })

  it('renders legacy cry and no image when pokemon data is missing', () => {
    mockUsePokemon.mockReturnValueOnce({ data: ref({ cries: { legacy: 'legacy.mp3' } }) })
    const wrapper = shallowMount(Card, {
      props: {
        dexPokemon: { entry_number: 7, pokemon_species: { name: 'squirtle', url: '' } },
        muteCries: true,
      },
    })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('audio').exists()).toBe(true)
  })
})
