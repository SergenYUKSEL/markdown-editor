function exportMarkdownFile(content, filename = "document.md") {
  try {
    if (!content) {
      console.error("Aucun contenu à exporter");
      alert("Aucun contenu à exporter");
      return;
    }

    const cleanFilename =
      filename.replace(/[<>:"/\\|?*]/g, "_").trim() || "document";

    const finalFilename = cleanFilename.endsWith(".md")
      ? cleanFilename
      : `${cleanFilename}.md`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = finalFilename;
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Erreur lors de l'export:", error);
    alert("Erreur lors de l'export: " + error.message);
  }
}

function exportBlock(block) {
  try {
    if (!block) {
      console.error("Aucun bloc à exporter");
      return;
    }

    const cleanName = (block.name || "block")
      .replace(/[<>:"/\\|?*]/g, "_")
      .trim();
    const blob = new Blob([JSON.stringify(block, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cleanName}.part.mdlc`;
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Erreur lors de l'export du bloc:", error);
    alert("Erreur lors de l'export du bloc: " + error.message);
  }
}

function exportBlocks(blocks) {
  try {
    if (!blocks || blocks.length === 0) {
      console.error("Aucun bloc à exporter");
      alert("Aucun bloc à exporter");
      return;
    }

    const blob = new Blob([JSON.stringify(blocks, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parts.mdlc";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Erreur lors de l'export des blocs:", error);
    alert("Erreur lors de l'export des blocs: " + error.message);
  }
}

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
