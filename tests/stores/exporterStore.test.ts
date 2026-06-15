import { describe, test, expect, beforeEach } from 'vitest'
import { useExporterStore } from '../../src/stores/exporterStore'

describe('exporterStore', () => {
  beforeEach(() => {
    useExporterStore.setState({
      currentModel: 'PC',
      currentDirection: 'vertical',
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: 1,
    })
  })

  test('initial state has correct defaults', () => {
    const state = useExporterStore.getState()
    expect(state.currentModel).toBe('PC')
    expect(state.currentDirection).toBe('vertical')
    expect(state.resolution).toBe(1)
    expect(state.width).toBe(window.innerWidth)
    expect(state.height).toBe(window.innerHeight)
  })

  test('changeCurrentModel to iPhone 11 in vertical direction', () => {
    useExporterStore.getState().changeCurrentModel('iPhone 11')
    const state = useExporterStore.getState()
    expect(state.currentModel).toBe('iPhone 11')
    expect(state.width).toBe(71.4)
    expect(state.height).toBe(144.0)
  })

  test('changeCurrentModel to iPhone 11 in horizon direction', () => {
    useExporterStore.getState().changeCurrentDirection('horizon')
    useExporterStore.getState().changeCurrentModel('iPhone 11')
    const state = useExporterStore.getState()
    expect(state.currentModel).toBe('iPhone 11')
    expect(state.width).toBe(144.0)
    expect(state.height).toBe(71.4)
  })

  test('changeCurrentModel to iPhone 11 Pro Max in vertical direction', () => {
    useExporterStore.getState().changeCurrentModel('iPhone 11 Pro Max')
    const state = useExporterStore.getState()
    expect(state.currentModel).toBe('iPhone 11 Pro Max')
    expect(state.width).toBe(77.8)
    expect(state.height).toBe(158.0)
  })

  test('switching back to PC from iPhone restores PC dimensions', () => {
    useExporterStore.getState().changeCurrentModel('iPhone 11')
    useExporterStore.getState().changeCurrentModel('PC')
    const state = useExporterStore.getState()
    expect(state.currentModel).toBe('PC')
    expect(state.width).toBe(window.innerWidth)
    expect(state.height).toBe(window.innerHeight)
  })

  test('changeCurrentDirection swaps width and height', () => {
    useExporterStore.getState().changeCurrentModel('iPhone 11')
    const before = useExporterStore.getState()
    expect(before.width).toBe(71.4)
    expect(before.height).toBe(144.0)

    useExporterStore.getState().changeCurrentDirection('horizon')
    const after = useExporterStore.getState()
    expect(after.currentDirection).toBe('horizon')
    expect(after.width).toBe(144.0)
    expect(after.height).toBe(71.4)

    useExporterStore.getState().changeCurrentDirection('vertical')
    const back = useExporterStore.getState()
    expect(back.currentDirection).toBe('vertical')
    expect(back.width).toBe(71.4)
    expect(back.height).toBe(144.0)
  })

  test('changeResolution updates resolution value', () => {
    useExporterStore.getState().changeResolution(3)
    expect(useExporterStore.getState().resolution).toBe(3)
  })

  test('unknown model name only updates currentModel not dimensions', () => {
    useExporterStore.getState().changeCurrentModel('iPhone 11')
    const prevWidth = useExporterStore.getState().width
    const prevHeight = useExporterStore.getState().height

    useExporterStore.getState().changeCurrentModel('NonExistent')
    const state = useExporterStore.getState()
    expect(state.currentModel).toBe('NonExistent')
    expect(state.width).toBe(prevWidth)
    expect(state.height).toBe(prevHeight)
  })
})
