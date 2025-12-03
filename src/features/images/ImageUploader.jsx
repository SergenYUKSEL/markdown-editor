import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { addImage } from "../../store/slices/imagesSlice";

function ImageUploader({ isOpen, onClose }) {
  const dispatch = useDispatch();
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
    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      setError("Le fichier doit être une image");
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image est trop grande (max 5MB)");
      return;
    }

    setError("");
    setImageName(file.name);

    // Lire le fichier en base64
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

    // Réinitialiser
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
              backgroundColor: "#fee",
              color: "#c33",
              borderRadius: "0.25rem",
              marginBottom: "1rem",
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
              border: `2px dashed ${dragActive ? "#007bff" : "#ccc"}`,
              borderRadius: "0.5rem",
              padding: "2rem",
              textAlign: "center",
              backgroundColor: dragActive ? "#f0f8ff" : "#fafafa",
              marginBottom: "1rem",
            }}
          >
            <p>Glissez-déposez une image ici</p>
            <p style={{ color: "#666", fontSize: "0.875rem" }}>ou</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: "none" }}
              id="image-upload-input"
            />
            <label htmlFor="image-upload-input">
              <Button variant="primary" size="small" as="span">
                Sélectionner un fichier
              </Button>
            </label>
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
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Nom de l'image *
              </label>
              <input
                type="text"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
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
              >
                Changer d'image
              </Button>
              <Button onClick={handleSubmit} variant="primary">
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

