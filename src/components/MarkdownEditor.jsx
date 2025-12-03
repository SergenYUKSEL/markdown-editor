import { useRef, useEffect } from 'react';

// But : éditeur de texte pour Markdown
// Props : value, onChange, placeholder, onInsertBlock, onInsertImage
function MarkdownEditor({ 
  value = '', 
  onChange, 
  placeholder = 'Écrivez votre Markdown ici...',
  onInsertBlock,
  onInsertImage
}) {
  const textareaRef = useRef(null);

  // Gestion des raccourcis clavier pour les blocs
  useEffect(() => {
    if (!onInsertBlock) return;

    const handleKeyDown = (e) => {
      // Détecter les raccourcis (ex: Ctrl+Shift+B pour ouvrir la liste de blocs)
      // Cette logique peut être étendue selon les besoins
      if (e.ctrlKey && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        // Appeler onInsertBlock sans paramètre pour ouvrir la sélection
        if (onInsertBlock) {
          onInsertBlock();
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown);
      return () => textarea.removeEventListener('keydown', handleKeyDown);
    }
  }, [onInsertBlock]);

  // Fonction pour insérer du texte à la position du curseur
  const insertText = (textToInsert) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + textToInsert + value.substring(end);
    
    if (onChange) {
      onChange({ target: { value: newValue } });
    }

    // Repositionner le curseur après l'insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

  // Fonction pour insérer un bloc
  const handleInsertBlock = (block) => {
    if (!block) {
      // Si pas de bloc fourni, appeler la callback pour ouvrir la sélection
      if (onInsertBlock) onInsertBlock();
      return;
    }
    
    // Insérer le placeholder du bloc
    const placeholder = `{{block(${block.id})}}`;
    insertText(placeholder);
  };

  // Fonction pour insérer une image
  const handleInsertImage = (image) => {
    if (!image) {
      // Si pas d'image fournie, appeler la callback pour ouvrir la sélection
      if (onInsertImage) onInsertImage();
      return;
    }
    
    // Insérer le placeholder de l'image
    const placeholder = `{{image(${image.id})}}`;
    insertText(placeholder);
  };

  // Exposer les fonctions d'insertion via ref (optionnel, pour usage externe)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.insertBlock = handleInsertBlock;
      textareaRef.current.insertImage = handleInsertImage;
    }
  }, [value]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Barre d'outils simple */}
      <div style={{ 
        padding: '0.5rem', 
        borderBottom: '1px solid #ccc', 
        display: 'flex', 
        gap: '0.5rem',
        backgroundColor: '#f8f9fa'
      }}>
        <button
          type="button"
          onClick={() => insertText('**texte en gras**')}
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
          title="Gras"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => insertText('*texte en italique*')}
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
          title="Italique"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => insertText('[lien](url)')}
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
          title="Lien"
        >
          🔗
        </button>
        {onInsertBlock && (
          <button
            type="button"
            onClick={() => handleInsertBlock()}
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
            title="Insérer un bloc (Ctrl+Shift+B)"
          >
            📦 Bloc
          </button>
        )}
        {onInsertImage && (
          <button
            type="button"
            onClick={() => handleInsertImage()}
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
            title="Insérer une image"
          >
            🖼️ Image
          </button>
        )}
      </div>
      
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          flex: 1,
          fontFamily: 'monospace',
          fontSize: '1rem',
          padding: '1rem',
          border: 'none',
          resize: 'none',
          outline: 'none'
        }}
      />
    </div>
  );
}

export default MarkdownEditor;