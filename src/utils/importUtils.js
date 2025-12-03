// But : import de fichiers
// Fonctions :
// - importMarkdownFile(file) : lire un fichier .md et retourner le contenu
// - importBlock(file) : lire un .part.mdlc et retourner l'objet bloc
// - importBlocks(file) : lire un .parts.mdlc et retourner un array de blocs
// - validateBlockFormat(data) : valider le format d'un bloc importé
// Usage : dans les modales d'import

/**
 * Lit un fichier Markdown et retourne son contenu en tant que string
 * @param {File} file - Le fichier .md à lire
 * @returns {Promise<string>} Le contenu du fichier
 */
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

/**
 * Valide le format d'un bloc importé
 * @param {Object} data - Les données à valider
 * @returns {boolean} True si le format est valide
 */
function validateBlockFormat(data) {
  if (!data || typeof data !== "object") {
    return false;
  }

  // Un bloc doit avoir au minimum un nom et un contenu
  const hasName = typeof data.name === "string" && data.name.trim().length > 0;
  const hasContent = typeof data.content === "string";

  return hasName && hasContent;
}

/**
 * Lit un fichier .part.mdlc et retourne l'objet bloc
 * @param {File} file - Le fichier .part.mdlc à lire
 * @returns {Promise<Object>} L'objet bloc
 */
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

        // Générer un ID si absent
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

/**
 * Lit un fichier .parts.mdlc et retourne un array de blocs
 * @param {File} file - Le fichier .parts.mdlc à lire
 * @returns {Promise<Array>} Un array de blocs
 */
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

        // Valider chaque bloc et générer des IDs si nécessaire
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
