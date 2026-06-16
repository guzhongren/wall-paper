import { describe, test, expect, beforeAll, afterEach, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
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
    window.devicePixelRatio = 2
  })

  beforeEach(() => {
    useExporterStore.setState({
      canvasSize: 'A4',
      layout: 'vertical',
      width: 210,
      height: 297,
    })
  })

  afterEach(cleanup)

  test('can render with defaults', () => {
    const { asFragment } = render(<Template />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('shows canvas size options', () => {
    const { container } = render(<Template />)
    const labels = container.querySelectorAll('.ant-radio-button-wrapper')
    const text = container.textContent || ''
    expect(text).toContain('A4')
    expect(text).toContain('正方形')
    expect(text).toContain('手机壁纸')
    expect(text).toContain('PC')
  })

  test('shows layout options', () => {
    const { container } = render(<Template />)
    const labels = container.querySelectorAll('.ant-radio-button-wrapper')
    const texts = Array.from(labels).map((el) => el.textContent)
    expect(texts).toContain('纵向')
    expect(texts).toContain('横向')
  })

  test('shows preview dimensions', () => {
    const { container } = render(<Template />)
    const inputs = container.querySelectorAll('input')
    const previewInput = inputs[inputs.length - 1] as HTMLInputElement
    expect(previewInput.value).toContain('px')
  })

  test('shows canvas size subtitle for A4', () => {
    const { container } = render(<Template />)
    expect(container.textContent).toContain('经典纸张')
  })

  test('shows PC wallpaper subtitle', () => {
    const { container } = render(<Template />)
    expect(container.textContent).toContain('PC壁纸')
  })
})
