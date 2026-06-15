import { Form, Input, Select } from "antd";
import { useExporterStore } from "../../stores/exporterStore";

const { Option } = Select;

const Template = () => {
  const {
    directions,
    models,
    currentDirection,
    currentModel,
    resolution,
    changeResolution,
    changeCurrentModel,
    changeCurrentDirection,
  } = useExporterStore();

  const changeResolutionHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
    changeResolution(parseFloat(evt.target.value));
  };

  return (
    <Form layout="vertical">
      <Form.Item label="机型">
        <Select defaultValue={currentModel} onChange={(value: string) => changeCurrentModel(value)}>
          {models.map((model, index) => (
            <Option key={index} value={model.name}>
              {model.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="方向">
        <Select
          defaultValue={currentDirection}
          onChange={(value: string) => changeCurrentDirection(value)}
        >
          {directions.map((direction, index) => (
            <Option key={index} value={direction}>
              {direction}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="分辨率" htmlFor="resolution">
        <Input
          id="resolution"
          placeholder="input placeholder"
          value={resolution}
          onChange={changeResolutionHandler}
        />
      </Form.Item>
    </Form>
  );
};

export default Template;
