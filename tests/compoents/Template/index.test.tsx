import { describe, test, expect, beforeAll, afterEach } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
import Template from '../../../src/components/Template'

describe('Template', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      }),
    })
  })

  afterEach(cleanup)

  test('can render with defaults', () => {
    const { getByLabelText, asFragment } = render(<Template />)
    expect(asFragment()).toMatchSnapshot()

    const inputNode = getByLabelText('分辨率', {
      selector: 'input',
    }) as HTMLInputElement
    expect(inputNode.value).toBe(`${window.devicePixelRatio}`)

    fireEvent.change(inputNode, { target: { value: '123' } })
    expect(inputNode.value).toBe('123')
    expect(asFragment()).toMatchSnapshot()
  })
})
