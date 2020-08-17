import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import logger from 'redux-logger'
import exporterReducer from './components/Exporter/exporterSlice'
import mapSlice from './containers/WallPaper/mapSlice'



const middleware = [...getDefaultMiddleware(), logger]

 const store = configureStore({
   reducer: {
     exporter: exporterReducer,
     map: mapSlice
   },
   middleware,
});

export default store;