// Utilitaires pour la gestion des raccourcis clavier avec compatibilité Mac

// Détecter si on est sur Mac
export const isMac = () => {
  return (
    navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
    navigator.userAgent.toUpperCase().indexOf("MAC") >= 0
  );
};

// Convertir un raccourci en format lisible selon l'OS
export const formatShortcut = (shortcut) => {
  if (!shortcut) return "";

  const mac = isMac();
  let formatted = shortcut;

  // Remplacer Ctrl par Cmd sur Mac
  if (mac) {
    formatted = formatted.replace(/Ctrl/gi, "Cmd");
    formatted = formatted.replace(/Control/gi, "Cmd");
  }

  return formatted;
};

// Convertir un raccourci en format normalisé pour la comparaison
export const normalizeShortcut = (shortcut) => {
  if (!shortcut) return "";

  // Normaliser : mettre en minuscules, remplacer les espaces, etc.
  return shortcut
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/cmd/gi, "meta")
    .replace(/ctrl/gi, "control");
};

// Parser un raccourci depuis un string (ex: "Ctrl+Shift+B" ou "Cmd+Shift+B")
export const parseShortcut = (shortcutString) => {
  if (!shortcutString) return null;

  const parts = shortcutString.split("+").map((p) => p.trim().toLowerCase());
  const result = {
    ctrl: false,
    meta: false,
    shift: false,
    alt: false,
    key: null,
  };

  parts.forEach((part) => {
    if (part === "ctrl" || part === "control") {
      // Sur Mac, Ctrl devient meta, sur Windows/Linux reste ctrl
      // On marque les deux pour compatibilité
      result.ctrl = true;
      result.meta = true; // Accepter les deux formats
    } else if (part === "cmd" || part === "meta" || part === "command") {
      result.meta = true;
      result.ctrl = true; // Accepter les deux formats
    } else if (part === "shift") {
      result.shift = true;
    } else if (part === "alt" || part === "option") {
      result.alt = true;
    } else {
      result.key = part.toUpperCase();
    }
  });

  return result;
};

// Vérifier si un événement clavier correspond à un raccourci
export const matchesShortcut = (event, shortcutString) => {
  if (!shortcutString) return false;

  const parsed = parseShortcut(shortcutString);
  if (!parsed || !parsed.key) return false;

  const mac = isMac();

  // Sur Mac, utiliser metaKey, sur Windows/Linux utiliser ctrlKey
  // Le parsing marque les deux (ctrl et meta) pour compatibilité
  const wantsModifier = parsed.ctrl || parsed.meta;
  const hasModifier = mac ? event.metaKey : event.ctrlKey;

  // Vérifier que la touche correspond
  const keyMatches = event.key.toUpperCase() === parsed.key;

  // Vérifier les modificateurs
  const modifiersMatch =
    hasModifier === wantsModifier &&
    event.shiftKey === parsed.shift &&
    event.altKey === parsed.alt;

  return keyMatches && modifiersMatch;
};

// Présets de raccourcis communs
export const SHORTCUT_PRESETS = [
  { label: "Bloc 1", value: "Ctrl+Shift+1", macValue: "Cmd+Shift+1" },
  { label: "Bloc 2", value: "Ctrl+Shift+2", macValue: "Cmd+Shift+2" },
  { label: "Bloc 3", value: "Ctrl+Shift+3", macValue: "Cmd+Shift+3" },
  { label: "Bloc 4", value: "Ctrl+Shift+4", macValue: "Cmd+Shift+4" },
  { label: "Bloc 5", value: "Ctrl+Shift+5", macValue: "Cmd+Shift+5" },
  { label: "Bloc 6", value: "Ctrl+Shift+6", macValue: "Cmd+Shift+6" },
  { label: "Bloc 7", value: "Ctrl+Shift+7", macValue: "Cmd+Shift+7" },
  { label: "Bloc 8", value: "Ctrl+Shift+8", macValue: "Cmd+Shift+8" },
  { label: "Bloc 9", value: "Ctrl+Shift+9", macValue: "Cmd+Shift+9" },
  { label: "Bloc A", value: "Ctrl+Shift+A", macValue: "Cmd+Shift+A" },
  { label: "Bloc B", value: "Ctrl+Shift+B", macValue: "Cmd+Shift+B" },
  { label: "Bloc C", value: "Ctrl+Shift+C", macValue: "Cmd+Shift+C" },
  { label: "Bloc D", value: "Ctrl+Shift+D", macValue: "Cmd+Shift+D" },
  { label: "Bloc E", value: "Ctrl+Shift+E", macValue: "Cmd+Shift+E" },
  { label: "Bloc F", value: "Ctrl+Shift+F", macValue: "Cmd+Shift+F" },
];

// Obtenir la valeur du raccourci selon l'OS
export const getShortcutValue = (preset) => {
  return isMac() ? preset.macValue : preset.value;
};
