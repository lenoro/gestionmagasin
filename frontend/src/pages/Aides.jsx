// src/pages/Aides.jsx
export default function Aides({ navigate }) {
  const sections = [
    {
      titre: 'Sortie — Bon de vente',
      couleur: '#faeeda',
      icone: '→',
      contenu: [
        { q: 'Comment créer un bon de sortie ?', r: 'Cliquez sur "Sortie" depuis l\'accueil. Sélectionnez d\'abord un client dans la grille, ajoutez ensuite les lignes d\'articles, saisissez les quantités et validez.' },
        { q: 'Comment choisir un article ?', r: 'Tapez la clé de l\'article directement (ex: A001) — la désignation et le prix se remplissent automatiquement. Ou cliquez sur ⊞ pour ouvrir le sélecteur d\'articles avec recherche.' },
        { q: 'Puis-je modifier le prix unitaire ?', r: 'Oui, le champ prix est modifiable sur chaque ligne, même après la sélection automatique.' },
      ],
    },
    {
      titre: 'Recherche',
      couleur: '#e6f1fb',
      icone: '◎',
      contenu: [
        { q: 'Que peut-on rechercher ?', r: 'La recherche couvre les articles (clé, désignation, catégorie) et les clients (ID, nom, adresse, téléphone). Utilisez les onglets pour basculer entre les deux.' },
        { q: 'La recherche est-elle sensible à la casse ?', r: 'Non, la recherche est insensible à la casse. Vous pouvez taper en minuscules ou majuscules.' },
      ],
    },
    {
      titre: 'Articles — Inventaire',
      couleur: '#eaf3de',
      icone: '▣',
      contenu: [
        { q: 'Comment ajouter un article ?', r: 'Cliquez sur "+ Nouvel article" depuis la page Articles, remplissez le formulaire (clé, désignation, catégorie, prix, stock, seuil d\'alerte) et confirmez.' },
        { q: 'Qu\'est-ce que le seuil d\'alerte ?', r: 'Lorsque le stock d\'un article passe en dessous de ce seuil, il apparaît en "Stock bas" (orange) ou "Rupture" (rouge) sur toutes les pages.' },
        { q: 'Comment modifier ou supprimer un article ?', r: 'Cliquez sur "Modifier" sur la ligne de l\'article. Le formulaire s\'ouvre avec les données actuelles. Le bouton "Supprimer" est disponible en bas du formulaire.' },
      ],
    },
  ];

  return (
    <div>
      <div className="topbar">
        <button className="btn" onClick={() => navigate('accueil')}>← Accueil</button>
        <span className="page-title">Aides</span>
      </div>

      <p style={{ fontSize: 13, color: '#888780', marginBottom: '1.5rem' }}>
        Consultez les questions fréquentes pour chaque section de GestionMagasin.
      </p>

      {sections.map(s => (
        <div key={s.titre} style={{ marginBottom: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 8,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: s.couleur,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700,
            }}>{s.icone}</div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{s.titre}</span>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {s.contenu.map((item, i) => (
              <div key={i} style={{
                padding: '14px 18px',
                borderBottom: i < s.contenu.length - 1 ? '1px solid #f0efea' : 'none',
              }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Q — {item.q}</div>
                <div style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.6 }}>R — {item.r}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{
        marginTop: 24, padding: '14px 18px',
        background: '#f5f5f3', borderRadius: 8,
        fontSize: 13, color: '#888780', lineHeight: 1.7,
      }}>
        <strong style={{ color: '#1a1a1a' }}>GestionMagasin v1.0</strong><br/>
        Application de gestion de magasin — interface React.<br/>
        Pour ajouter de nouvelles fonctionnalités, contactez votre administrateur système.
      </div>
    </div>
  );
}
