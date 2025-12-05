import { useMemo } from 'react';
import { 
  parseMarkdown, 
  replaceBlockPlaceholders, 
  replaceImagePlaceholders 
} from '../utils/markdownParser';
import './MarkdownPreview.css';

function MarkdownPreview({ content = '', blocks = [], images = [] }) {
  const htmlContent = useMemo(() => {
    if (!content) return '';

    let processedContent = replaceBlockPlaceholders(content, blocks);

    processedContent = replaceImagePlaceholders(processedContent, images);

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