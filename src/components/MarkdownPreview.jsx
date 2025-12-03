import { useMemo } from 'react';
import { 
  parseMarkdown, 
  replaceBlockPlaceholders, 
  replaceImagePlaceholders 
} from '../utils/markdownParser';
import './MarkdownPreview.css';

// But : Prévisualisation HTML du Markdown
// Props : content (Markdown brut), blocks (blocs personnalisés), images (bibliothèque d'images)
function MarkdownPreview({ content = '', blocks = [], images = [] }) {
  // Traitement du contenu : parsing Markdown + remplacement des placeholders
  const htmlContent = useMemo(() => {
    if (!content) return '';

    // 1. Remplacer les placeholders de blocs
    let processedContent = replaceBlockPlaceholders(content, blocks);

    // 2. Remplacer les placeholders d'images
    processedContent = replaceImagePlaceholders(processedContent, images);

    // 3. Parser le Markdown en HTML
    const html = parseMarkdown(processedContent);

    return html;
  }, [content, blocks, images]);

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        overflow: 'auto', 
        padding: '1rem',
        border: '1px solid #ccc',
        backgroundColor: '#fff'
      }}
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

export default MarkdownPreview;