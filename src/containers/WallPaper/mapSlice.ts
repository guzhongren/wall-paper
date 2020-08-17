
import { createSlice } from '@reduxjs/toolkit'
import produce from "immer"

export const initialState = {
  instance: null,
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    createMap(state, action) {
      const { map } = action.payload
      return produce(state, draft => {
        draft.instance = map
      })
    },
  },
})

export const { createMap } = mapSlice.actions

export default mapSlice.reducer
