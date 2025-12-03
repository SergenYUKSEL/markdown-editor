import { useSelector, useDispatch } from "react-redux";
import TreeView from "../../components/TreeView";
import {
  createItem,
  deleteItem,
  renameItem,
  moveItem,
  openFile,
} from "../../store/slices/filesSlice";
import { useState } from "react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import "../../styles/strangerThings.css";

function FileTree() {
  const dispatch = useDispatch();
  const tree = useSelector((state) => state.files.tree);
  const theme = useSelector((state) => state.ui.theme);
  const isStrangerThings = theme === "strangerThings";
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState("file");
  const [createParentId, setCreateParentId] = useState("root");
  const [newItemName, setNewItemName] = useState("");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameItem, setRenameItem] = useState(null);
  const [newName, setNewName] = useState("");

  const handleSelect = (item) => {
    if (item.type === "file") {
      dispatch(openFile({ id: item.id }));
    }
  };

  const handleCreate = (type, parentId) => {
    setCreateType(type);
    setCreateParentId(parentId || "root");
    setNewItemName("");
    setShowCreateModal(true);
  };

  const handleCreateSubmit = () => {
    if (newItemName.trim()) {
      dispatch(
        createItem({
          type: createType,
          name: newItemName.trim(),
          parentId: createParentId,
        })
      );
      setShowCreateModal(false);
      setNewItemName("");
    }
  };

  const handleRename = (item) => {
    setRenameItem(item);
    setNewName(item.name);
    setShowRenameModal(true);
  };

  const handleRenameSubmit = () => {
    if (newName.trim() && renameItem) {
      dispatch(
        renameItem({
          id: renameItem.id,
          newName: newName.trim(),
        })
      );
      setShowRenameModal(false);
      setRenameItem(null);
      setNewName("");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      dispatch(deleteItem({ id }));
    }
  };

  const handleMove = (itemId, targetParentId) => {
    dispatch(moveItem({ itemId, targetParentId }));
  };

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <Button
          onClick={() => handleCreate("file", "root")}
          variant="primary"
          size="small"
          className={isStrangerThings ? "stranger-things-button" : ""}
        >
          + Fichier
        </Button>
        <Button
          onClick={() => handleCreate("folder", "root")}
          variant="secondary"
          size="small"
          style={{ marginLeft: "0.5rem" }}
          className={isStrangerThings ? "stranger-things-button" : ""}
        >
          + Dossier
        </Button>
      </div>

      <TreeView
        tree={tree}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onRename={handleRename}
        onDelete={handleDelete}
        onMove={handleMove}
      />

      {/* Modal de création */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={`Créer un ${createType === "file" ? "fichier" : "dossier"}`}
      >
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Nom :
          </label>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleCreateSubmit();
            }}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
            }}
            autoFocus
          />
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <Button onClick={handleCreateSubmit} variant="primary">
              Créer
            </Button>
            <Button
              onClick={() => setShowCreateModal(false)}
              variant="secondary"
            >
              Annuler
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de renommage */}
      <Modal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        title="Renommer"
      >
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Nouveau nom :
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleRenameSubmit();
            }}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
            }}
            autoFocus
          />
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <Button onClick={handleRenameSubmit} variant="primary">
              Renommer
            </Button>
            <Button
              onClick={() => setShowRenameModal(false)}
              variant="secondary"
            >
              Annuler
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default FileTree;

