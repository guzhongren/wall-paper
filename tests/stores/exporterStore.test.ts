import { describe, test, expect, beforeEach } from 'vitest'
import { useExporterStore } from '../../src/stores/exporterStore'

describe('exporterStore', () => {
  beforeEach(() => {
    useExporterStore.setState({
      canvasSize: 'A4',
      layout: 'vertical',
      width: 210,
      height: 297,
      exportPreset: '4K',
      customWidth: 3840,
      customHeight: 2160,
      dpi: 72,
      format: 'png',
      jpegQuality: 0.92,
      exportStatus: 'idle',
      exportProgress: 0,
    })
  })

  test('initial state has correct defaults', () => {
    const state = useExporterStore.getState()
    expect(state.canvasSize).toBe('A4')
    expect(state.layout).toBe('vertical')
    expect(state.exportPreset).toBe('4K')
    expect(state.dpi).toBe(72)
    expect(state.format).toBe('png')
    expect(state.width).toBe(210)
    expect(state.height).toBe(297)
  })

  test('changeCanvasSize to 正方形', () => {
    useExporterStore.getState().changeCanvasSize('正方形')
    const state = useExporterStore.getState()
    expect(state.canvasSize).toBe('正方形')
    expect(state.width).toBe(210)
    expect(state.height).toBe(210)
  })

  test('changeCanvasSize to 手机壁纸', () => {
    useExporterStore.getState().changeCanvasSize('手机壁纸')
    const state = useExporterStore.getState()
    expect(state.canvasSize).toBe('手机壁纸')
    expect(state.width).toBe(77.8)
    expect(state.height).toBe(158)
  })

  test('changeCanvasSize to PC', () => {
    useExporterStore.getState().changeCanvasSize('PC')
    const state = useExporterStore.getState()
    expect(state.canvasSize).toBe('PC')
    expect(state.width).toBe(480)
    expect(state.height).toBe(270)
  })

  test('changeCanvasSize preserves layout orientation', () => {
    useExporterStore.getState().changeLayout('horizontal')
    useExporterStore.getState().changeCanvasSize('A4')
    const state = useExporterStore.getState()
    expect(state.canvasSize).toBe('A4')
    expect(state.layout).toBe('horizontal')
    expect(state.width).toBe(297)
    expect(state.height).toBe(210)
  })

  test('changeLayout swaps width and height', () => {
    useExporterStore.getState().changeCanvasSize('手机壁纸')
    expect(useExporterStore.getState().width).toBe(77.8)
    expect(useExporterStore.getState().height).toBe(158)

    useExporterStore.getState().changeLayout('horizontal')
    const after = useExporterStore.getState()
    expect(after.layout).toBe('horizontal')
    expect(after.width).toBe(158)
    expect(after.height).toBe(77.8)

    useExporterStore.getState().changeLayout('vertical')
    const back = useExporterStore.getState()
    expect(back.layout).toBe('vertical')
    expect(back.width).toBe(77.8)
    expect(back.height).toBe(158)
  })

  test('正方形 layout swap is symmetric', () => {
    useExporterStore.getState().changeCanvasSize('正方形')
    useExporterStore.getState().changeLayout('horizontal')
    expect(useExporterStore.getState().width).toBe(210)
    expect(useExporterStore.getState().height).toBe(210)
  })

  test('setExportPreset changes preset value', () => {
    useExporterStore.getState().setExportPreset('8K')
    expect(useExporterStore.getState().exportPreset).toBe('8K')
  })

  test('setDpi changes dpi value', () => {
    useExporterStore.getState().setDpi(300)
    expect(useExporterStore.getState().dpi).toBe(300)
  })

  test('setFormat changes format value', () => {
    useExporterStore.getState().setFormat('jpeg')
    expect(useExporterStore.getState().format).toBe('jpeg')
  })

  test('setJpegQuality changes jpeg quality value', () => {
    useExporterStore.getState().setJpegQuality(0.8)
    expect(useExporterStore.getState().jpegQuality).toBe(0.8)
  })

  test('setCustomDimensions updates width and height', () => {
    useExporterStore.getState().setCustomDimensions(5000, 3000)
    const state = useExporterStore.getState()
    expect(state.customWidth).toBe(5000)
    expect(state.customHeight).toBe(3000)
  })

  test('setExportStatus updates status and progress', () => {
    useExporterStore.getState().setExportStatus('rendering', 50)
    const state = useExporterStore.getState()
    expect(state.exportStatus).toBe('rendering')
    expect(state.exportProgress).toBe(50)
  })
})
