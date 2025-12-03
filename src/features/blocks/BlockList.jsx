import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { deleteBlock } from "../../store/slices/blocksSlice";
import { exportBlock, exportBlocks } from "../../utils/exportUtils";
import MarkdownPreview from "../../components/MarkdownPreview";
import "../../styles/strangerThings.css";

function BlockList({ onEdit }) {
  const dispatch = useDispatch();
  const blocks = useSelector((state) => state.blocks.blocks);
  const theme = useSelector((state) => state.ui.theme);
  const isStrangerThings = theme === "strangerThings";
  const [previewBlock, setPreviewBlock] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bloc ?")) {
      dispatch(deleteBlock({ id }));
    }
  };

  const handleExport = (block) => {
    exportBlock(block);
  };

  const handleExportAll = () => {
    exportBlocks(blocks);
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <Button 
          onClick={handleExportAll} 
          variant="secondary" 
          size="small"
          className={isStrangerThings ? "stranger-things-button" : ""}
        >
          📥 Exporter tous les blocs
        </Button>
      </div>

      {blocks.length === 0 ? (
        <p 
          style={{ 
            color: isStrangerThings ? "#e50914" : "#666", 
            textAlign: "center", 
            padding: "2rem",
            textShadow: isStrangerThings ? "0 0 5px #e50914" : "none"
          }}
        >
          Aucun bloc créé. Créez votre premier bloc pour commencer.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {blocks.map((block) => (
            <div
              key={block.id}
              style={{
                border: isStrangerThings ? "2px solid #e50914" : "1px solid #ccc",
                borderRadius: "0.5rem",
                padding: "1rem",
                backgroundColor: isStrangerThings ? "#1a0000" : "#fff",
                color: isStrangerThings ? "#e50914" : "inherit",
                boxShadow: isStrangerThings ? "0 0 10px rgba(229, 9, 20, 0.3)" : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <h3 
                  style={{ 
                    margin: 0, 
                    fontSize: "1.125rem",
                    color: isStrangerThings ? "#00d4ff" : "inherit",
                    textShadow: isStrangerThings ? "0 0 5px #00d4ff" : "none"
                  }}
                >
                  {block.name}
                </h3>
                {block.shortcut && (
                  <span
                    style={{
                      backgroundColor: isStrangerThings ? "#0a0a0a" : "#e3f2fd",
                      color: isStrangerThings ? "#e50914" : "inherit",
                      border: isStrangerThings ? "1px solid #e50914" : "none",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.875rem",
                      textShadow: isStrangerThings ? "0 0 5px #e50914" : "none"
                    }}
                  >
                    {block.shortcut}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: isStrangerThings ? "#00d4ff" : "#666",
                  marginBottom: "0.5rem",
                  textShadow: isStrangerThings ? "0 0 3px #00d4ff" : "none"
                }}
              >
                Type: {block.type}
              </div>
              <div
                style={{
                  maxHeight: "150px",
                  overflow: "auto",
                  marginBottom: "0.5rem",
                  padding: "0.5rem",
                  backgroundColor: isStrangerThings ? "#0a0a0a" : "#f8f9fa",
                  borderRadius: "0.25rem",
                  fontSize: "0.875rem",
                  color: isStrangerThings ? "#e50914" : "inherit",
                  border: isStrangerThings ? "1px solid #e50914" : "none",
                }}
              >
                {block.content.substring(0, 200)}
                {block.content.length > 200 && "..."}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  onClick={() => setPreviewBlock(block)}
                  variant="secondary"
                  size="small"
                  className={isStrangerThings ? "stranger-things-button" : ""}
                >
                  👁️ Prévisualiser
                </Button>
                {onEdit && (
                  <Button
                    onClick={() => onEdit(block)}
                    variant="secondary"
                    size="small"
                    className={isStrangerThings ? "stranger-things-button" : ""}
                  >
                    ✏️ Modifier
                  </Button>
                )}
                <Button
                  onClick={() => handleExport(block)}
                  variant="secondary"
                  size="small"
                  className={isStrangerThings ? "stranger-things-button" : ""}
                >
                  📥 Exporter
                </Button>
                <Button
                  onClick={() => handleDelete(block.id)}
                  variant="danger"
                  size="small"
                  className={isStrangerThings ? "stranger-things-button" : ""}
                >
                  🗑️ Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de prévisualisation */}
      <Modal
        isOpen={previewBlock !== null}
        onClose={() => setPreviewBlock(null)}
        title={previewBlock ? `Prévisualisation: ${previewBlock.name}` : ""}
        size="large"
      >
        {previewBlock && (
          <MarkdownPreview
            content={previewBlock.content}
            blocks={[]}
            images={[]}
          />
        )}
      </Modal>
    </div>
  );
}

export default BlockList;

