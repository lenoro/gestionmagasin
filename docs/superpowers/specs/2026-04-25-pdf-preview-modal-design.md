# Design — Prévisualisation PDF avant impression (États et Fiches)

Date : 2026-04-25  
Projet : GestionMagasin — Page États et Fiches

---

## Contexte

La page `/etats` contient 12 documents officiels MFP. Chaque document a un bouton "Imprimer PDF" qui appelle `window.open(url, '_blank')`, ouvrant directement le PDF dans un nouvel onglet sans aperçu préalable. L'objectif est d'afficher d'abord une prévisualisation, puis laisser l'utilisateur choisir d'imprimer ou non.

---

## Architecture

Zéro changement backend. Deux fichiers frontend modifiés/créés :

| Fichier | Action |
|---------|--------|
| `frontend/src/components/PdfPreviewModal.tsx` | Créer |
| `frontend/src/pages/Etats/EtatsPage.tsx` | Modifier |

---

## Composant `PdfPreviewModal`

**Fichier :** `frontend/src/components/PdfPreviewModal.tsx`

### Props

```typescript
interface PdfPreviewModalProps {
  url: string | null     // null = fermé, string = URL du PDF à afficher
  title: string          // Titre affiché dans l'en-tête de la modale
  onClose: () => void    // Appelé par Fermer, ✕ et clic backdrop
}
```

### Comportement

- `url === null` → le composant ne rend rien (`return null`)
- `url !== null` → modale visible avec l'iframe chargée sur cette URL
- Touche `Escape` → appelle `onClose`
- Clic sur le backdrop (fond semi-transparent) → appelle `onClose`
- Bouton **"Imprimer"** → `window.open(url, '_blank')` (ouvre dans un onglet, visualiseur natif du navigateur)
- Bouton **"Fermer"** → appelle `onClose`
- Bouton **✕** en haut à droite → appelle `onClose`

### Apparence

```
┌─────────────────────────────────────────────────────────┐  ← backdrop semi-transparent
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │  ← panneau 90vw × 90vh
│  │  Titre du document                           [✕]  │  │  ← en-tête gris clair
│  ├───────────────────────────────────────────────────┤  │
│  │                                                   │  │
│  │              <iframe src={url}>                   │  │  ← corps flex-1
│  │              (PDF du backend)                     │  │
│  │                                                   │  │
│  ├───────────────────────────────────────────────────┤  │
│  │  [🖨 Imprimer]                       [Fermer]     │  │  ← pied
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Modifications de `EtatsPage.tsx`

### 1. Import

```typescript
import PdfPreviewModal from '../../components/PdfPreviewModal'
```

### 2. Nouveaux états

```typescript
const [pdfUrl,   setPdfUrl]   = useState<string | null>(null)
const [pdfTitle, setPdfTitle] = useState('')
```

### 3. Fonction helper

Remplacer `openPdf(url)` par :

```typescript
function previsualiser(url: string, title: string) {
  setPdfUrl(url)
  setPdfTitle(title)
}
```

### 4. Mise à jour des boutons

Chaque `BtnPdf` passe de :
```tsx
onClick={() => openPdf(`${BASE}/bjr?...`)}
```
à :
```tsx
onClick={() => previsualiser(`${BASE}/bjr?...`, 'Bulletin Journalier de Réception')}
```

Le label du bouton change de `"Imprimer PDF"` à `"Aperçu"`.

Liste des titres par état :

| Endpoint | Titre modale |
|----------|-------------|
| `/bjr` | Bulletin Journalier de Réception |
| `/ejs` | État Journalier des Sorties |
| `/reforme` | État du Matériel à Proposer à la Réforme |
| `/besoins` | État des Besoins |
| `/fc-mc/{id}` | Fichier Central — Matériel Consomptible |
| `/fc-mnc/{id}` | Fichier Central — Matériel Non Consomptible |
| `/rsr` | Registre de Suivi des Ressources |
| `/registre-matiere` | Registre Matière |
| `/rgbi` | Registre Général des Biens Immobiliers |
| `/pv-cession` | Procès-Verbal de Cession / Transfert |
| `/pv-perte-vol` | Procès-Verbal de Perte / Vol |
| `/pv-reforme` | Procès-Verbal de Réforme |

### 5. Modale dans le JSX

Ajouter une seule fois à la fin du `return` :

```tsx
<PdfPreviewModal
  url={pdfUrl}
  title={pdfTitle}
  onClose={() => setPdfUrl(null)}
/>
```

La fonction `openPdf` et le composant `BtnPdf` sont mis à jour en conséquence.

---

## Hors scope

- Pagination ou zoom dans la prévisualisation (géré nativement par le navigateur)
- Téléchargement direct (le bouton "Imprimer" ouvre dans un onglet où l'utilisateur peut aussi télécharger)
- Changements backend
