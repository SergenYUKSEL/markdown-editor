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

// Fonction utilitaire pour trouver un nœud dans l'arbre
function findNodeById(node, id) {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
}

// Fonction utilitaire pour trouver le parent d'un nœud
function findParent(node, targetId, parent = null) {
  if (node.id === targetId) return parent;
  if (node.children) {
    for (const child of node.children) {
      const found = findParent(child, targetId, node);
      if (found) return found;
    }
  }
  return null;
}

// Fonction utilitaire pour supprimer un nœud de l'arbre
function removeNodeFromTree(node, targetId) {
  if (node.children) {
    node.children = node.children.filter(child => child.id !== targetId);
    for (const child of node.children) {
      removeNodeFromTree(child, targetId);
    }
  }
}

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    // Charger l'arborescence depuis le storage
    loadTree: (state, action) => {
      if (action.payload) {
        state.tree = action.payload;
      }
    },
    
    // Créer un nouveau fichier ou dossier
    createItem: (state, action) => {
      const { type, name, parentId = "root" } = action.payload;
      const newItem = {
        id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        type,
        ...(type === "folder" ? { children: [] } : { content: "" }),
      };

      const parent = findNodeById(state.tree, parentId);
      if (parent && parent.type === "folder") {
        parent.children.push(newItem);
      }
    },

    // Renommer un fichier ou dossier
    renameItem: (state, action) => {
      const { id, newName } = action.payload;
      const node = findNodeById(state.tree, id);
      if (node) {
        node.name = newName;
      }
    },

    // Supprimer un fichier ou dossier
    deleteItem: (state, action) => {
      const { id } = action.payload;
      removeNodeFromTree(state.tree, id);
      
      // Si le fichier supprimé était ouvert, fermer l'éditeur
      if (state.currentFileId === id) {
        state.currentFileId = null;
        state.currentContent = "";
      }
    },

    // Déplacer un fichier ou dossier
    moveItem: (state, action) => {
      const { itemId, targetParentId } = action.payload;
      const item = findNodeById(state.tree, itemId);
      const oldParent = findParent(state.tree, itemId);
      const newParent = findNodeById(state.tree, targetParentId);

      if (item && oldParent && newParent && newParent.type === "folder") {
        // Retirer de l'ancien parent
        oldParent.children = oldParent.children.filter(child => child.id !== itemId);
        // Ajouter au nouveau parent
        newParent.children.push(item);
      }
    },

    // Ouvrir un fichier pour édition
    openFile: (state, action) => {
      const { id } = action.payload;
      const file = findNodeById(state.tree, id);
      if (file && file.type === "file") {
        state.currentFileId = id;
        state.currentContent = file.content || "";
      }
    },

    // Mettre à jour le contenu du fichier actuel
    updateFileContent: (state, action) => {
      const { content } = action.payload;
      state.currentContent = content;
      
      // Mettre à jour aussi dans l'arbre
      if (state.currentFileId) {
        const file = findNodeById(state.tree, state.currentFileId);
        if (file) {
          file.content = content;
        }
      }
    },

    // Fermer le fichier actuel
    closeFile: (state) => {
      state.currentFileId = null;
      state.currentContent = "";
    },

    // Sauvegarder le fichier actuel dans l'arbre
    saveCurrentFile: (state) => {
      if (state.currentFileId) {
        const file = findNodeById(state.tree, state.currentFileId);
        if (file) {
          file.content = state.currentContent;
        }
      }
    },
  },
});

export const {
  loadTree,
  createItem,
  renameItem,
  deleteItem,
  moveItem,
  openFile,
  updateFileContent,
  closeFile,
  saveCurrentFile,
} = filesSlice.actions;

export default filesSlice.reducer;
