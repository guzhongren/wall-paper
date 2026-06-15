import { describe, test, expect, beforeAll, afterEach, vi } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
import Exporter from '../../../src/components/Exporter'

describe('Exporter', () => {
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
  })

  afterEach(() => {
    cleanup()
    delete (window as any).mapInstance
  })

  test('renders download button', () => {
    const { container } = render(<Exporter />)
    const button = container.querySelector('.ant-btn')
    expect(button).not.toBeNull()
    expect(button!.textContent).toContain('Download')
  })

  test('download button contains anchor with download attribute', () => {
    const { container } = render(<Exporter />)
    const anchor = container.querySelector('a[download="map.png"]')
    expect(anchor).not.toBeNull()
  })

  test('calls getCanvas().toDataURL on download click', () => {
    const mockToDataURL = vi.fn().mockReturnValue('data:image/png;base64,test')
    ;(window as any).mapInstance = {
      getCanvas: () => ({
        toDataURL: mockToDataURL,
      }),
    }

    const { container } = render(<Exporter />)
    const button = container.querySelector('.ant-btn') as HTMLElement
    fireEvent.click(button)

    expect(mockToDataURL).toHaveBeenCalledWith('image/png')
  })

  test('sets anchor href to data URL on click', () => {
    const mockToDataURL = vi.fn().mockReturnValue('data:image/png;base64,test123')
    ;(window as any).mapInstance = {
      getCanvas: () => ({
        toDataURL: mockToDataURL,
      }),
    }

    const { container } = render(<Exporter />)
    const button = container.querySelector('.ant-btn') as HTMLElement
    fireEvent.click(button)

    const anchor = container.querySelector('a[download="map.png"]') as HTMLAnchorElement
    expect(anchor.href).toContain('data:image/png;base64,test123')
  })
})
