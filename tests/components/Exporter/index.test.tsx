import { describe, test, expect, beforeAll, afterEach, vi } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
import Exporter from '../../../src/components/Exporter'
import { useExporterStore } from '../../../src/stores/exporterStore'

vi.mock('../../../src/hooks/useHighResExport', () => ({
  useHighResExport: () => ({
    exportMap: vi.fn().mockResolvedValue(new Blob(['test'], { type: 'image/png' })),
    cleanup: vi.fn(),
  }),
}))

vi.mock('mapbox-gl/dist/mapbox-gl.js', () => ({
  default: {
    Map: vi.fn(),
    accessToken: '',
  },
}))

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
    URL.createObjectURL = vi.fn(() => 'blob:test')
    URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    cleanup()
    delete (window as any).mapInstance
    useExporterStore.setState({
      exportStatus: 'idle',
      exportProgress: 0,
    })
  })

  test('renders download button', () => {
    const { container } = render(<Exporter />)
    const button = container.querySelector('.ant-btn')
    expect(button).not.toBeNull()
    expect(button!.textContent).toContain('Download')
  })

  test('renders export settings tabs', () => {
    const { container } = render(<Exporter />)
    const tabs = container.querySelectorAll('.ant-tabs-tab')
    expect(tabs.length).toBe(3)
    expect(tabs[0].textContent).toContain('预设')
    expect(tabs[1].textContent).toContain('画质')
  })

  test('download button is disabled when exporting', () => {
    useExporterStore.setState({ exportStatus: 'rendering', exportProgress: 50 })
    const { container } = render(<Exporter />)
    const button = container.querySelector('.ant-btn') as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  test('download button shows loading state during export', () => {
    useExporterStore.setState({ exportStatus: 'preparing', exportProgress: 10 })
    const { container } = render(<Exporter />)
    const button = container.querySelector('.ant-btn')
    expect(button!.textContent).toContain('准备渲染')
  })

  test('download button shows rendering text during rendering phase', () => {
    useExporterStore.setState({ exportStatus: 'rendering', exportProgress: 30 })
    const { container } = render(<Exporter />)
    const button = container.querySelector('.ant-btn')
    expect(button!.textContent).toContain('渲染中')
  })
})
