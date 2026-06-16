export function getPrintSizeInches(
  pixelW: number,
  pixelH: number,
  dpi: number,
): { width: number; height: number } {
  if (dpi <= 0) return { width: 0, height: 0 };
  return {
    width: pixelW / dpi,
    height: pixelH / dpi,
  };
}

export function getPrintSizeMM(
  pixelW: number,
  pixelH: number,
  dpi: number,
): { width: number; height: number } {
  const inches = getPrintSizeInches(pixelW, pixelH, dpi);
  return {
    width: inches.width * 25.4,
    height: inches.height * 25.4,
  };
}

export const DPI_PRESETS = [
  { label: "屏幕 (72)", value: 72 },
  { label: "办公 (150)", value: 150 },
  { label: "打印 (300)", value: 300 },
];

export function estimateFileSizeMB(
  pixelW: number,
  pixelH: number,
  format: "png" | "jpeg",
  jpegQuality: number,
): number {
  const totalPixels = pixelW * pixelH;
  if (format === "png") {
    return (totalPixels * 3 * 0.7) / (1024 * 1024);
  }
  return (totalPixels * 3 * (1 - jpegQuality * 0.8)) / (1024 * 1024);
}
