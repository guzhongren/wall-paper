import { createSlice } from '@reduxjs/toolkit'


const {innerHeight, innerWidth} = window
const initModel = {
  name: 'PC',
  width: innerWidth,
  height: innerHeight,
}

export const initialState = {
  currentMod: 'template',
  width: initModel.width,
  height: initModel.height,
  resolution: window.devicePixelRatio,
  currentDirection: 'vertical',
  directions: [
    "vertical",
    'horizon'
  ],
  currentModel: initModel.name,
  models: [
    initModel,
    {
      name: 'iPhone 11',
      width: 71.4,
      height: 144.0,
    },
    {
      name: 'iPhone 11 Pro Max',
      width: 77.8,
      height: 158.0
    }
  ]
}

const exporterSlice = createSlice({
  name: 'exporter',
  initialState,
  reducers: {
    changeWidth(state, action) {
      const { width } = action.payload;
      state.width = width
    },
    changeHeight(state, action) {
      const { height } = action.payload;
      state.height = height
    },
    changeResolution(state, action) {
      const { resolution } = action.payload;
      state.resolution = resolution
    },
    changeCurrentModel(state, action) {
      const { currentModel } = action.payload;
      state.currentModel = currentModel
      const model = state.models.find(model => model.name === currentModel)
      if (model) {
        if (state.currentDirection === 'vertical') {
          state.height = model.height
          state.width = model.width
        } else {
          state.height = model.width
          state.width = model.height
        }
      }
    },
    changeCurrentDirection(state, action) {
      const { currentDirection } = action.payload;
      state.currentDirection = currentDirection
      const tempHeight = state.height
      const tempWidth = state.width
      state.width = tempHeight
      state.height = tempWidth
    },
  },
})

export interface IRootState {
  exporter: typeof initialState,
}
export const { changeHeight, changeWidth, changeResolution, changeCurrentModel, changeCurrentDirection } = exporterSlice.actions

export default exporterSlice.reducer
