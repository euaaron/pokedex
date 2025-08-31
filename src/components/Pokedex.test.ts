import { describe, expect, it, vi, beforeAll, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'

const pokedexRef = ref<any>(null)
vi.mock('../lib/api/pokeapi', () => ({
  usePokedexById: () => ({ data: pokedexRef }),
}))

import Pokedex from './Pokedex.vue'

describe('Pokedex', () => {
  let ioCallback: ((entries: Array<{ isIntersecting: boolean }>) => void) | null = null
  beforeAll(() => {
    // Mock IntersectionObserver for JSDOM
    // @ts-ignore
    global.IntersectionObserver = class {
      constructor(cb: any) { ioCallback = cb }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as any
  })

  beforeEach(() => {
    // default pokedex with 60 entries
    pokedexRef.value = {
      name: 'kanto',
      description: 'desc',
      pokemon_entries: Array.from({ length: 60 }, (_, i) => ({ entry_number: i + 1, pokemon_species: { name: 'p' + (i + 1), url: '' } })),
    }
  })

  it('renders title and description from pokedex', () => {
    const wrapper = shallowMount(Pokedex, {
      global: {
        stubs: { Card: true },
      },
    })
    const text = wrapper.text().toLowerCase()
    expect(text).toContain('kanto')
    expect(text).toContain('desc')
  })

  it('loads more items when sentinel intersects until end', async () => {
    const wrapper = shallowMount(Pokedex, {
      global: {
        stubs: { Card: { template: '<div class="stub-card" />' } },
      },
    })
    // initial batch is 24
    expect(wrapper.findAll('.stub-card').length).toBe(24)
  // simulate intersections to load more; ensureInitialFill may already top up to full
  ioCallback && ioCallback([{ isIntersecting: true } as any])
  await nextTick()
  const countAfterFirst = wrapper.findAll('.stub-card').length
  expect([48, 60]).toContain(countAfterFirst)
    ioCallback && ioCallback([{ isIntersecting: true } as any])
    await nextTick()
    expect(wrapper.findAll('.stub-card').length).toBe(60)
    // hasMore now false, sentinel disappears
    expect(wrapper.find('.sentinel').exists()).toBe(false)
  })

  it('auto-fills viewport on mount when content is short (ensureInitialFill)', async () => {
    // make viewport tall and document short
    ;(window as any).innerHeight = 1000
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, get: () => 100 })
    const wrapper = shallowMount(Pokedex, {
      global: {
        stubs: { Card: { template: '<div class="stub-card" />' } },
      },
    })
    // allow nextTick chain to run
    for (let i = 0; i < 6; i++) await nextTick()
    expect(wrapper.findAll('.stub-card').length).toBe(60)
  })

  it('toggles mute button text', async () => {
    const wrapper = shallowMount(Pokedex)
    const btn = wrapper.find('button.mute-toggle')
    expect(btn.text().toLowerCase()).toContain('unmute')
    await btn.trigger('click')
    expect(btn.text().toLowerCase()).toContain('mute')
  })

  it('shows loading header when pokedex is not yet available', () => {
    pokedexRef.value = null
    const wrapper = shallowMount(Pokedex, { global: { stubs: { Card: true } } })
    expect(wrapper.text().toLowerCase()).toContain('loading')
    expect(wrapper.find('button.mute-toggle').exists()).toBe(false)
  })
})
