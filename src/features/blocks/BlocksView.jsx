import { useState } from "react";
import { useSelector } from "react-redux";
import BlockList from "./BlockList";
import BlockEditor from "./BlockEditor";
import Button from "../../components/Button";
import { importBlock, importBlocks } from "../../utils/importUtils";
import { useDispatch } from "react-redux";
import { importBlocks as importBlocksAction } from "../../store/slices/blocksSlice";
import "../../styles/strangerThings.css";

function BlocksView() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const isStrangerThings = theme === "strangerThings";
  const [showEditor, setShowEditor] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);

  const handleCreate = () => {
    setEditingBlock(null);
    setShowEditor(true);
  };

  const handleEdit = (block) => {
    setEditingBlock(block);
    setShowEditor(true);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (file.name.endsWith(".part.mdlc")) {
        const block = await importBlock(file);
        dispatch(importBlocksAction([block]));
      } else if (file.name.endsWith(".parts.mdlc")) {
        const blocks = await importBlocks(file);
        dispatch(importBlocksAction(blocks));
      } else {
        alert("Format de fichier non supporté");
      }
    } catch (error) {
      alert("Erreur lors de l'import: " + error.message);
    }

    e.target.value = "";
  };

  return (
    <div 
      style={{ 
        padding: "2rem",
        backgroundColor: isStrangerThings ? "#0a0a0a" : "transparent",
        minHeight: "100%",
        height: "100%",
        overflow: "auto",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <h1 
          style={{ 
            margin: 0,
            color: isStrangerThings ? "#e50914" : "inherit",
            textShadow: isStrangerThings ? "0 0 10px #e50914" : "none",
            flex: "1 1 auto",
            minWidth: "200px"
          }}
        >
          Bibliothèque de blocs
        </h1>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="file"
            accept=".part.mdlc,.parts.mdlc"
            onChange={handleImport}
            style={{ display: "none" }}
            id="import-blocks-input"
          />
          <Button 
            variant="secondary" 
            size="small"
            className={isStrangerThings ? "stranger-things-button" : ""}
            onClick={() => {
              document.getElementById("import-blocks-input")?.click();
            }}
          >
            📥 Importer
          </Button>
          <Button 
            onClick={handleCreate} 
            variant="primary" 
            size="small"
            className={isStrangerThings ? "stranger-things-button" : ""}
          >
            + Nouveau bloc
          </Button>
        </div>
      </div>

      <BlockList onEdit={handleEdit} />

      <BlockEditor
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingBlock(null);
        }}
        block={editingBlock}
      />
    </div>
  );
}

export default BlocksView;