import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: true,
  theme: "light",
  activeView: "files",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, setActiveView, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
