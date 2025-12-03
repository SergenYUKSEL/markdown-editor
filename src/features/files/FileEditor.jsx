import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import MarkdownEditor from "../../components/MarkdownEditor";
import MarkdownPreview from "../../components/MarkdownPreview";
import Button from "../../components/Button";
import { updateFileContent, saveCurrentFile } from "../../store/slices/filesSlice";
import { exportMarkdownFile } from "../../utils/exportUtils";
import Modal from "../../components/Modal";

function FileEditor() {
  const dispatch = useDispatch();
  const currentFileId = useSelector((state) => state.files.currentFileId);
  const currentContent = useSelector((state) => state.files.currentContent);
  const tree = useSelector((state) => state.files.tree);
  const blocks = useSelector((state) => state.blocks.blocks);
  const images = useSelector((state) => state.images.images);
  const [viewMode, setViewMode] = useState("split"); // 'edit', 'preview', 'split'
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Trouver le fichier actuel
  const currentFile = currentFileId
    ? findFileById(tree, currentFileId)
    : null;

  function findFileById(node, id) {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findFileById(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  const handleContentChange = (e) => {
    dispatch(updateFileContent({ content: e.target.value }));
  };

  const handleSave = () => {
    dispatch(saveCurrentFile());
  };

  const handleExport = () => {
    if (!currentFile) {
      alert("Aucun fichier ouvert");
      return;
    }
    if (!currentContent) {
      alert("Le fichier est vide");
      return;
    }
    exportMarkdownFile(currentContent, currentFile.name);
  };

  const handleInsertBlock = () => {
    setShowBlockModal(true);
  };

  const handleInsertImage = () => {
    setShowImageModal(true);
  };

  const handleBlockSelect = (block) => {
    const placeholder = `{{block(${block.id})}}`;
    const textarea = document.querySelector("textarea");
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        currentContent.substring(0, start) +
        placeholder +
        currentContent.substring(end);
      dispatch(updateFileContent({ content: newContent }));
      setTimeout(() => {
        textarea.focus();
        const newPosition = start + placeholder.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
    setShowBlockModal(false);
  };

  const handleImageSelect = (image) => {
    const placeholder = `{{image(${image.id})}}`;
    const textarea = document.querySelector("textarea");
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        currentContent.substring(0, start) +
        placeholder +
        currentContent.substring(end);
      dispatch(updateFileContent({ content: newContent }));
      setTimeout(() => {
        textarea.focus();
        const newPosition = start + placeholder.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
    setShowImageModal(false);
  };

  if (!currentFile) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#666",
        }}
      >
        <p>Sélectionnez un fichier pour commencer l'édition</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Toolbar */}
      <div
        style={{
          padding: "0.5rem",
          borderBottom: "1px solid #ccc",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: "bold", marginRight: "1rem" }}>
          {currentFile.name}
        </span>
        <Button
          onClick={() => setViewMode("edit")}
          variant={viewMode === "edit" ? "primary" : "secondary"}
          size="small"
        >
          Édition
        </Button>
        <Button
          onClick={() => setViewMode("preview")}
          variant={viewMode === "preview" ? "primary" : "secondary"}
          size="small"
        >
          Aperçu
        </Button>
        <Button
          onClick={() => setViewMode("split")}
          variant={viewMode === "split" ? "primary" : "secondary"}
          size="small"
        >
          Split
        </Button>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          <Button onClick={handleSave} variant="secondary" size="small">
            💾 Sauvegarder
          </Button>
          <Button onClick={handleExport} variant="primary" size="small">
            📥 Exporter
          </Button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {(viewMode === "edit" || viewMode === "split") && (
          <div
            style={{
              width: viewMode === "split" ? "50%" : "100%",
              borderRight: viewMode === "split" ? "1px solid #ccc" : "none",
            }}
          >
            <MarkdownEditor
              value={currentContent}
              onChange={handleContentChange}
              onInsertBlock={handleInsertBlock}
              onInsertImage={handleInsertImage}
              blocks={blocks}
            />
          </div>
        )}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            style={{
              width: viewMode === "split" ? "50%" : "100%",
              overflow: "auto",
            }}
          >
            <MarkdownPreview
              content={currentContent}
              blocks={blocks}
              images={images}
            />
          </div>
        )}
      </div>

      {/* Modal de sélection de bloc */}
      <Modal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title="Insérer un bloc"
      >
        <div style={{ maxHeight: "400px", overflow: "auto" }}>
          {blocks.length === 0 ? (
            <p>Aucun bloc disponible</p>
          ) : (
            blocks.map((block) => (
              <div
                key={block.id}
                onClick={() => handleBlockSelect(block)}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <strong>{block.name}</strong>
                {block.shortcut && (
                  <span style={{ marginLeft: "0.5rem", color: "#666" }}>
                    ({block.shortcut})
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Modal de sélection d'image */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Insérer une image"
      >
        <div style={{ maxHeight: "400px", overflow: "auto" }}>
          {images.length === 0 ? (
            <p>Aucune image disponible</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "0.5rem",
              }}
            >
              {images.map((image) => (
                <div
                  key={image.id}
                  onClick={() => handleImageSelect(image)}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "0.25rem",
                    padding: "0.5rem",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  {image.data && (
                    <img
                      src={image.data}
                      alt={image.name}
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "contain",
                        marginBottom: "0.5rem",
                      }}
                    />
                  )}
                  <div style={{ fontSize: "0.875rem" }}>{image.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default FileEditor;

