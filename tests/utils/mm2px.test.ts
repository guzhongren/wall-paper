import { describe, test, expect, beforeEach } from 'vitest'
import { mm2px } from '../../src/utils/mm2px'

describe('mm2px', () => {
  beforeEach(() => {
    window.devicePixelRatio = 2
  })

  test('converts mm to px at default dpr=2', () => {
    expect(mm2px(100)).toBeCloseTo(755.91, 1)
  })

  test('iPhone 11 width (71.4mm) at dpr=2', () => {
    expect(mm2px(71.4)).toBeCloseTo(539.72, 1)
  })

  test('iPhone 11 height (144mm) at dpr=2', () => {
    expect(mm2px(144)).toBeCloseTo(1088.50, 1)
  })

  test('handles zero mm', () => {
    expect(mm2px(0)).toBe(0)
  })

  test('respects devicePixelRatio of 1', () => {
    window.devicePixelRatio = 1
    expect(mm2px(25.4)).toBe(96)
  })

  test('respects devicePixelRatio of 3', () => {
    window.devicePixelRatio = 3
    expect(mm2px(25.4)).toBe(288)
  })
})
