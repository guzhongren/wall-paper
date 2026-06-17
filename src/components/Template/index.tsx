import { Form, Radio, Input } from "antd";
import { useExporterStore, CANVAS_DIMENSIONS } from "../../stores/exporterStore";
import type { CanvasSize, Layout } from "../../stores/exporterStore";
import { mm2px } from "../../utils/mm2px";

const SIZE_LABELS: Record<CanvasSize, string> = {
  A4: "A4",
  "正方形": "正方形",
  "手机壁纸": "手机壁纸",
  PC: "PC",
};

const SIZE_SUBTITLES: Record<CanvasSize, string> = {
  A4: "经典纸张",
  "正方形": "社媒",
  "手机壁纸": "手机壁纸",
  PC: "PC壁纸",
};

function formatSize(size: CanvasSize, layout: Layout): string {
  const dim = CANVAS_DIMENSIONS[size];
  const w = layout === "horizontal" ? dim.height : dim.width;
  const h = layout === "horizontal" ? dim.width : dim.height;
  return `${w} × ${h} mm`;
}

const Template = () => {
  const {
    canvasSize,
    layout,
    width,
    height,
    changeCanvasSize,
    changeLayout,
  } = useExporterStore();

  const previewW = Math.round(mm2px(width));
  const previewH = Math.round(mm2px(height));
  const aspectRatio = previewW / previewH;

  return (
    <Form layout="vertical">
      <Form.Item label="布局">
        <Radio.Group
          value={layout}
          onChange={(e) => changeLayout(e.target.value as Layout)}
        >
          <Radio.Button value="vertical">纵向</Radio.Button>
          <Radio.Button value="horizontal">横向</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="画布尺寸">
        <Radio.Group
          value={canvasSize}
          onChange={(e) => changeCanvasSize(e.target.value as CanvasSize)}
        >
          {(Object.keys(CANVAS_DIMENSIONS) as CanvasSize[]).map((size) => (
            <Radio.Button key={size} value={size} style={{ height: "auto", padding: "4px 12px" }}>
              <div style={{ textAlign: "center" }}>
                <div>{SIZE_LABELS[size]}</div>
                <div style={{ fontSize: 11, color: "#999" }}>
                  {SIZE_SUBTITLES[size]}
                </div>
              </div>
            </Radio.Button>
          ))}
        </Radio.Group>
        <div style={{ color: "#999", fontSize: 12, marginTop: 4 }}>
          {formatSize(canvasSize, layout)}
        </div>
      </Form.Item>

      <Form.Item label="预览">
        <Input
          readOnly
          value={`${previewW} × ${previewH} px（${aspectRatio.toFixed(2)}:1）`}
        />
      </Form.Item>
    </Form>
  );
};

export default Template;
