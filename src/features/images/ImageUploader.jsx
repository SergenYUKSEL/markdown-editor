import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { addImage } from "../../store/slices/imagesSlice";
import "../../styles/strangerThings.css";

function ImageUploader({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const isStrangerThings = theme === "strangerThings";
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageData, setImageData] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Le fichier doit être une image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image est trop grande (max 5MB)");
      return;
    }

    setError("");
    setImageName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setImageData(base64);
      setPreview(base64);
    };
    reader.onerror = () => {
      setError("Erreur lors de la lecture du fichier");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!imageData) {
      setError("Veuillez sélectionner une image");
      return;
    }

    if (!imageName.trim()) {
      setError("Veuillez entrer un nom pour l'image");
      return;
    }

    dispatch(
      addImage({
        name: imageName.trim(),
        data: imageData,
      })
    );

    setPreview(null);
    setImageData(null);
    setImageName("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setPreview(null);
    setImageData(null);
    setImageName("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ajouter une image">
      <div>
        {error && (
          <div
            style={{
              padding: "0.75rem",
              backgroundColor: isStrangerThings ? "#1a0000" : "#fee",
              color: isStrangerThings ? "#e50914" : "#c33",
              border: isStrangerThings ? "1px solid #e50914" : "none",
              borderRadius: "0.25rem",
              marginBottom: "1rem",
              textShadow: isStrangerThings ? "0 0 5px #e50914" : "none"
            }}
          >
            {error}
          </div>
        )}

        {!preview ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${
                dragActive 
                  ? (isStrangerThings ? "#00d4ff" : "#007bff")
                  : (isStrangerThings ? "#e50914" : "#ccc")
              }`,
              borderRadius: "0.5rem",
              padding: "2rem",
              textAlign: "center",
              backgroundColor: dragActive 
                ? (isStrangerThings ? "#1a0000" : "#f0f8ff")
                : (isStrangerThings ? "#0a0a0a" : "#fafafa"),
              marginBottom: "1rem",
              color: isStrangerThings ? "#e50914" : "inherit",
              boxShadow: isStrangerThings && dragActive ? "0 0 15px #00d4ff" : "none"
            }}
          >
            <p style={{ color: isStrangerThings ? "#e50914" : "inherit" }}>
              Glissez-déposez une image ici
            </p>
            <p 
              style={{ 
                color: isStrangerThings ? "#00d4ff" : "#666", 
                fontSize: "0.875rem" 
              }}
            >
              ou
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: "none" }}
              id="image-upload-input"
            />
            <Button 
              variant="primary" 
              size="small"
              className={isStrangerThings ? "stranger-things-button" : ""}
              onClick={() => {
                document.getElementById("image-upload-input")?.click();
              }}
            >
              Sélectionner un fichier
            </Button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label 
                style={{ 
                  display: "block", 
                  marginBottom: "0.5rem",
                  color: isStrangerThings ? "#e50914" : "inherit"
                }}
              >
                Nom de l'image *
              </label>
              <input
                type="text"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: isStrangerThings ? "2px solid #e50914" : "1px solid #ccc",
                  borderRadius: "0.25rem",
                  backgroundColor: isStrangerThings ? "#0a0a0a" : "white",
                  color: isStrangerThings ? "#e50914" : "inherit",
                }}
                placeholder="Nom de l'image"
                autoFocus
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                onClick={() => {
                  setPreview(null);
                  setImageData(null);
                  setImageName("");
                }}
                variant="secondary"
                className={isStrangerThings ? "stranger-things-button" : ""}
              >
                Changer d'image
              </Button>
              <Button 
                onClick={handleSubmit} 
                variant="primary"
                className={isStrangerThings ? "stranger-things-button" : ""}
              >
                Ajouter
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ImageUploader;

