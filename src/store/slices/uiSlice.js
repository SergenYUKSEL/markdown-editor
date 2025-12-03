import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: true,
  theme: "light",
  activeView: "files",
  strangerThingsMusicPlaying: false,
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
      // Réinitialiser la musique si on change de thème
      if (action.payload !== "strangerThings") {
        state.strangerThingsMusicPlaying = false;
      }
    },
    setStrangerThingsMusic: (state, action) => {
      state.strangerThingsMusicPlaying = action.payload;
    },
  },
});

export const { toggleSidebar, setActiveView, setTheme, setStrangerThingsMusic } = uiSlice.actions;
export default uiSlice.reducer;
