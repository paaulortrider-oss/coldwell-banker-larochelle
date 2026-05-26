# COLDWELL BANKER GLOBAL LUXURY — La Rochelle
## Guide de Déploiement GitHub & Documentation Technique

---

## 📋 SOMMAIRE
1. [Prérequis](#1-prérequis)
2. [Créer le Repository GitHub](#2-créer-le-repository-github)
3. [Pousser le projet sur GitHub](#3-pousser-le-projet-sur-github)
4. [Activer GitHub Pages](#4-activer-github-pages)
5. [Architecture du projet](#5-architecture-du-projet)
6. [Personnalisation rapide](#6-personnalisation-rapide)
7. [Ajouter le back-end CRM](#7-ajouter-le-back-end-crm)
8. [Checklist avant mise en ligne](#8-checklist-avant-mise-en-ligne)

---

## 1. Prérequis

Installez ces outils **une seule fois** sur votre ordinateur :

### Git
- Windows : https://git-scm.com/download/win → installer avec les options par défaut
- Mac : ouvrez le Terminal, tapez `git --version` → il propose de l'installer automatiquement

### VS Code (éditeur de code)
- https://code.visualstudio.com
- Extension recommandée : **Live Server** (cherchez-la dans l'onglet Extensions)

### Vérification
Ouvrez un Terminal (Windows : `cmd` ou `PowerShell`) et tapez :
```bash
git --version
# Doit afficher : git version 2.x.x
```

---

## 2. Créer le Repository GitHub

### Étape 2.1 — Créer un compte GitHub
Rendez-vous sur https://github.com et créez un compte gratuit si ce n'est pas déjà fait.

### Étape 2.2 — Créer un nouveau repository
1. Cliquez sur le bouton vert **"New"** (ou le `+` en haut à droite → "New repository")
2. Remplissez le formulaire :
   - **Repository name** : `coldwell-banker-larochelle`
   - **Description** : `Site immobilier Coldwell Banker Global Luxury - La Rochelle`
   - **Visibility** : `Public` *(nécessaire pour GitHub Pages gratuit)*
   - ❌ Ne cochez **PAS** "Add a README file" (on en a déjà un)
3. Cliquez sur **"Create repository"**
4. Copiez l'URL affichée, elle ressemble à :
   `https://github.com/VOTRE-NOM/coldwell-banker-larochelle.git`

---

## 3. Pousser le projet sur GitHub

### Étape 3.1 — Ouvrir un Terminal dans le bon dossier

**Sur Windows :**
1. Dézippez `coldwell-banker-v1.zip` → vous obtenez le dossier `coldwell-banker/`
2. Ouvrez ce dossier dans VS Code (Fichier → Ouvrir le dossier)
3. Dans VS Code : Terminal → Nouveau Terminal

**Sur Mac :**
1. Dézippez l'archive, faites un clic droit sur le dossier `coldwell-banker/`
2. "Nouveau terminal au dossier"

### Étape 3.2 — Configurer Git (une seule fois)
```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
```

### Étape 3.3 — Initialiser et pousser
Copiez-collez ces commandes **une par une** dans le terminal :

```bash
# 1. Initialiser Git dans le dossier
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Créer le premier commit (=snapshot du projet)
git commit -m "🚀 Initial commit - Coldwell Banker La Rochelle v1"

# 4. Renommer la branche principale
git branch -M main

# 5. Connecter au repository GitHub
#    ⚠️ Remplacez l'URL par la vôtre (copiée à l'étape 2.4)
git remote add origin https://github.com/VOTRE-NOM/coldwell-banker-larochelle.git

# 6. Envoyer le code sur GitHub
git push -u origin main
```

> **Si GitHub vous demande de vous connecter :**
> Utilisez votre nom d'utilisateur GitHub + un "Personal Access Token"
> (GitHub → Settings → Developer Settings → Personal access tokens → Generate new token)

### Vérification
Retournez sur GitHub dans votre navigateur et rechargez la page.
Vous devez voir tous vos fichiers apparaître. ✅

---

## 4. Activer GitHub Pages

GitHub Pages transforme votre repository en site web public **gratuit**.

1. Dans votre repository GitHub, cliquez sur l'onglet **"Settings"**
2. Dans le menu gauche, cliquez sur **"Pages"**
3. Sous **"Branch"** : sélectionnez `main`, puis le dossier `/ (root)`
4. Cliquez sur **"Save"**
5. Attendez 1-2 minutes, rechargez la page
6. GitHub affiche : **"Your site is published at https://VOTRE-NOM.github.io/coldwell-banker-larochelle/"**

> ⚠️ **Important :** Les fichiers `.glb` et `.mp4` sont lourds (>50MB).
> GitHub Pages a une limite de 100MB par fichier et 1GB par repository.
> Si la vidéo est trop lourde, hébergez-la sur un CDN externe (ex: Cloudflare R2 gratuit)
> et mettez à jour son chemin dans `Coldwell_Banker_Final_App.html`.

---

## 5. Architecture du Projet

```
coldwell-banker/
│
├── Coldwell_Banker_Final_App.html     ← Fichier racine (ouvrir en premier)
│   ├── <head>                         Imports CDN (Three.js, GSAP, Lenis, Tailwind)
│   ├── <style>                        Charte graphique inline (variables CSS)
│   ├── #loader                        Écran de chargement
│   ├── #webgl-canvas                  Canvas fond particules global
│   ├── #main-nav                      Navigation glassmorphism fixe
│   ├── #view-home                     Accueil : 5 sections immersives
│   │   ├── #section-hero              Section 1 : Titre cinématique
│   │   ├── #section-scrubbing         Section 2 : Vidéo scrubbing
│   │   ├── #section-ville             Section 3 : Ville holographique
│   │   ├── #section-globe             Section 4 : Globe CB
│   │   └── #section-iris              Section 5 : L'Humain
│   ├── #view-vendre                   Sous-page Vendre
│   ├── #view-acheter                  Sous-page Acheter
│   ├── #view-estimer                  Sous-page Estimation (info)
│   ├── #view-international            Sous-page International
│   ├── #view-profil                   Sous-page Profil consultant
│   ├── #view-contact                  Sous-page Contact
│   ├── #view-crm                      CRM Kanban (accès admin)
│   └── #view-estimation               Tunnel "Le Prisme CB" (7 étapes)
│
├── css/
│   └── style.css                      Variables Tailwind + animations CSS
│
├── js/
│   ├── app-logic.js                   Logique vues + tunnel + CRM (515 lignes)
│   ├── animations.js                  GSAP + Lenis scroll (393 lignes)
│   └── three-scenes.js                WebGL Three.js (767 lignes)
│       ├── initParticleBackground()   Fond particules global
│       ├── initVilleScene()           Hologramme La Rochelle
│       └── initGlobeScene()           Globe international CB
│
└── assets/
    ├── medias/
    │   ├── maison-eclatee.mp4         Vidéo scrubbing démembrement
    │   ├── villa-prestige.jpg         Fond section Iris
    │   └── larochelle-hero.png        Image hero La Rochelle
    └── models/
        ├── holographic_city_model_3d.glb   Modèle 3D ville
        └── glowing_globe_3d_model.glb      Modèle 3D globe
```

---

## 6. Personnalisation Rapide

### Changer les prix au m²
Dans `js/app-logic.js`, ligne ~170, section `afficherResultat()` :
```javascript
let prixM2 = 4800; // ← Modifiez ce chiffre (base Vieux-Port)
```

### Ajouter votre photo (page Profil)
Remplacez le placeholder dans `#view-profil` :
```html
<!-- Cherchez cette ligne dans le HTML : -->
<span class="text-gray-500">[VOTRE PHOTO PROFESSIONNELLE]</span>

<!-- Remplacez-la par : -->
<img src="./assets/medias/votre-photo.jpg" alt="Votre Nom" 
     style="width:100%; height:100%; object-fit:cover; border-radius:2px;">
```

### Ajouter votre numéro de téléphone
Cherchez `href="#"` dans `#view-contact` et remplacez par :
```html
href="tel:+33XXXXXXXXX"
```

### Ajouter l'adresse de l'agence
Cherchez `[ADRESSE COMPLÈTE À COMPLÉTER]` dans le HTML et remplacez.

### Changer les couleurs (si besoin)
Dans `Coldwell_Banker_Final_App.html`, section `:root` dans le `<style>` :
```css
:root {
    --black:  #000000;   /* Fond principal */
    --gold:   #c6a87c;   /* Or prestige */
    --cyan:   #00D4FF;   /* Cyan laser */
}
```

---

## 7. Ajouter le Back-End CRM

Le fichier `crm-api.js` (Node.js/Express) tourne en local sur le port 3000.
Pour le déployer en production :

### Option A — Render.com (gratuit)
1. Créez un compte sur https://render.com
2. "New Web Service" → connectez votre repo GitHub
3. Build Command : `npm install`
4. Start Command : `node crm-api.js`
5. Copiez l'URL fournie (ex: `https://cb-crm.onrender.com`)
6. Dans `js/app-logic.js`, remplacez :
```javascript
await fetch('/api/sauvegarde-prospect', { ... })
// par :
await fetch('https://cb-crm.onrender.com/api/sauvegarde-prospect', { ... })
```

### Option B — Railway.app (gratuit jusqu'à 5$/mois)
Même principe, encore plus simple à connecter avec GitHub.

---

## 8. Checklist Avant Mise en Ligne

Avant de partager votre URL publique :

- [ ] Remplacer `[VOTRE PHOTO PROFESSIONNELLE]` par votre vraie photo
- [ ] Renseigner `[ADRESSE COMPLÈTE À COMPLÉTER]` dans Contact
- [ ] Ajouter votre numéro de téléphone dans les liens `href="tel:..."`
- [ ] Ajouter votre email dans les liens `href="mailto:..."`
- [ ] Vérifier que la vidéo `maison-eclatee.mp4` se charge (onglet Réseau du navigateur)
- [ ] Tester sur mobile (Chrome DevTools → icône téléphone)
- [ ] Tester le tunnel d'estimation de bout en bout
- [ ] Vérifier que les prix DVF sont bien à jour
- [ ] Vérifier l'accès CRM (triple-clic sur "Admin" dans la nav)

---

## 🔄 Mettre à Jour le Site Après Modifications

Après chaque modification de fichier, ouvrez le terminal dans le dossier du projet :

```bash
# 1. Vérifier les fichiers modifiés
git status

# 2. Ajouter les modifications
git add .

# 3. Créer un commit avec un message descriptif
git commit -m "✏️ Mise à jour : [décrivez votre changement]"

# 4. Envoyer sur GitHub (le site se met à jour automatiquement sous ~2min)
git push
```

---

## 🆘 Problèmes Fréquents

**Le site s'affiche tout blanc :**
→ Ouvrez la Console du navigateur (F12 → Console) et lisez l'erreur en rouge.
→ Vérifiez que vous ouvrez le fichier via Live Server, pas en double-cliquant dessus.

**La vidéo ne se lance pas :**
→ Normal en local si le fichier est trop lourd pour le navigateur.
→ Sur GitHub Pages, vérifiez que le fichier `.mp4` est bien poussé (`git status`).

**Le globe/la ville ne s'affichent pas :**
→ Vérifiez dans la Console si une erreur "GLB not found" apparaît.
→ Les fallbacks géométriques s'activent automatiquement si les `.glb` sont absents.

**GitHub refuse le push (fichier trop lourd) :**
→ La vidéo MP4 peut dépasser la limite GitHub (100MB/fichier).
→ Solution : `git lfs install` puis `git lfs track "*.mp4"` avant le commit.

---

*Documentation générée pour Coldwell Banker Global Luxury — La Rochelle*
*Stack : Three.js r128 · GSAP 3.12.2 · Lenis 1.x · Tailwind CSS · Vanilla JS*
