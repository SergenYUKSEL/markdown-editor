import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { deleteBlock } from "../../store/slices/blocksSlice";
import { exportBlock, exportBlocks } from "../../utils/exportUtils";
import MarkdownPreview from "../../components/MarkdownPreview";

function BlockList({ onEdit }) {
  const dispatch = useDispatch();
  const blocks = useSelector((state) => state.blocks.blocks);
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
        <Button onClick={handleExportAll} variant="secondary" size="small">
          📥 Exporter tous les blocs
        </Button>
      </div>

      {blocks.length === 0 ? (
        <p style={{ color: "#666", textAlign: "center", padding: "2rem" }}>
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
                border: "1px solid #ccc",
                borderRadius: "0.5rem",
                padding: "1rem",
                backgroundColor: "#fff",
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
                <h3 style={{ margin: 0, fontSize: "1.125rem" }}>
                  {block.name}
                </h3>
                {block.shortcut && (
                  <span
                    style={{
                      backgroundColor: "#e3f2fd",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    {block.shortcut}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#666",
                  marginBottom: "0.5rem",
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
                  backgroundColor: "#f8f9fa",
                  borderRadius: "0.25rem",
                  fontSize: "0.875rem",
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
                >
                  👁️ Prévisualiser
                </Button>
                {onEdit && (
                  <Button
                    onClick={() => onEdit(block)}
                    variant="secondary"
                    size="small"
                  >
                    ✏️ Modifier
                  </Button>
                )}
                <Button
                  onClick={() => handleExport(block)}
                  variant="secondary"
                  size="small"
                >
                  📥 Exporter
                </Button>
                <Button
                  onClick={() => handleDelete(block.id)}
                  variant="danger"
                  size="small"
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

