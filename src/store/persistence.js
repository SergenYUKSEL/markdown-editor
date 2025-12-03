// Middleware pour la persistance automatique dans localStorage
import { saveFiles, saveBlocks, saveImages } from "../utils/storage";
import { loadTree } from "./slices/filesSlice";
import { loadBlocks as loadBlocksAction } from "./slices/blocksSlice";
import { loadImages as loadImagesAction } from "./slices/imagesSlice";
import { loadFiles, loadBlocks, loadImages } from "../utils/storage";

// Charger les données depuis localStorage au démarrage
export const loadPersistedData = (dispatch) => {
  // Charger les fichiers
  const savedFiles = loadFiles();
  if (savedFiles) {
    dispatch(loadTree(savedFiles));
  }

  // Charger les blocs
  const savedBlocks = loadBlocks();
  if (savedBlocks && savedBlocks.length > 0) {
    dispatch(loadBlocksAction(savedBlocks));
  }

  // Charger les images
  const savedImages = loadImages();
  if (savedImages && savedImages.length > 0) {
    dispatch(loadImagesAction(savedImages));
  }
};

// Middleware Redux pour sauvegarder automatiquement
export const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  // Sauvegarder les fichiers
  if (action.type.startsWith("files/")) {
    saveFiles(state.files.tree);
  }

  // Sauvegarder les blocs
  if (action.type.startsWith("blocks/")) {
    saveBlocks(state.blocks.blocks);
  }

  // Sauvegarder les images
  if (action.type.startsWith("images/")) {
    saveImages(state.images.images);
  }

  return result;
};

