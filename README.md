# Éditeur Markdown

Application web pour gérer et éditer des documents Markdown avec prévisualisation en temps réel.

## Description

Éditeur Markdown qui permet de créer, organiser et éditer des documents avec prévisualisation HTML. Inclut un système de blocs réutilisables et une bibliothèque d'images.

## Fonctionnalités

**Gestion de fichiers**
- Organisation en arborescence avec dossiers
- Création, modification, suppression et renommage
- Déplacement par glisser-déposer
- Import et export de fichiers .md

**Édition**
- Éditeur Markdown avec coloration syntaxique
- Prévisualisation HTML en temps réel
- Insertion d'images depuis la bibliothèque
- Insertion de blocs personnalisés via raccourcis clavier

**Blocs personnalisés**
- Création de blocs HTML/Markdown réutilisables
- Bibliothèque de blocs avec gestion complète
- Raccourcis clavier pour insertion rapide
- Import/export de blocs (.part.mdlc pour un bloc, .parts.mdlc pour plusieurs)

**Bibliothèque d'images**
- Import d'images par bouton ou glisser-déposer
- Stockage en base64
- Gestion des images (renommage, suppression)
- Insertion dans les documents
- Import/export (.img.mdlc pour une image, .imgs.mdlc pour plusieurs)

**Collaborations**
- Interface dédiée pour le travail collaboratif

## Installation et lancement

Prérequis : Node.js version 16 ou supérieure

Installation :
```bash
npm install
npm run dev
```

Lancement en développement : `npm run dev`

L'application sera accessible à l'adresse : http://localhost:5173

## Technologies

- React 19
- Vite
- Redux Toolkit
- React Router
- Marked (conversion Markdown vers HTML)
- localStorage/IndexedDB pour la persistance

## Structure

```
src/
├── components/          # Composants réutilisables
│   ├── Button.jsx
│   ├── Layout.jsx
│   ├── MarkdownEditor.jsx
│   ├── MarkdownPreview.jsx
│   ├── Modal.jsx
│   ├── MusicPlayer.jsx
│   ├── Sidebar.jsx
│   └── TreeView.jsx
├── features/           # Fonctionnalités par domaine
│   ├── blocks/         # Gestion des blocs
│   ├── collaborations/ # Collaborations
│   ├── files/          # Gestion des fichiers
│   └── images/         # Bibliothèque d'images
├── store/              # Configuration Redux
│   ├── slices/         # Slices Redux
│   └── store.js
├── styles/             # Styles CSS
├── utils/              # Fonctions utilitaires
├── App.jsx             # Composant racine
└── main.jsx            # Point d'entrée
```
