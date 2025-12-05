import { saveFiles, saveBlocks, saveImages } from "../utils/storage";
import { loadTree } from "./slices/filesSlice";
import { loadBlocks as loadBlocksAction } from "./slices/blocksSlice";
import { loadImages as loadImagesAction } from "./slices/imagesSlice";
import { loadFiles, loadBlocks, loadImages } from "../utils/storage";

export const loadPersistedData = (dispatch) => {
  const savedFiles = loadFiles();
  if (savedFiles) {
    dispatch(loadTree(savedFiles));
  }

  const savedBlocks = loadBlocks();
  if (savedBlocks && savedBlocks.length > 0) {
    dispatch(loadBlocksAction(savedBlocks));
  }

  const savedImages = loadImages();
  if (savedImages && savedImages.length > 0) {
    dispatch(loadImagesAction(savedImages));
  }
};

export const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  if (action.type.startsWith("files/")) {
    saveFiles(state.files.tree);
  }

  if (action.type.startsWith("blocks/")) {
    saveBlocks(state.blocks.blocks);
  }

  if (action.type.startsWith("images/")) {
    saveImages(state.images.images);
  }

  return result;
};

