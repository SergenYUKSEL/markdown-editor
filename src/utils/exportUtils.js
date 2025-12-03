//But : export de fichiers
//Fonctions :
//- exportMarkdownFile(content, filename) : télécharger un fichier .md
//- exportBlock(block) : exporter un bloc en .part.mdlc (JSON)
//- exportBlocks(blocks) : exporter plusieurs blocs en .parts.mdlc (JSON array)
//- exportAllFiles(tree) : exporter toute l’arborescence (ZIP)
//Format .mdlc : JSON avec { name, content, shortcut, type }
//Usage : utilisé pour l'export des fichiers

function exportMarkdownFile(content, filename = "document.md") {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".md") ? filename : `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportBlock(block) {
  const blob = new Blob([JSON.stringify(block, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${block.name || "block"}.part.mdlc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportBlocks(blocks) {
  const blob = new Blob([JSON.stringify(blocks, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "parts.mdlc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Fonction simplifiée sans JSZip - exporte un JSON contenant tout
function exportAllFiles(tree, blocks = [], images = []) {
  const allData = {
    tree,
    blocks,
    images,
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(allData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "markdown-editor-export.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export { exportMarkdownFile, exportBlock, exportBlocks, exportAllFiles };
