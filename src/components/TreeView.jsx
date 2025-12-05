import { useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/strangerThings.css';

function TreeView({ 
  tree, 
  onSelect, 
  onCreate, 
  onRename, 
  onDelete, 
  onMove 
}) {
  const theme = useSelector((state) => state.ui.theme);
  const isStrangerThings = theme === "strangerThings";
  const [expanded, setExpanded] = useState({});
  const [contextMenu, setContextMenu] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const toggleExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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

  const isDescendant = (parentId, childId, node = tree) => {
    if (node.id === childId) return false;
    if (node.id === parentId) {
      const findInChildren = (n) => {
        if (n.id === childId) return true;
        if (n.children) {
          return n.children.some(child => findInChildren(child));
        }
        return false;
      };
      return findInChildren(node);
    }
    if (node.children) {
      return node.children.some(child => isDescendant(parentId, childId, child));
    }
    return false;
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e, targetItem) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItem || !targetItem) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    if (draggedItem.id === targetItem.id) {
      e.dataTransfer.dropEffect = 'none';
      setDragOverItem(null);
      return;
    }

    if (draggedItem.type === 'folder' && isDescendant(draggedItem.id, targetItem.id, tree)) {
      e.dataTransfer.dropEffect = 'none';
      setDragOverItem(null);
      return;
    }

    if (targetItem.type === 'folder' || targetItem.id === 'root') {
      e.dataTransfer.dropEffect = 'move';
      setDragOverItem(targetItem.id);
    } else {
      e.dataTransfer.dropEffect = 'none';
      setDragOverItem(null);
    }
  };

  const handleDragLeave = (e) => {
    const relatedTarget = e.relatedTarget;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverItem(null);
    }
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItem || !targetItem) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }
    
    if (draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    if (draggedItem.type === 'folder' && isDescendant(draggedItem.id, targetItem.id, tree)) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }
    
    if (targetItem.type === 'folder' || targetItem.id === 'root') {
      const targetParentId = targetItem.id === 'root' ? 'root' : targetItem.id;
      
      if (onMove) {
        onMove(draggedItem.id, targetParentId);
      }
    }
    
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const renderTreeNode = (node, level = 0) => {
    const isExpanded = expanded[node.id];
    const isFolder = node.type === 'folder';
    const hasChildren = node.children && node.children.length > 0;
    const isDragged = draggedItem?.id === node.id;
    const isDragOver = dragOverItem === node.id;
    const isDragging = draggedItem !== null;

    return (
      <div key={node.id}>
        <div
          style={{
            padding: '0.25rem 0.5rem',
            paddingLeft: `${level * 1.5}rem`,
            cursor: isDragging ? (isDragOver && isFolder ? 'move' : 'not-allowed') : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: isDragOver && isFolder 
              ? (isStrangerThings ? '#1a0000' : '#e3f2fd')
              : contextMenu?.item?.id === node.id 
                ? (isStrangerThings ? '#1a0000' : '#e3f2fd')
                : isDragged 
                  ? (isStrangerThings ? '#1a0000' : '#f0f0f0')
                  : 'transparent',
            color: isStrangerThings ? '#e50914' : 'inherit',
            userSelect: 'none',
            opacity: isDragged ? 0.5 : 1,
            border: isDragOver && isFolder 
              ? (isStrangerThings ? '2px dashed #00d4ff' : '2px dashed #007bff')
              : '2px solid transparent',
            borderRadius: '0.25rem',
            transition: 'all 0.2s'
          }}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, node)}
          onDragOver={(e) => handleDragOver(e, node)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, node)}
          onDragEnd={handleDragEnd}
          onContextMenu={(e) => handleContextMenu(e, node)}
          onClick={() => {
            if (isFolder) {
              toggleExpand(node.id);
            } else if (onSelect) {
              onSelect(node);
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
      className={isStrangerThings ? "stranger-things-tree" : ""}
      style={{ 
        padding: '1rem',
        height: '100%',
        overflow: 'auto',
        border: isStrangerThings ? '2px solid #e50914' : '1px solid #ccc',
        backgroundColor: isStrangerThings ? '#0a0a0a' : 'transparent',
        color: isStrangerThings ? '#e50914' : 'inherit'
      }}
      onClick={closeContextMenu}
      onDragOver={(e) => {
        e.preventDefault();
        if (draggedItem) {
          e.dataTransfer.dropEffect = 'move';
          setDragOverItem('root');
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setDragOverItem(null);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (draggedItem && onMove) {
          onMove(draggedItem.id, 'root');
        }
        setDraggedItem(null);
        setDragOverItem(null);
      }}
    >
      {draggedItem && dragOverItem === 'root' && (
        <div
          style={{
            padding: '0.5rem',
            marginBottom: '0.5rem',
            backgroundColor: isStrangerThings ? '#1a0000' : '#e3f2fd',
            border: isStrangerThings ? '2px dashed #00d4ff' : '2px dashed #007bff',
            borderRadius: '0.25rem',
            textAlign: 'center',
            color: isStrangerThings ? '#00d4ff' : '#007bff',
            fontWeight: 'bold',
            textShadow: isStrangerThings ? '0 0 10px #00d4ff' : 'none'
          }}
        >
          Déposer ici pour déplacer à la racine
        </div>
      )}
      {tree && tree.children && tree.children.length > 0 ? (
        tree.children.map(child => renderTreeNode(child))
      ) : (
        <div 
          style={{ 
            padding: '1rem', 
            color: isStrangerThings ? '#e50914' : '#666', 
            textAlign: 'center',
            border: dragOverItem === 'root' 
              ? (isStrangerThings ? '2px dashed #00d4ff' : '2px dashed #007bff')
              : 'none',
            borderRadius: '0.25rem',
            backgroundColor: dragOverItem === 'root' 
              ? (isStrangerThings ? '#1a0000' : '#e3f2fd')
              : 'transparent',
            textShadow: isStrangerThings ? '0 0 5px #e50914' : 'none'
          }}
        >
          {draggedItem && dragOverItem === 'root' 
            ? 'Déposer ici pour déplacer à la racine' 
            : 'Aucun fichier ou dossier'}
        </div>
      )}

      {contextMenu && (
        <div
          className={isStrangerThings ? "stranger-things-context-menu" : ""}
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: isStrangerThings ? '#1a0000' : 'white',
            border: isStrangerThings ? '2px solid #e50914' : '1px solid #ccc',
            borderRadius: '0.25rem',
            boxShadow: isStrangerThings ? '0 0 20px #e50914' : '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: '150px',
            color: isStrangerThings ? '#e50914' : 'inherit'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.item.type === 'folder' ? (
            <>
              <div
                style={{ 
                  padding: '0.5rem 1rem', 
                  cursor: 'pointer', 
                  borderBottom: isStrangerThings ? '1px solid #e50914' : '1px solid #eee',
                  color: isStrangerThings ? '#e50914' : 'inherit'
                }}
                onMouseEnter={(e) => {
                  if (isStrangerThings) {
                    e.target.style.backgroundColor = '#0a0a0a';
                    e.target.style.textShadow = '0 0 5px #00d4ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isStrangerThings) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.textShadow = 'none';
                  }
                }}
                onClick={() => {
                  if (onCreate) onCreate('file', contextMenu.item.id);
                  closeContextMenu();
                }}
              >
                📄 Nouveau fichier
              </div>
              <div
                style={{ 
                  padding: '0.5rem 1rem', 
                  cursor: 'pointer', 
                  borderBottom: isStrangerThings ? '1px solid #e50914' : '1px solid #eee',
                  color: isStrangerThings ? '#e50914' : 'inherit'
                }}
                onMouseEnter={(e) => {
                  if (isStrangerThings) {
                    e.target.style.backgroundColor = '#0a0a0a';
                    e.target.style.textShadow = '0 0 5px #00d4ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isStrangerThings) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.textShadow = 'none';
                  }
                }}
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
              style={{ 
                padding: '0.5rem 1rem', 
                cursor: 'pointer', 
                borderBottom: isStrangerThings ? '1px solid #e50914' : '1px solid #eee',
                color: isStrangerThings ? '#e50914' : 'inherit'
              }}
              onMouseEnter={(e) => {
                if (isStrangerThings) {
                  e.target.style.backgroundColor = '#0a0a0a';
                  e.target.style.textShadow = '0 0 5px #00d4ff';
                }
              }}
              onMouseLeave={(e) => {
                if (isStrangerThings) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.textShadow = 'none';
                }
              }}
              onClick={() => {
                if (onSelect) onSelect(contextMenu.item);
                closeContextMenu();
              }}
            >
              ✏️ Ouvrir
            </div>
          )}
          <div
            style={{ 
              padding: '0.5rem 1rem', 
              cursor: 'pointer', 
              borderBottom: isStrangerThings ? '1px solid #e50914' : '1px solid #eee',
              color: isStrangerThings ? '#e50914' : 'inherit'
            }}
            onMouseEnter={(e) => {
              if (isStrangerThings) {
                e.target.style.backgroundColor = '#0a0a0a';
                e.target.style.textShadow = '0 0 5px #00d4ff';
              }
            }}
            onMouseLeave={(e) => {
              if (isStrangerThings) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.textShadow = 'none';
              }
            }}
            onClick={() => {
              if (onRename) onRename(contextMenu.item);
              closeContextMenu();
            }}
          >
            ✏️ Renommer
          </div>
          <div
            style={{ 
              padding: '0.5rem 1rem', 
              cursor: 'pointer', 
              color: isStrangerThings ? '#e50914' : '#dc3545'
            }}
            onMouseEnter={(e) => {
              if (isStrangerThings) {
                e.target.style.backgroundColor = '#0a0a0a';
                e.target.style.textShadow = '0 0 5px #e50914';
              }
            }}
            onMouseLeave={(e) => {
              if (isStrangerThings) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.textShadow = 'none';
              }
            }}
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