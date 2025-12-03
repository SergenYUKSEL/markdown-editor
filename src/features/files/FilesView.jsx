import { useState } from "react";
import { useSelector } from "react-redux";
import FileTree from "./FileTree";
import FileEditor from "./FileEditor";
import "../../styles/strangerThings.css";

function FilesView() {
  const theme = useSelector((state) => state.ui.theme);
  const isStrangerThings = theme === "strangerThings";
  
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Sidebar avec l'arborescence */}
      <div
        style={{
          width: "300px",
          borderRight: isStrangerThings ? "2px solid #e50914" : "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: isStrangerThings ? "#1a0000" : "transparent",
        }}
      >
        <div
          style={{
            padding: "1rem",
            borderBottom: isStrangerThings ? "2px solid #e50914" : "1px solid #ccc",
            backgroundColor: isStrangerThings ? "#0a0a0a" : "#f8f9fa",
          }}
        >
          <h2 
            style={{ 
              margin: 0, 
              fontSize: "1.25rem",
              color: isStrangerThings ? "#e50914" : "inherit",
              textShadow: isStrangerThings ? "0 0 10px #e50914" : "none"
            }}
          >
            Fichiers
          </h2>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "1rem" }}>
          <FileTree />
        </div>
      </div>

      {/* Zone d'édition */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <FileEditor />
      </div>
    </div>
  );
}

export default FilesView;