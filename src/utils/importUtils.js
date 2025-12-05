function importMarkdownFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith(".md")) {
      reject(new Error("Le fichier doit être un fichier .md"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) =>
      reject(new Error("Erreur lors de la lecture du fichier"));
    reader.readAsText(file);
  });
}

function validateBlockFormat(data) {
  if (!data || typeof data !== "object") {
    return false;
  }

  const hasName = typeof data.name === "string" && data.name.trim().length > 0;
  const hasContent = typeof data.content === "string";

  return hasName && hasContent;
}

function importBlock(file) {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith(".part.mdlc")) {
      reject(new Error("Le fichier doit être un fichier .part.mdlc"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (!validateBlockFormat(data)) {
          reject(
            new Error(
              "Format de bloc invalide. Le bloc doit avoir un nom et un contenu."
            )
          );
          return;
        }

        if (!data.id) {
          data.id = `block-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        }

        resolve(data);
      } catch (error) {
        reject(new Error("Erreur lors du parsing JSON: " + error.message));
      }
    };
    reader.onerror = (e) =>
      reject(new Error("Erreur lors de la lecture du fichier"));
    reader.readAsText(file);
  });
}

function importBlocks(file) {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith(".parts.mdlc")) {
      reject(new Error("Le fichier doit être un fichier .parts.mdlc"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (!Array.isArray(data)) {
          reject(
            new Error("Le fichier .parts.mdlc doit contenir un array de blocs")
          );
          return;
        }

        const validBlocks = data.map((block, index) => {
          if (!validateBlockFormat(block)) {
            throw new Error(`Bloc à l'index ${index} est invalide`);
          }

          if (!block.id) {
            block.id = `block-${Date.now()}-${index}-${Math.random()
              .toString(36)
              .substr(2, 9)}`;
          }

          return block;
        });

        resolve(validBlocks);
      } catch (error) {
        reject(new Error("Erreur lors du parsing JSON: " + error.message));
      }
    };
    reader.onerror = (e) =>
      reject(new Error("Erreur lors de la lecture du fichier"));
    reader.readAsText(file);
  });
}

export { importMarkdownFile, importBlock, importBlocks, validateBlockFormat };
