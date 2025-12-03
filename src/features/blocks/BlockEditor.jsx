import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { addBlock, updateBlock } from "../../store/slices/blocksSlice";

function BlockEditor({ isOpen, onClose, block = null }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [shortcut, setShortcut] = useState("");
  const [type, setType] = useState("markdown");
  const [error, setError] = useState("");

  // Initialiser les champs si on édite un bloc existant
  useEffect(() => {
    if (block) {
      setName(block.name || "");
      setContent(block.content || "");
      setShortcut(block.shortcut || "");
      setType(block.type || "markdown");
    } else {
      // Réinitialiser pour un nouveau bloc
      setName("");
      setContent("");
      setShortcut("");
      setType("markdown");
    }
    setError("");
  }, [block, isOpen]);

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      setError("Le nom est requis");
      return;
    }
    if (!content.trim()) {
      setError("Le contenu est requis");
      return;
    }

    try {
      if (block) {
        // Mise à jour
        dispatch(
          updateBlock({
            id: block.id,
            name: name.trim(),
            content: content.trim(),
            shortcut: shortcut.trim() || null,
            type,
          })
        );
      } else {
        // Création
        dispatch(
          addBlock({
            name: name.trim(),
            content: content.trim(),
            shortcut: shortcut.trim() || null,
            type,
          })
        );
      }
      onClose();
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={block ? "Modifier le bloc" : "Créer un nouveau bloc"}
      size="large"
    >
      <div>
        {error && (
          <div
            style={{
              padding: "0.75rem",
              backgroundColor: "#fee",
              color: "#c33",
              borderRadius: "0.25rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Nom du bloc *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
            }}
            placeholder="Ex: En-tête de section"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Type de contenu
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
            }}
          >
            <option value="markdown">Markdown</option>
            <option value="html">HTML</option>
            <option value="mixed">Mixte (Markdown + HTML)</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Raccourci clavier (optionnel)
          </label>
          <input
            type="text"
            value={shortcut}
            onChange={(e) => setShortcut(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
            }}
            placeholder="Ex: Ctrl+Shift+B"
          />
          <small style={{ color: "#666" }}>
            Le raccourci sera utilisé pour insérer ce bloc dans l'éditeur
          </small>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Contenu *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: "100%",
              minHeight: "200px",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
              fontFamily: "monospace",
            }}
            placeholder="Entrez le contenu du bloc (Markdown ou HTML)"
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <Button onClick={onClose} variant="secondary">
            Annuler
          </Button>
          <Button onClick={handleSubmit} variant="primary">
            {block ? "Modifier" : "Créer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default BlockEditor;

