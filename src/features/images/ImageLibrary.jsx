import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { deleteImage, renameImage } from "../../store/slices/imagesSlice";
import "../../styles/strangerThings.css";

function ImageLibrary() {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.images);
  const theme = useSelector((state) => state.ui.theme);
  const isStrangerThings = theme === "strangerThings";
  const [selectedImage, setSelectedImage] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newName, setNewName] = useState("");

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      dispatch(deleteImage({ id }));
    }
  };

  const handleRename = (image) => {
    setSelectedImage(image);
    setNewName(image.name);
    setShowRenameModal(true);
  };

  const handleRenameSubmit = () => {
    if (newName.trim() && selectedImage) {
      dispatch(renameImage({ id: selectedImage.id, newName: newName.trim() }));
      setShowRenameModal(false);
      setSelectedImage(null);
      setNewName("");
    }
  };

  const handleCopyBase64 = (image) => {
    if (image.data) {
      navigator.clipboard.writeText(image.data);
      alert("Code base64 copié dans le presse-papiers !");
    }
  };

  if (images.length === 0) {
    return (
      <p 
        style={{ 
          color: isStrangerThings ? "#e50914" : "#666", 
          textAlign: "center", 
          padding: "2rem",
          textShadow: isStrangerThings ? "0 0 5px #e50914" : "none"
        }}
      >
        Aucune image. Ajoutez votre première image pour commencer.
      </p>
    );
  }

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "1rem",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        {images.map((image) => (
          <div
            key={image.id}
            style={{
              border: isStrangerThings ? "2px solid #e50914" : "1px solid #ccc",
              borderRadius: "0.5rem",
              padding: "0.5rem",
              backgroundColor: isStrangerThings ? "#1a0000" : "#fff",
              boxShadow: isStrangerThings ? "0 0 10px rgba(229, 9, 20, 0.3)" : "none",
            }}
          >
            {image.data && (
              <img
                src={image.data}
                alt={image.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "contain",
                  marginBottom: "0.5rem",
                  backgroundColor: isStrangerThings ? "#0a0a0a" : "#f8f9fa",
                  border: isStrangerThings ? "1px solid #e50914" : "none",
                }}
              />
            )}
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                wordBreak: "break-word",
                color: isStrangerThings ? "#e50914" : "inherit",
                textShadow: isStrangerThings ? "0 0 5px #e50914" : "none"
              }}
            >
              {image.name}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
              <Button
                onClick={() => handleRename(image)}
                variant="secondary"
                size="small"
                className={isStrangerThings ? "stranger-things-button" : ""}
              >
                ✏️
              </Button>
              {image.data && (
                <Button
                  onClick={() => handleCopyBase64(image)}
                  variant="secondary"
                  size="small"
                  className={isStrangerThings ? "stranger-things-button" : ""}
                >
                  📋
                </Button>
              )}
              <Button
                onClick={() => handleDelete(image.id)}
                variant="danger"
                size="small"
                className={isStrangerThings ? "stranger-things-button" : ""}
              >
                🗑️
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de renommage */}
      <Modal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        title="Renommer l'image"
      >
        <div>
          <label 
            style={{ 
              display: "block", 
              marginBottom: "0.5rem",
              color: isStrangerThings ? "#e50914" : "inherit"
            }}
          >
            Nouveau nom :
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleRenameSubmit();
            }}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: isStrangerThings ? "2px solid #e50914" : "1px solid #ccc",
              borderRadius: "0.25rem",
              backgroundColor: isStrangerThings ? "#0a0a0a" : "white",
              color: isStrangerThings ? "#e50914" : "inherit",
            }}
            autoFocus
          />
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <Button 
              onClick={handleRenameSubmit} 
              variant="primary"
              className={isStrangerThings ? "stranger-things-button" : ""}
            >
              Renommer
            </Button>
            <Button
              onClick={() => setShowRenameModal(false)}
              variant="secondary"
              className={isStrangerThings ? "stranger-things-button" : ""}
            >
              Annuler
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ImageLibrary;

