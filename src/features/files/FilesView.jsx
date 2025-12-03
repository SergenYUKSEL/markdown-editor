import { useState } from "react";
import FileTree from "./FileTree";
import FileEditor from "./FileEditor";

function FilesView() {
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Sidebar avec l'arborescence */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #ccc",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Fichiers</h2>
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