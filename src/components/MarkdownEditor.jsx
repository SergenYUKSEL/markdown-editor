import { useRef, useEffect } from 'react';
import { matchesShortcut, isMac } from '../utils/keyboardUtils';

function MarkdownEditor({ 
  value = '', 
  onChange, 
  placeholder = 'Écrivez votre Markdown ici...',
  onInsertBlock,
  onInsertImage,
  blocks = []
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      for (const block of blocks) {
        if (block.shortcut && matchesShortcut(e, block.shortcut)) {
          e.preventDefault();
          const placeholder = `{{block(${block.id})}}`;
          const textarea = textareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = value.substring(0, start) + placeholder + value.substring(end);
            
            if (onChange) {
              onChange({ target: { value: newValue } });
            }

            setTimeout(() => {
              textarea.focus();
              const newPosition = start + placeholder.length;
              textarea.setSelectionRange(newPosition, newPosition);
            }, 0);
          }
          return;
        }
      }

      const mac = isMac();
      const modifierKey = mac ? e.metaKey : e.ctrlKey;
      
      if (modifierKey && e.shiftKey && e.key === 'B') {
        e.preventDefault();
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
  }, [onInsertBlock, blocks, value, onChange]);

  const insertText = (textToInsert) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + textToInsert + value.substring(end);
    
    if (onChange) {
      onChange({ target: { value: newValue } });
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

  const handleInsertBlock = (block) => {
    if (!block) {
      if (onInsertBlock) onInsertBlock();
      return;
    }
    
    const placeholder = `{{block(${block.id})}}`;
    insertText(placeholder);
  };

  const handleInsertImage = (image) => {
    if (!image) {
      if (onInsertImage) onInsertImage();
      return;
    }
    
    const placeholder = `{{image(${image.id})}}`;
    insertText(placeholder);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.insertBlock = handleInsertBlock;
      textareaRef.current.insertImage = handleInsertImage;
    }
  }, [value]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
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
            title={isMac() 
              ? "Insérer un bloc (Cmd+Shift+B)" 
              : "Insérer un bloc (Ctrl+Shift+B)"}
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