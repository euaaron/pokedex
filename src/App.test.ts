import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import App from './App.vue'

describe('App', () => {
  it('renders with Pokedex and Footer stubs', () => {
    const wrapper = shallowMount(App, {
      global: {
        stubs: {
          Pokedex: { template: '<section id="pokedex" data-testid="pokedex-stub" />' },
          Footer: { template: '<footer data-testid="footer-stub" />' },
        },
      },
    })

    expect(wrapper.html()).toContain('data-testid="pokedex-stub"');
    expect(wrapper.html()).toContain('data-testid="footer-stub"');
  })
})
