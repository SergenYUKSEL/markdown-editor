import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  images: [],
};

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    loadImages: (state, action) => {
      if (action.payload) {
        state.images = action.payload;
      }
    },

    addImage: (state, action) => {
      const { name, data, url } = action.payload;
      
      const newImage = {
        id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name || `image-${Date.now()}`,
        data: data || null,
        url: url || null,
        createdAt: new Date().toISOString(),
      };

      state.images.push(newImage);
    },

    renameImage: (state, action) => {
      const { id, newName } = action.payload;
      const image = state.images.find(img => img.id === id);
      if (image) {
        image.name = newName;
      }
    },

    deleteImage: (state, action) => {
      const { id } = action.payload;
      state.images = state.images.filter(img => img.id !== id);
    },

    clearImages: (state) => {
      state.images = [];
    },

    importImages: (state, action) => {
      const newImages = action.payload;
      newImages.forEach(newImage => {
        if (state.images.some(img => img.id === newImage.id)) {
          newImage.id = `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        state.images.push(newImage);
      });
    },
  },
});

export const {
  loadImages,
  addImage,
  renameImage,
  deleteImage,
  clearImages,
  importImages,
} = imagesSlice.actions;

export default imagesSlice.reducer;
