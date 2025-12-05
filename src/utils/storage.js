function saveFiles(tree) {
  localStorage.setItem("files", JSON.stringify(tree));
}

function loadFiles() {
  try {
    const data = localStorage.getItem("files");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Erreur lors du chargement des fichiers:", error);
    return null;
  }
}

function saveBlocks(blocks) {
  localStorage.setItem("blocks", JSON.stringify(blocks));
}

function loadBlocks() {
  try {
    const data = localStorage.getItem("blocks");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erreur lors du chargement des blocs:", error);
    return [];
  }
}

function saveImages(images) {
  localStorage.setItem("images", JSON.stringify(images));
}

function loadImages() {
  try {
    const data = localStorage.getItem("images");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erreur lors du chargement des images:", error);
    return [];
  }
}

function clearAll() {
  localStorage.removeItem("files");
  localStorage.removeItem("blocks");
  localStorage.removeItem("images");
}

export {
  saveFiles,
  loadFiles,
  saveBlocks,
  loadBlocks,
  saveImages,
  loadImages,
  clearAll,
};
