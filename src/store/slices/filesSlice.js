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
    loadTree: (state, action) => {
      if (action.payload) {
        state.tree = action.payload;
      }
    },
    
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

    renameItem: (state, action) => {
      const { id, newName } = action.payload;
      const node = findNodeById(state.tree, id);
      if (node) {
        node.name = newName;
      }
    },

    deleteItem: (state, action) => {
      const { id } = action.payload;
      removeNodeFromTree(state.tree, id);
      
      if (state.currentFileId === id) {
        state.currentFileId = null;
        state.currentContent = "";
      }
    },

    moveItem: (state, action) => {
      const { itemId, targetParentId } = action.payload;
      const item = findNodeById(state.tree, itemId);
      const oldParent = findParent(state.tree, itemId);
      const newParent = findNodeById(state.tree, targetParentId);

      if (item && oldParent && newParent && newParent.type === "folder") {
        oldParent.children = oldParent.children.filter(child => child.id !== itemId);
        newParent.children.push(item);
      }
    },

    openFile: (state, action) => {
      const { id } = action.payload;
      const file = findNodeById(state.tree, id);
      if (file && file.type === "file") {
        state.currentFileId = id;
        state.currentContent = file.content || "";
      }
    },

    updateFileContent: (state, action) => {
      const { content } = action.payload;
      state.currentContent = content;
      
      if (state.currentFileId) {
        const file = findNodeById(state.tree, state.currentFileId);
        if (file) {
          file.content = content;
        }
      }
    },

    closeFile: (state) => {
      state.currentFileId = null;
      state.currentContent = "";
    },

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
