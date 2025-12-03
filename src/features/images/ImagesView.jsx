import { useState } from "react";
import ImageLibrary from "./ImageLibrary";
import ImageUploader from "./ImageUploader";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearImages, importImages } from "../../store/slices/imagesSlice";

function ImagesView() {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.images);
  const [showUploader, setShowUploader] = useState(false);

  const handleClearAll = () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer toutes les images ?"
      )
    ) {
      dispatch(clearImages());
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (Array.isArray(data)) {
        dispatch(importImages(data));
      } else {
        alert("Format de fichier invalide");
      }
    } catch (error) {
      alert("Erreur lors de l'import: " + error.message);
    }

    // Réinitialiser l'input
    e.target.value = "";
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ margin: 0 }}>Bibliothèque d'images</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: "none" }}
            id="import-images-input"
          />
          <label htmlFor="import-images-input">
            <Button variant="secondary" size="small" as="span">
              📥 Importer
            </Button>
          </label>
          {images.length > 0 && (
            <Button onClick={handleClearAll} variant="danger" size="small">
              🗑️ Tout supprimer
            </Button>
          )}
          <Button
            onClick={() => setShowUploader(true)}
            variant="primary"
            size="small"
          >
            + Ajouter une image
          </Button>
        </div>
      </div>

      <ImageLibrary />
      <ImageUploader
        isOpen={showUploader}
        onClose={() => setShowUploader(false)}
      />
    </div>
  );
}

export default ImagesView;