import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  images: [],
};

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    // Charger les images depuis le storage
    loadImages: (state, action) => {
      if (action.payload) {
        state.images = action.payload;
      }
    },

    // Ajouter une nouvelle image
    addImage: (state, action) => {
      const { name, data, url } = action.payload;
      
      const newImage = {
        id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name || `image-${Date.now()}`,
        data: data || null, // base64
        url: url || null, // URL externe
        createdAt: new Date().toISOString(),
      };

      state.images.push(newImage);
    },

    // Renommer une image
    renameImage: (state, action) => {
      const { id, newName } = action.payload;
      const image = state.images.find(img => img.id === id);
      if (image) {
        image.name = newName;
      }
    },

    // Supprimer une image
    deleteImage: (state, action) => {
      const { id } = action.payload;
      state.images = state.images.filter(img => img.id !== id);
    },

    // Supprimer toutes les images
    clearImages: (state) => {
      state.images = [];
    },

    // Importer des images (ajouter à la collection existante)
    importImages: (state, action) => {
      const newImages = action.payload;
      newImages.forEach(newImage => {
        // Générer un nouvel ID si nécessaire pour éviter les conflits
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
