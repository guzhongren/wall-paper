import { Form, Radio, Select, Slider, Button, InputNumber, Space } from "antd";
import { useExporterStore } from "../../stores/exporterStore";
import type { ExportPreset, ExportFormat } from "../../stores/exporterStore";
import { getExportPixels } from "../../utils/dimensions";
import {
  DPI_PRESETS,
  getPrintSizeInches,
  getPrintSizeMM,
  estimateFileSizeMB,
} from "../../utils/dpi";

const PRESET_OPTIONS: { label: string; value: ExportPreset }[] = [
  { label: "1080p", value: "1080p" },
  { label: "2K", value: "2K" },
  { label: "4K", value: "4K" },
  { label: "8K", value: "8K" },
  { label: "自定义", value: "custom" },
];

function getPreviewDimensions(): { width: number; height: number } {
  const container = window.mapInstance?.getContainer();
  if (container) {
    return { width: container.clientWidth, height: container.clientHeight };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

const QualityPanel = () => {
  const {
    exportPreset,
    customWidth,
    customHeight,
    dpi,
    format,
    jpegQuality,
    setExportPreset,
    setCustomDimensions,
    setDpi,
    setFormat,
    setJpegQuality,
  } = useExporterStore();

  const preview = getPreviewDimensions();
  const previewAspect = preview.width / preview.height;
  const pixels = getExportPixels(
    exportPreset,
    customWidth,
    customHeight,
    preview.width,
    preview.height,
  );
  const printInches = getPrintSizeInches(pixels.width, pixels.height, dpi);
  const printMM = getPrintSizeMM(pixels.width, pixels.height, dpi);
  const fileSizeMB = estimateFileSizeMB(
    pixels.width,
    pixels.height,
    format,
    jpegQuality,
  );

  function handleCustomWidthChange(v: number | null) {
    const w = v ?? 1920;
    const h = Math.round(w / previewAspect / 2) * 2;
    setCustomDimensions(w, h);
  }

  function handleCustomHeightChange(v: number | null) {
    const h = v ?? 1080;
    const w = Math.round(h * previewAspect / 2) * 2;
    setCustomDimensions(w, h);
  }

  return (
    <Form layout="vertical">
      <Form.Item label="导出分辨率">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PRESET_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              type={exportPreset === opt.value ? "primary" : "default"}
              onClick={() => setExportPreset(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </Form.Item>

      {exportPreset === "custom" && (
        <Form.Item label="自定义尺寸 (px)">
          <Space>
            <InputNumber
              min={1}
              max={32768}
              value={customWidth}
              onChange={handleCustomWidthChange}
              addonAfter="W"
            />
            <InputNumber
              min={1}
              max={32768}
              value={customHeight}
              onChange={handleCustomHeightChange}
              addonAfter="H"
            />
          </Space>
        </Form.Item>
      )}

      <Form.Item label="DPI">
        <Select
          value={dpi}
          onChange={(v: number) => setDpi(v)}
          style={{ width: 200 }}
        >
          {DPI_PRESETS.map((p) => (
            <Select.Option key={p.value} value={p.value}>
              {p.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="图片格式">
        <Radio.Group
          value={format}
          onChange={(e) => setFormat(e.target.value as ExportFormat)}
        >
          <Radio.Button value="png">PNG</Radio.Button>
          <Radio.Button value="jpeg">JPEG</Radio.Button>
        </Radio.Group>
      </Form.Item>

      {format === "jpeg" && (
        <Form.Item label={`JPEG 质量: ${Math.round(jpegQuality * 100)}%`}>
          <Slider
            min={0.1}
            max={1}
            step={0.01}
            value={jpegQuality}
            onChange={(v) => setJpegQuality(v)}
          />
        </Form.Item>
      )}

      <Form.Item label="打印尺寸">
        <div style={{ color: "#666" }}>
          <div>
            {printInches.width.toFixed(2)} × {printInches.height.toFixed(2)}{" "}
            inch
          </div>
          <div>
            {printMM.width.toFixed(0)} × {printMM.height.toFixed(0)} mm
          </div>
        </div>
      </Form.Item>

      <Form.Item label="导出像素">
        <span>
          {pixels.width} × {pixels.height} px @ {dpi} DPI
        </span>
      </Form.Item>

      <Form.Item label="预览像素">
        <span style={{ color: "#999" }}>
          {preview.width} × {preview.height} px（宽高比{" "}
          {previewAspect.toFixed(2)}:1）
        </span>
      </Form.Item>

      <Form.Item label="预估文件大小">
        <span>
          {fileSizeMB < 1
            ? `${(fileSizeMB * 1024).toFixed(0)} KB`
            : `${fileSizeMB.toFixed(1)} MB`}
        </span>
      </Form.Item>
    </Form>
  );
};

export default QualityPanel;
