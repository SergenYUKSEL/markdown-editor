import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tree: {
    id: "root",
    name: "root",
    type: "folder",
    children: [],
  },
  currentFileId: null,
  currentContent: "",
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    //  setCurrentFileId: (state, action) => {
    //      state.currentFileId = action.payload;
    //  },
  },
});

export const {} = filesSlice.actions;
export default filesSlice.reducer;
