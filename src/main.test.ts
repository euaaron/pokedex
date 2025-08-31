import { describe, expect, it, vi } from 'vitest'

// spies exposed for assertions
const mountSpy = vi.fn()
const createAppSpy = vi.fn(() => ({ mount: mountSpy }))

// Hoisted mocks must be declared at top-level
vi.mock('./App.vue', () => ({ default: {} }))
vi.mock('vue', () => ({
  createApp: createAppSpy,
}))

describe('main bootstrap', () => {
  it('mounts the app to #app element', async () => {
    // Create a fake #app element
    const el = document.createElement('div')
    el.id = 'app'
    document.body.appendChild(el)

    // Import after mocks in place
    await import('./main')

    expect(createAppSpy).toHaveBeenCalled()
    expect(mountSpy).toHaveBeenCalledWith('#app')
  })
})
