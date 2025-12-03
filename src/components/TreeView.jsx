import { useState } from 'react';

// But : afficher l'arborescence de fichiers/dossiers
// Props : tree (structure depuis Redux), onSelect, onCreate, onRename, onDelete, onMove
function TreeView({ 
  tree, 
  onSelect, 
  onCreate, 
  onRename, 
  onDelete, 
  onMove 
}) {
  const [expanded, setExpanded] = useState({});
  const [contextMenu, setContextMenu] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Gestion du menu contextuel
  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Gestion du drag & drop
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    
    if (!draggedItem || !targetItem) return;
    
    // Ne pas déplacer un élément sur lui-même ou dans son propre parent
    if (draggedItem.id === targetItem.id) return;
    
    // Vérifier que la cible est un dossier
    if (targetItem.type !== 'folder') return;

    if (onMove) {
      onMove(draggedItem.id, targetItem.id);
    }
    
    setDraggedItem(null);
  };

  // Rendu récursif d'un élément de l'arbre
  const renderTreeNode = (node, level = 0) => {
    const isExpanded = expanded[node.id];
    const isFolder = node.type === 'folder';
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id}>
        <div
          style={{
            padding: '0.25rem 0.5rem',
            paddingLeft: `${level * 1.5}rem`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: contextMenu?.item?.id === node.id ? '#e3f2fd' : 'transparent',
            userSelect: 'none',
            draggable: true,
            onDragStart: (e) => handleDragStart(e, node),
            onDragOver: handleDragOver,
            onDrop: (e) => handleDrop(e, node),
            onContextMenu: (e) => handleContextMenu(e, node),
            onClick: () => {
              if (isFolder) {
                toggleExpand(node.id);
              } else if (onSelect) {
                onSelect(node);
              }
            }
          }}
        >
          {isFolder && (
            <span 
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              style={{ width: '1rem', textAlign: 'center' }}
            >
              {isExpanded ? '📂' : '📁'}
            </span>
          )}
          {!isFolder && <span>📄</span>}
          <span 
            style={{ flex: 1 }}
            onDoubleClick={() => {
              if (isFolder) {
                toggleExpand(node.id);
              } else if (onSelect) {
                onSelect(node);
              }
            }}
          >
            {node.name}
          </span>
        </div>
        
        {isFolder && isExpanded && hasChildren && (
          <div>
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      style={{ 
        padding: '1rem',
        height: '100%',
        overflow: 'auto',
        border: '1px solid #ccc'
      }}
      onClick={closeContextMenu}
    >
      {tree && tree.children && tree.children.length > 0 ? (
        tree.children.map(child => renderTreeNode(child))
      ) : (
        <div style={{ padding: '1rem', color: '#666', textAlign: 'center' }}>
          Aucun fichier ou dossier
        </div>
      )}

      {/* Menu contextuel */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '0.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: '150px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.item.type === 'folder' ? (
            <>
              <div
                style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                onClick={() => {
                  if (onCreate) onCreate('file', contextMenu.item.id);
                  closeContextMenu();
                }}
              >
                📄 Nouveau fichier
              </div>
              <div
                style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                onClick={() => {
                  if (onCreate) onCreate('folder', contextMenu.item.id);
                  closeContextMenu();
                }}
              >
                📁 Nouveau dossier
              </div>
            </>
          ) : (
            <div
              style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
              onClick={() => {
                if (onSelect) onSelect(contextMenu.item);
                closeContextMenu();
              }}
            >
              ✏️ Ouvrir
            </div>
          )}
          <div
            style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
            onClick={() => {
              if (onRename) onRename(contextMenu.item);
              closeContextMenu();
            }}
          >
            ✏️ Renommer
          </div>
          <div
            style={{ padding: '0.5rem 1rem', cursor: 'pointer', color: '#dc3545' }}
            onClick={() => {
              if (onDelete) onDelete(contextMenu.item.id);
              closeContextMenu();
            }}
          >
            🗑️ Supprimer
          </div>
        </div>
      )}
    </div>
  );
}

export default TreeView;