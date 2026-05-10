// src/pages/Aides.jsx
import { useEffect, useState } from 'react';
import { EtablissementAPI } from '../data/api';

export default function Aides({ navigate }) {
  const [etab, setEtab] = useState(null);

  useEffect(() => {
    EtablissementAPI.get().then(setEtab).catch(() => {});
  }, []);

  const sections = [
    {
      titre: 'Connexion',
      couleur: '#e8eaf6',
      icone: '🔐',
      contenu: [
        { q: 'Comment se connecter ?', r: 'Sur la page d\'accueil, saisissez votre nom d\'utilisateur et votre mot de passe, puis cliquez sur "Se connecter". Un token JWT est généré et maintient votre session active.' },
        { q: 'Comment se déconnecter ?', r: 'Cliquez sur le bouton "Déconnexion" en haut à droite de l\'écran. Votre session est immédiatement fermée.' },
        { q: 'Que faire si les identifiants sont incorrects ?', r: 'Un message "Identifiants incorrects" s\'affiche. Vérifiez votre nom d\'utilisateur et mot de passe, puis réessayez.' },
      ],
    },
    {
      titre: 'Nouvelle Affectation',
      couleur: '#faeeda',
      icone: '📋',
      contenu: [
        { q: 'Comment créer une nouvelle affectation ?', r: 'Cliquez sur "Nouvelle Facture" depuis l\'accueil. La fenêtre "Affectation" s\'ouvre avec les boutons de navigation (début, précédent, suivant, dernier) et la date du jour.' },
        { q: 'Comment sélectionner un Destinataire ?', r: 'Utilisez la grille en haut pour rechercher et sélectionner l\'employé (Destinataire). Les champs Clé et informations se remplissent automatiquement.' },
        { q: 'Comment indiquer le Fait par (vendeur) ?', r: 'Le champ "Fait par" affiche le vendeur responsable de l\'affectation. Sélectionnez-le dans la liste déroulante.' },
        { q: 'Comment ajouter des articles ?', r: 'Dans la grille du bas, sélectionnez un article (N° article), saisissez la quantité et le prix unitaire. Plusieurs lignes peuvent être ajoutées.' },
        { q: 'Comment enregistrer une affectation ?', r: 'Cliquez sur "Sauvegarder" pour enregistrer. Utilisez "Annuler" pour annuler les modifications ou "Fermer" pour quitter sans sauvegarder.' },
        { q: 'Le stock est-il mis à jour automatiquement ?', r: 'Oui. À chaque nouvelle affectation enregistrée, la quantité disponible de chaque article est automatiquement décrémentée dans le stock.' },
      ],
    },
    {
      titre: 'Recherche — Affectation par Employé',
      couleur: '#e6f1fb',
      icone: '🔍',
      contenu: [
        { q: 'Comment accéder à la recherche ?', r: 'Cliquez sur "Recherche" depuis l\'accueil pour ouvrir la fenêtre "Affectation par Employé".' },
        { q: 'Quels champs sont affichés ?', r: 'Clé Em, Employé, Téléphone, Dernière Aff, N° Emp, Date, Date Effective et Total. La colonne AmountPaid est masquée.' },
        { q: 'Comment filtrer les résultats ?', r: 'Cliquez sur "Définir Requête" pour saisir vos critères de filtrage, puis "Exécuter Requête" pour appliquer le filtre.' },
        { q: 'Comment modifier un enregistrement ?', r: 'Sélectionnez une ligne dans la grille et cliquez sur "Modifier" pour ouvrir le formulaire d\'édition.' },
      ],
    },
    {
      titre: 'Articles — Parcourir les articles',
      couleur: '#eaf3de',
      icone: '📦',
      contenu: [
        { q: 'Comment accéder aux articles ?', r: 'Cliquez sur "Articles" depuis l\'accueil pour ouvrir "Parcourir les articles".' },
        { q: 'Que signifient Disponible et Indisponible ?', r: '"Disponible" indique la quantité en stock. "Indisponible" (Backorders) indique les articles en rupture ou en attente de réapprovisionnement.' },
        { q: 'Comment modifier un article ?', r: 'Sélectionnez l\'article dans la grille et cliquez sur "Modifier". Le formulaire affiche la Clé article, la désignation et le stock.' },
        { q: 'Comment fermer la fenêtre ?', r: 'Cliquez sur "Fermer" pour revenir au menu principal.' },
      ],
    },
    {
      titre: 'Approvisionnements',
      couleur: '#f0fdf4',
      icone: '🚚',
      contenu: [
        { q: 'Comment créer un approvisionnement ?', r: 'Cliquez sur "Approvision." depuis l\'accueil. Cliquez sur "+ Nouveau", saisissez la date, la référence, le fournisseur et les lignes d\'articles avec quantités et prix d\'achat.' },
        { q: 'Comment valider un approvisionnement ?', r: 'Une fois créé, l\'approvisionnement est "En attente". Cliquez sur "✅ Valider stock" pour confirmer la réception : le stock est automatiquement incrémenté.' },
        { q: 'Peut-on supprimer un approvisionnement ?', r: 'Oui, cliquez sur l\'icône 🗑 sur la ligne de l\'approvisionnement à supprimer (seulement si non encore validé).' },
      ],
    },
    {
      titre: 'Retours clients',
      couleur: '#fff7ed',
      icone: '↩️',
      contenu: [
        { q: 'Comment enregistrer un retour ?', r: 'Cliquez sur "Retours" depuis l\'accueil, puis "+ Nouveau retour". Indiquez la facture d\'origine (optionnel), la date, le motif et les articles retournés avec quantités.' },
        { q: 'Comment accepter un retour ?', r: 'Sur la ligne du retour "En attente", cliquez sur "✅ Accepter". Le stock des articles retournés est automatiquement recrédité.' },
        { q: 'Comment refuser un retour ?', r: 'Cliquez sur "❌ Refuser" sur la ligne du retour. Le statut passe à "Refusé" et le stock n\'est pas modifié.' },
      ],
    },
    {
      titre: 'États — Choix Rapports',
      couleur: '#fdf2f8',
      icone: '📊',
      contenu: [
        { q: 'Comment accéder aux rapports ?', r: 'Cliquez sur "États" depuis l\'accueil pour ouvrir "Choix Rapports".' },
        { q: 'Quels rapports sont disponibles ?', r: 'Trois rapports : "État Employés" (liste des clients/employés), "État des affectations" (liste des affectations par employé), "État des Factures" (détail de chaque facture).' },
        { q: 'Comment afficher un rapport ?', r: 'Sélectionnez le rapport souhaité puis cliquez sur "Afficher" ou "Imprimer" pour ouvrir l\'Affichage avant impression.' },
        { q: 'Comment naviguer dans l\'aperçu ?', r: 'Utilisez les boutons |◄ ◄ ► ►| pour naviguer entre les pages. Le zoom est ajustable de 50% à 150%.' },
        { q: 'Comment imprimer ?', r: 'Dans l\'Affichage avant impression, cliquez sur l\'icône 🖨 pour lancer l\'impression. Cliquez sur "Fermer" pour revenir.' },
        { q: 'L\'en-tête des rapports affiche-t-il les informations de l\'établissement ?', r: 'Oui. Chaque page de rapport affiche automatiquement : la République, le Ministère, la Wilaya et le Centre (CFPA) en haut, et le nom du centre avec la date en bas.' },
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
        Consultez les questions fréquentes pour chaque section de {etab?.centre || 'l\'application'}.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <a href="/aide.pdf" target="_blank" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 18px', background: '#0a246a', color: '#fff',
          borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 600,
        }}>
          📄 Ouvrir le guide d'utilisation (PDF)
        </a>
      </div>

      {sections.map(s => (
        <div key={s.titre} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
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
        <strong style={{ color: '#1a1a1a' }}>{etab?.centre || 'Application'} — v1.0</strong><br />
        {etab?.wilaya && <>{etab.wilaya}<br /></>}
        Pour ajouter de nouvelles fonctionnalités, contactez votre administrateur système.
      </div>
    </div>
  );
}
