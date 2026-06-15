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
      currentModel: 'PC',
      currentDirection: 'vertical',
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: 1,
    })
  })

  test('renders map container with initial PC dimensions', () => {
    const { container } = render(<WallPaper />)
    const mapDiv = container.querySelector('#map') as HTMLElement
    expect(mapDiv).not.toBeNull()
    expect(mapDiv.style.width).toBe(`${window.innerWidth}px`)
    expect(mapDiv.style.height).toBe(`${window.innerHeight}px`)
  })

  test('updates map container dimensions when model changes to iPhone 11', async () => {
    const { container } = render(<WallPaper />)

    await act(async () => {
      useExporterStore.getState().changeCurrentModel('iPhone 11')
    })

    const mapDiv = container.querySelector('#map') as HTMLElement
    // iPhone 11 vertical: width=71.4mm, height=144.0mm
    // mm2px(71.4) = (71.4 / 25.4) * 192 ≈ 539.72
    // mm2px(144) = (144 / 25.4) * 192 ≈ 1088.50
    const widthPx = parseFloat(mapDiv.style.width)
    const heightPx = parseFloat(mapDiv.style.height)
    expect(widthPx).toBeCloseTo(539.72, 0)
    expect(heightPx).toBeCloseTo(1088.50, 0)
  })

  test('updates map container dimensions when resolution changes', async () => {
    const { container } = render(<WallPaper />)
    const innerWidth = window.innerWidth
    const innerHeight = window.innerHeight

    await act(async () => {
      useExporterStore.getState().changeResolution(3)
    })

    const mapDiv = container.querySelector('#map') as HTMLElement
    expect(mapDiv.style.width).toBe(`${innerWidth * 3}px`)
    expect(mapDiv.style.height).toBe(`${innerHeight * 3}px`)
  })

  test('calls map.resize() after dimension change', async () => {
    render(<WallPaper />)
    mockResize.mockClear()

    await act(async () => {
      useExporterStore.getState().changeCurrentModel('iPhone 11')
    })

    expect(mockResize).toHaveBeenCalled()
  })

  test('handles resolution=0 by clamping to 1', async () => {
    const { container } = render(<WallPaper />)
    const innerWidth = window.innerWidth
    const innerHeight = window.innerHeight

    await act(async () => {
      useExporterStore.getState().changeResolution(0)
    })

    const mapDiv = container.querySelector('#map') as HTMLElement
    // Math.max(1, 0) = 1, so dimensions should be 1x
    expect(mapDiv.style.width).toBe(`${innerWidth}px`)
    expect(mapDiv.style.height).toBe(`${innerHeight}px`)
  })
})
