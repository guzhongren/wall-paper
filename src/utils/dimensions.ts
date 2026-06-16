import type { ExportPreset } from "../stores/exporterStore";

export const PRESET_LONG_SIDE: Record<ExportPreset, number> = {
  "1080p": 1920,
  "2K": 2560,
  "4K": 3840,
  "8K": 7680,
  custom: 0,
};

function roundEven(n: number): number {
  return Math.round(n / 2) * 2;
}

export function getExportPixels(
  preset: ExportPreset,
  customWidth: number,
  customHeight: number,
  previewWidth: number,
  previewHeight: number,
): { width: number; height: number } {
  const aspectRatio = previewWidth / previewHeight;

  if (preset === "custom") {
    if (customWidth > 0) {
      return {
        width: roundEven(customWidth),
        height: roundEven(customWidth / aspectRatio),
      };
    }
    return { width: previewWidth, height: previewHeight };
  }

  const longSide = PRESET_LONG_SIDE[preset];

  if (aspectRatio >= 1) {
    return {
      width: roundEven(longSide),
      height: roundEven(longSide / aspectRatio),
    };
  }
  return {
    width: roundEven(longSide * aspectRatio),
    height: roundEven(longSide),
  };
}
