# Puka Pixel Adventure 🐰

Mini collection de jeux web pour enfant, basée sur le projet original **Pugly Pixel Adventure** et adaptée ici en version lapin.

## Attribution du projet source

Ce dépôt est une adaptation de :
- Projet original : [Godet5/pugly-pixel-adventure](https://github.com/Godet5/pugly-pixel-adventure)
- Auteur source : **Godet5**

Modifications principales dans ce fork :
- Reskin du personnage principal (chien -> lapin)
- Ajustement des textes UI (Pugly -> Bunny/Puka selon les écrans)
- Déploiement GitHub Pages pour ce dépôt

## Jouer en ligne

- GitHub Pages : [arnaudbon20.github.io/puka-pixel-adventure](https://arnaudbon20.github.io/puka-pixel-adventure/)

## Jeux inclus

### 1. Bunny's Tea Party (racine)
- Genre : Endless runner
- But : sauter les obstacles, collecter des biscuits
- Contrôles :
  - `Espace` ou tap écran : saut
  - `Entrée` : activer le power-up stocké

### 2. Bunny's Garden Mystery (`garden-mystery/`)
- Genre : infiltration / stratégie
- But : récupérer les friandises sans se faire attraper
- Contrôles :
  - `Flèches` ou `WASD` : déplacement
  - `Espace` (maintenir) : sniff
  - `1` : pelote
  - `2` : jouet

## Lancer en local

Prérequis : Node.js 18+ et npm.

```bash
# Jeu principal
npm install
npm run dev
```

```bash
# Jeu garden-mystery
cd garden-mystery
npm install
npm run dev
```

## Déploiement GitHub Pages

Le dépôt contient un workflow GitHub Actions :
- Fichier : `.github/workflows/deploy-pages.yml`
- Déclenchement : push sur `main`
- Publication : GitHub Pages (source = GitHub Actions)

## Structure rapide

```text
puka-pixel-adventure/
├── App.tsx
├── components/
├── garden-mystery/
├── services/
├── .github/workflows/deploy-pages.yml
└── README.md
```

## Remarque licence et crédits

Merci au projet original **Godet5/pugly-pixel-adventure** pour la base technique et créative.
Vérifie la licence et les conditions d'utilisation du projet source pour toute redistribution publique.
