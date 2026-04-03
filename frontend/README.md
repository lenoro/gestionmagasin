# GestionMagasin

Application frontend React de gestion de magasin.

## Structure du projet

```
gestionmagasin/
├── public/
│   └── index.html
├── src/
│   ├── data/
│   │   ├── articles.js       ← données des articles (à relier à votre API)
│   │   └── clients.js        ← données des clients (à relier à votre API)
│   ├── components/
│   │   └── ModalArticle.jsx  ← sélecteur d'article réutilisable
│   ├── pages/
│   │   ├── Accueil.jsx       ← page d'accueil avec les 5 boutons
│   │   ├── Sortie.jsx        ← bon de sortie / vente
│   │   ├── Recherche.jsx     ← recherche articles et clients
│   │   ├── Articles.jsx      ← gestion de l'inventaire
│   │   └── Aides.jsx         ← documentation / FAQ
│   ├── styles/
│   │   └── global.css        ← styles partagés
│   ├── App.jsx               ← routage entre les pages
│   └── index.js              ← point d'entrée React
└── package.json
```

## Installation et démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer en mode développement
npm start

# 3. Construire pour la production
npm run build
```

L'application s'ouvre sur http://localhost:3000

## Pages disponibles

| Page       | Description                                              |
|------------|----------------------------------------------------------|
| Accueil    | Menu principal avec les 5 boutons de navigation          |
| Sortie     | Création d'un bon de vente (client + articles + totaux)  |
| Recherche  | Recherche d'articles ou de clients                       |
| Articles   | Inventaire complet avec ajout/modification/suppression   |
| Aides      | Documentation et questions fréquentes                    |

## Connecter à une vraie API

Remplacez le contenu de `src/data/articles.js` et `src/data/clients.js`
par des appels `fetch` vers votre backend :

```js
// Exemple avec useEffect dans un composant
useEffect(() => {
  fetch('/api/articles')
    .then(res => res.json())
    .then(data => setArticles(data));
}, []);
```

## Fonctionnalités à ajouter (prochaines étapes)

- [ ] Connexion à une base de données / API REST
- [ ] Authentification utilisateur
- [ ] Historique des bons de sortie
- [ ] Impression PDF des bons
- [ ] Gestion des clients (ajout/modification)
