import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "./slices/filesSlice";
import blocksReducer from "./slices/blocksSlice";
import imagesReducer from "./slices/imagesSlice";
import uiReducer from "./slices/uiSlice";
import { persistenceMiddleware } from "./persistence";

export const store = configureStore({
  reducer: {
    files: filesReducer,
    blocks: blocksReducer,
    images: imagesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware),
});
