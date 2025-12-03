import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blocks: [],
};

const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    // Charger les blocs depuis le storage
    loadBlocks: (state, action) => {
      if (action.payload) {
        state.blocks = action.payload;
      }
    },

    // Ajouter un nouveau bloc
    addBlock: (state, action) => {
      const { name, content, shortcut, type = "markdown" } = action.payload;
      
      // Vérifier que le raccourci n'est pas déjà utilisé
      const shortcutExists = state.blocks.some(
        block => block.shortcut === shortcut && shortcut
      );
      
      if (shortcutExists) {
        throw new Error("Ce raccourci est déjà utilisé");
      }

      const newBlock = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        content,
        shortcut: shortcut || null,
        type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.blocks.push(newBlock);
    },

    // Modifier un bloc existant
    updateBlock: (state, action) => {
      const { id, name, content, shortcut, type } = action.payload;
      const block = state.blocks.find(b => b.id === id);
      
      if (block) {
        // Vérifier que le nouveau raccourci n'est pas utilisé par un autre bloc
        if (shortcut && shortcut !== block.shortcut) {
          const shortcutExists = state.blocks.some(
            b => b.id !== id && b.shortcut === shortcut
          );
          if (shortcutExists) {
            throw new Error("Ce raccourci est déjà utilisé");
          }
        }

        if (name !== undefined) block.name = name;
        if (content !== undefined) block.content = content;
        if (shortcut !== undefined) block.shortcut = shortcut;
        if (type !== undefined) block.type = type;
        block.updatedAt = new Date().toISOString();
      }
    },

    // Supprimer un bloc
    deleteBlock: (state, action) => {
      const { id } = action.payload;
      state.blocks = state.blocks.filter(block => block.id !== id);
    },

    // Importer des blocs (ajouter à la collection existante)
    importBlocks: (state, action) => {
      const newBlocks = action.payload;
      newBlocks.forEach(newBlock => {
        // Générer un nouvel ID si nécessaire pour éviter les conflits
        if (state.blocks.some(b => b.id === newBlock.id)) {
          newBlock.id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        // Vérifier les raccourcis en double
        if (newBlock.shortcut) {
          const shortcutExists = state.blocks.some(
            b => b.shortcut === newBlock.shortcut
          );
          if (shortcutExists) {
            newBlock.shortcut = null; // Retirer le raccourci en double
          }
        }
        state.blocks.push(newBlock);
      });
    },
  },
});

export const {
  loadBlocks,
  addBlock,
  updateBlock,
  deleteBlock,
  importBlocks,
} = blocksSlice.actions;

export default blocksSlice.reducer;
