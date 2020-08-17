export const mm2px = (mm: number) => {
  const dpi = window.devicePixelRatio * 96
  return mm / 25.4 * dpi
}