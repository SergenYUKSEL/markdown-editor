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
  const [dragOverItem, setDragOverItem] = useState(null);

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

  // Fonction utilitaire pour vérifier si un nœud est un descendant d'un autre
  const isDescendant = (parentId, childId, node = tree) => {
    if (node.id === childId) return false;
    if (node.id === parentId) {
      // Vérifier si childId est dans les descendants
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

  // Gestion du drag & drop
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    // Optionnel : ajouter des données pour le drag
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e, targetItem) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItem || !targetItem) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    // Ne pas permettre de drop sur l'élément lui-même
    if (draggedItem.id === targetItem.id) {
      e.dataTransfer.dropEffect = 'none';
      setDragOverItem(null);
      return;
    }

    // Ne pas permettre de déplacer un dossier dans ses propres descendants
    if (draggedItem.type === 'folder' && isDescendant(draggedItem.id, targetItem.id, tree)) {
      e.dataTransfer.dropEffect = 'none';
      setDragOverItem(null);
      return;
    }

    // Permettre le drop uniquement sur les dossiers ou à la racine
    if (targetItem.type === 'folder' || targetItem.id === 'root') {
      e.dataTransfer.dropEffect = 'move';
      setDragOverItem(targetItem.id);
    } else {
      e.dataTransfer.dropEffect = 'none';
      setDragOverItem(null);
    }
  };

  const handleDragLeave = (e) => {
    // Ne réinitialiser que si on quitte vraiment la zone (pas juste un enfant)
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
    
    // Ne pas déplacer un élément sur lui-même
    if (draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Ne pas permettre de déplacer un dossier dans ses propres descendants
    if (draggedItem.type === 'folder' && isDescendant(draggedItem.id, targetItem.id, tree)) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }
    
    // Vérifier que la cible est un dossier ou la racine
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

  // Rendu récursif d'un élément de l'arbre
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
              ? '#e3f2fd' 
              : contextMenu?.item?.id === node.id 
                ? '#e3f2fd' 
                : isDragged 
                  ? '#f0f0f0' 
                  : 'transparent',
            userSelect: 'none',
            opacity: isDragged ? 0.5 : 1,
            border: isDragOver && isFolder ? '2px dashed #007bff' : '2px solid transparent',
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
      style={{ 
        padding: '1rem',
        height: '100%',
        overflow: 'auto',
        border: '1px solid #ccc'
      }}
      onClick={closeContextMenu}
      onDragOver={(e) => {
        // Permettre le drop à la racine
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
            backgroundColor: '#e3f2fd',
            border: '2px dashed #007bff',
            borderRadius: '0.25rem',
            textAlign: 'center',
            color: '#007bff',
            fontWeight: 'bold'
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
            color: '#666', 
            textAlign: 'center',
            border: dragOverItem === 'root' ? '2px dashed #007bff' : 'none',
            borderRadius: '0.25rem',
            backgroundColor: dragOverItem === 'root' ? '#e3f2fd' : 'transparent'
          }}
        >
          {draggedItem && dragOverItem === 'root' 
            ? 'Déposer ici pour déplacer à la racine' 
            : 'Aucun fichier ou dossier'}
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