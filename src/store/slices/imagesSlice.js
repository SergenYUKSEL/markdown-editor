import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  images: [],
};

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
});

export const {} = imagesSlice.actions;
export default imagesSlice.reducer;
