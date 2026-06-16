import { describe, test, expect, beforeAll, afterEach, vi } from 'vitest'
import { render, cleanup, act } from '@testing-library/react'
import WallPaper from '../../../src/containers/WallPaper'
import { useExporterStore } from '../../../src/stores/exporterStore'

const mockResize = vi.fn()

vi.mock('mapbox-gl/dist/mapbox-gl.js', () => ({
  default: {
    Map: vi.fn(() => ({
      remove: vi.fn(),
      resize: mockResize,
    })),
    accessToken: '',
  },
}))

describe('WallPaper', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    })
    window.devicePixelRatio = 2
  })

  afterEach(() => {
    cleanup()
    mockResize.mockClear()
    delete (window as any).mapInstance
    useExporterStore.setState({
      canvasSize: 'A4',
      layout: 'vertical',
      width: 210,
      height: 297,
    })
  })

  test('renders map container with A4 vertical dimensions', () => {
    const { container } = render(<WallPaper />)
    const mapDiv = container.querySelector('#map') as HTMLElement
    expect(mapDiv).not.toBeNull()
    // mm2px(210) = (210/25.4)*192 ≈ 1587.40
    // mm2px(297) = (297/25.4)*192 ≈ 2245.04
    const w = parseFloat(mapDiv.style.width)
    const h = parseFloat(mapDiv.style.height)
    expect(w).toBeCloseTo(1587.40, -1)
    expect(h).toBeCloseTo(2245.04, -1)
  })

  test('updates map container dimensions when canvas size changes', async () => {
    const { container } = render(<WallPaper />)

    await act(async () => {
      useExporterStore.getState().changeCanvasSize('正方形')
    })

    const mapDiv = container.querySelector('#map') as HTMLElement
    const w = parseFloat(mapDiv.style.width)
    const h = parseFloat(mapDiv.style.height)
    // 正方形 210×210 → mm2px = (210/25.4)*192 ≈ 1587.40 each
    expect(w).toBeCloseTo(1587.40, -1)
    expect(h).toBeCloseTo(1587.40, -1)
  })

  test('calls map.resize() after dimension change', async () => {
    render(<WallPaper />)
    mockResize.mockClear()

    await act(async () => {
      useExporterStore.getState().changeCanvasSize('手机壁纸')
    })

    expect(mockResize).toHaveBeenCalled()
  })

  test('preview dimensions are 1x regardless of export settings', async () => {
    const { container } = render(<WallPaper />)
    const mapDiv = container.querySelector('#map') as HTMLElement
    const prevW = parseFloat(mapDiv.style.width)

    await act(async () => {
      useExporterStore.getState().setExportPreset('8K')
    })

    expect(parseFloat(mapDiv.style.width)).toBe(prevW)
  })

  test('layout change to horizontal swaps dimensions', async () => {
    const { container } = render(<WallPaper />)

    const vertW = parseFloat((container.querySelector('#map') as HTMLElement).style.width)

    await act(async () => {
      useExporterStore.getState().changeLayout('horizontal')
    })

    const horizW = parseFloat((container.querySelector('#map') as HTMLElement).style.width)
    expect(horizW).not.toBe(vertW)
  })
})
