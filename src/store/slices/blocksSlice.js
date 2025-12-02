import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blocks: [],
};

const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {},
});

export const {} = blocksSlice.actions;
export default blocksSlice.reducer;
