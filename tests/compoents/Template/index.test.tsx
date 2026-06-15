import { describe, test, expect, beforeAll, afterEach, beforeEach } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
import Template from '../../../src/components/Template'
import { useExporterStore } from '../../../src/stores/exporterStore'

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

  beforeEach(() => {
    useExporterStore.setState({
      currentModel: 'PC',
      currentDirection: 'vertical',
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: 1,
    })
  })

  afterEach(cleanup)

  test('can render with defaults', () => {
    const { getByLabelText, asFragment } = render(<Template />)
    expect(asFragment()).toMatchSnapshot()

    const inputNode = getByLabelText('分辨率', {
      selector: 'input',
    }) as HTMLInputElement
    expect(inputNode.value).toBe('1')

    fireEvent.change(inputNode, { target: { value: '123' } })
    expect(inputNode.value).toBe('123')
    expect(asFragment()).toMatchSnapshot()
  })

  test('shows current model in model selector', () => {
    const { container } = render(<Template />)
    const selectionItems = container.querySelectorAll('.ant-select-selection-item')
    expect(selectionItems[0]).toHaveTextContent('PC')
  })

  test('shows current direction in direction selector', () => {
    const { container } = render(<Template />)
    const selectionItems = container.querySelectorAll('.ant-select-selection-item')
    expect(selectionItems[1]).toHaveTextContent('vertical')
  })
})
