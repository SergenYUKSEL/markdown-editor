import { useState } from "react";
import { useSelector } from "react-redux";
import ImageLibrary from "./ImageLibrary";
import ImageUploader from "./ImageUploader";
import Button from "../../components/Button";
import { useDispatch } from "react-redux";
import { clearImages, importImages } from "../../store/slices/imagesSlice";
import "../../styles/strangerThings.css";

function ImagesView() {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.images);
  const theme = useSelector((state) => state.ui.theme);
  const isStrangerThings = theme === "strangerThings";
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
          Bibliothèque d'images
        </h1>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: "none" }}
            id="import-images-input"
          />
          <Button 
            variant="secondary" 
            size="small"
            className={isStrangerThings ? "stranger-things-button" : ""}
            onClick={() => {
              document.getElementById("import-images-input")?.click();
            }}
          >
            📥 Importer (JSON)
          </Button>
          {images.length > 0 && (
            <Button 
              onClick={handleClearAll} 
              variant="danger" 
              size="small"
              className={isStrangerThings ? "stranger-things-button" : ""}
            >
              🗑️ Tout supprimer
            </Button>
          )}
          <Button
            onClick={() => {
              setShowUploader(true);
            }}
            variant="primary"
            size="small"
            className={isStrangerThings ? "stranger-things-button" : ""}
          >
            + Ajouter une image
          </Button>
        </div>
      </div>
      
      <div style={{ 
        marginBottom: "1rem", 
        padding: "0.75rem", 
        backgroundColor: isStrangerThings ? "#1a0000" : "#e3f2fd",
        border: isStrangerThings ? "1px solid #e50914" : "none",
        borderRadius: "0.25rem",
        fontSize: "0.875rem",
        color: isStrangerThings ? "#e50914" : "inherit"
      }}>
        <strong>💡 Note :</strong> "Importer" charge un fichier JSON d'images exportées. 
        "Ajouter une image" permet d'uploader une nouvelle image depuis votre ordinateur.
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