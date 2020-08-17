import React from 'react';
import { Form, Input, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux'

import { IRootState, changeResolution, changeCurrentModel,changeCurrentDirection } from '../Exporter/exporterSlice'

const { Option } = Select



const Template = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm();

  const { directions, models, currentDirection, currentModel, resolution } = useSelector((state: IRootState) => state.exporter)

  const changeResolutionHandler = (evt: any) => {
    dispatch(changeResolution({ resolution: parseFloat(evt.target.value) }))
  }
  const changeModelHandler = (value: string) => {
    dispatch(changeCurrentModel({currentModel: value}))
  }
  const changeCurrentDirectionHandler = (value: string) => {
    dispatch(changeCurrentDirection({currentDirection: value}))
  }

  return (
    <>
      <Form
        layout={'vertical'}
        form={form}
      >
        <Form.Item label="机型">
          <Select defaultValue={`${currentModel}`} onChange={changeModelHandler}>
            {models.map((model, index) => (
              <Option key={index} value={model.name}>{model.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="方向">
          <Select defaultValue={`${currentDirection}`} onChange={changeCurrentDirectionHandler}>
            {directions.map((direction, index) => (
              <Option key={index} value={`${direction}`}>{direction}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="分辨率" htmlFor='resolution'>
          <Input id='resolution' placeholder="input placeholder" value={resolution} onChange={changeResolutionHandler} />
        </Form.Item>
      </Form>
    </>
  );
};

export default Template;