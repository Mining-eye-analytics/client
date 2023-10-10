import { configureStore } from '@reduxjs/toolkit'
import generalSlice from './generalSlice'
import cctvSlice from './cctvSlice'
import notificationSlice from './notificationSlice'
import objectSlice from './objectSlice'
import validationStatusSlice from './validationStatusSlice'
import deviationSlice from './deviationSlice'

export default configureStore({
  reducer: {
    general: generalSlice,
    cctv: cctvSlice,
    notification: notificationSlice,
    object: objectSlice,
    validationStatus: validationStatusSlice,
    deviation: deviationSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})