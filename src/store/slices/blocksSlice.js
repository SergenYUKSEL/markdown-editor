import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blocks: [],
};

const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    loadBlocks: (state, action) => {
      if (action.payload) {
        state.blocks = action.payload;
      }
    },

    addBlock: (state, action) => {
      const { name, content, shortcut, type = "markdown" } = action.payload;
      
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

    updateBlock: (state, action) => {
      const { id, name, content, shortcut, type } = action.payload;
      const block = state.blocks.find(b => b.id === id);
      
      if (block) {
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

    deleteBlock: (state, action) => {
      const { id } = action.payload;
      state.blocks = state.blocks.filter(block => block.id !== id);
    },

    importBlocks: (state, action) => {
      const newBlocks = action.payload;
      newBlocks.forEach(newBlock => {
        if (state.blocks.some(b => b.id === newBlock.id)) {
          newBlock.id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        if (newBlock.shortcut) {
          const shortcutExists = state.blocks.some(
            b => b.shortcut === newBlock.shortcut
          );
          if (shortcutExists) {
            newBlock.shortcut = null;
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
