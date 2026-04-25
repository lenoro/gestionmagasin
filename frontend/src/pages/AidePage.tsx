import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Types ───────────────────────────────────────────────────────────────────

interface SectionProps {
  id: string
  emoji: string
  title: string
  color: string
  children: React.ReactNode
  open: boolean
  onToggle: () => void
}

interface TipProps {
  children: React.ReactNode
}

interface StepProps {
  num: number
  children: React.ReactNode
}

// ─── Composants utilitaires ──────────────────────────────────────────────────

function Section({ id, emoji, title, color, children, open, onToggle }: SectionProps) {
  return (
    <div id={id} className="bg-white rounded-lg shadow mb-3 overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-5 py-4 text-left font-semibold text-white ${color} hover:opacity-90 transition-opacity`}
      >
        <span className="text-xl">{emoji}</span>
        <span className="flex-1">{title}</span>
        <span className="text-white/70 text-sm">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-6 py-5 text-sm text-gray-700 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

function Tip({ children }: TipProps) {
  return (
    <div className="flex gap-2 bg-blue-50 border border-blue-200 rounded px-3 py-2 text-blue-800 text-xs">
      <span>💡</span><span>{children}</span>
    </div>
  )
}

function Step({ num, children }: StepProps) {
  return (
    <div className="flex gap-3 items-start">
      <span className="shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center mt-0.5">{num}</span>
      <span>{children}</span>
    </div>
  )
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-1">{children}</h3>
}

// ─── Page principale ─────────────────────────────────────────────────────────


export default function AidePage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState<string | null>('connexion')

  const toggle = (id: string) => setOpen(prev => prev === id ? null : id)
  const isOpen = (id: string) => open === id

  const jumpTo = (id: string) => {
    setOpen(id)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Guide d'utilisation</h1>
        <p className="text-sm text-gray-500">
          Application GestionMagasin — Centre de Formation Professionnelle et de l'Apprentissage
        </p>
      </div>

      {/* Accès rapide */}
      <div className="bg-white rounded-lg shadow p-4 mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Accès rapide</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'connexion',    label: '🔐 Connexion' },
            { id: 'dashboard',   label: '📊 Tableau de bord' },
            { id: 'stock',       label: '📦 Gestion Stock' },
            { id: 'inventaire',  label: '🗂 Inventaire CFPA' },
            { id: 'etats',       label: '📄 États & Fiches' },
            { id: 'rapports',    label: '📈 Rapports CFPA' },
            { id: 'reparations', label: '🔧 Réparations' },
            { id: 'carburant',   label: '⛽ Carburant' },
            { id: 'bibliotheque',label: '📚 Bibliothèque' },
            { id: 'commercial',  label: '🛒 Commercial' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => jumpTo(id)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-full transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Connexion ──────────────────────────────────────────────── */}
      <Section id="connexion" emoji="🔐" title="Connexion et Déconnexion"
        color="bg-slate-700" open={isOpen('connexion')} onToggle={() => toggle('connexion')}>
        <SubTitle>Se connecter</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Accéder à <strong>gestionmagasin.infserv.ca</strong> depuis votre navigateur.</Step>
          <Step num={2}>Saisir votre <strong>identifiant</strong> (ex. : <code className="bg-gray-100 px-1 rounded">admin</code>) et votre <strong>mot de passe</strong>.</Step>
          <Step num={3}>Cliquer sur <strong>Se connecter</strong>. Le tableau de bord s'affiche.</Step>
        </div>
        <Tip>La session reste active jusqu'à déconnexion explicite. Pas besoin de vous reconnecter à chaque visite.</Tip>

        <SubTitle>Se déconnecter</SubTitle>
        <p>Cliquer sur l'icône <strong>↪ (flèche)</strong> en bas à gauche de la barre latérale, à côté de votre nom. Vous serez renvoyé vers la page de connexion.</p>

        <SubTitle>Comptes disponibles</SubTitle>
        <table className="w-full text-xs border border-gray-200 rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2">Identifiant</th>
              <th className="text-left px-3 py-2">Mot de passe</th>
              <th className="text-left px-3 py-2">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['admin', '123', 'Administrateur'],
              ['directeur', '123', 'Directeur'],
              ['magasinier', '123', 'Magasinier'],
            ].map(([u, p, r]) => (
              <tr key={u} className="border-t">
                <td className="px-3 py-1.5 font-mono font-medium">{u}</td>
                <td className="px-3 py-1.5 font-mono">{p}</td>
                <td className="px-3 py-1.5 text-gray-600">{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* ── Tableau de bord ────────────────────────────────────────── */}
      <Section id="dashboard" emoji="📊" title="Tableau de bord"
        color="bg-blue-700" open={isOpen('dashboard')} onToggle={() => toggle('dashboard')}>
        <p>Le tableau de bord s'affiche à l'ouverture de l'application. Il donne une vue d'ensemble de l'activité :</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li><strong>Alertes consomptibles</strong> — articles sous le seuil minimum de stock.</li>
          <li><strong>Demandes en attente</strong> — bons de sortie non encore traités.</li>
          <li><strong>Bons du jour</strong> — mouvements d'entrée et de sortie créés aujourd'hui.</li>
          <li><strong>KPIs Commercial</strong> — nombre de factures, payées / impayées, alertes stock GS.</li>
          <li><strong>Derniers bons</strong> — les 5 derniers bons d'entrée et de sortie avec leur statut.</li>
        </ul>
        <Tip>Cliquez sur n'importe quelle carte KPI pour accéder directement à la liste correspondante.</Tip>
        <div className="mt-2">
          <SubTitle>Accès rapide depuis le tableau de bord</SubTitle>
          <div className="flex flex-wrap gap-2 mt-1">
            {['Bon d\'entrée', 'Bon de sortie', 'Nouveau bien', 'État des besoins'].map(l => (
              <span key={l} className="px-2 py-1 bg-slate-700 text-white text-xs rounded">{l}</span>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">Ces boutons créent directement un nouveau document sans passer par la liste.</p>
        </div>
      </Section>

      {/* ── Gestion Stock ──────────────────────────────────────────── */}
      <Section id="stock" emoji="📦" title="Gestion Stock (GS)"
        color="bg-emerald-700" open={isOpen('stock')} onToggle={() => toggle('stock')}>
        <p>Le module Stock gère les produits, les mouvements d'entrée/sortie et les référentiels.</p>

        <SubTitle>Référentiels (Familles, Unités, Dépôts, Fournisseurs, Grades, Fonctions, Services, Employés)</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Accéder à la liste depuis la barre latérale.</Step>
          <Step num={2}>Cliquer sur <strong>Nouveau</strong> pour créer un enregistrement.</Step>
          <Step num={3}>Remplir les champs puis <strong>Enregistrer</strong>.</Step>
          <Step num={4}>Pour modifier : cliquer sur la ligne ou l'icône ✏️. Pour supprimer : icône 🗑️.</Step>
        </div>
        <Tip>Ces référentiels sont utilisés dans les formulaires de produits et de bons. Créez-les avant de créer des produits.</Tip>

        <SubTitle>Produits</SubTitle>
        <ul className="list-disc list-inside space-y-1">
          <li>Chaque produit appartient à une <strong>famille</strong> et a une <strong>unité</strong>.</li>
          <li>Définir un <strong>stock minimum</strong> déclenche une alerte sur le tableau de bord si le stock actuel descend en dessous.</li>
          <li>Le <strong>stock actuel</strong> est mis à jour automatiquement à chaque bon d'entrée ou de sortie.</li>
        </ul>

        <SubTitle>Réceptions (Bons d'entrée)</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Aller dans <strong>Réceptions</strong> → <strong>Nouveau</strong>.</Step>
          <Step num={2}>Choisir le <strong>fournisseur</strong> et la <strong>date</strong>.</Step>
          <Step num={3}>Ajouter les <strong>lignes d'articles</strong> avec quantité et prix unitaire.</Step>
          <Step num={4}>Enregistrer. Le stock est mis à jour immédiatement.</Step>
        </div>

        <SubTitle>Sorties stock</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Aller dans <strong>Sorties stock</strong> → <strong>Nouveau</strong>.</Step>
          <Step num={2}>Choisir le <strong>dépôt</strong> et le <strong>destinataire</strong>.</Step>
          <Step num={3}>Ajouter les articles et quantités.</Step>
          <Step num={4}>Enregistrer. Le stock se décrémente automatiquement.</Step>
        </div>
        <Tip>Un bon de sortie ne peut pas être supprimé une fois validé pour garantir la traçabilité.</Tip>
      </Section>

      {/* ── Inventaire CFPA ────────────────────────────────────────── */}
      <Section id="inventaire" emoji="🗂" title="Inventaire CFPA (Biens MFP)"
        color="bg-indigo-700" open={isOpen('inventaire')} onToggle={() => toggle('inventaire')}>
        <p>Ce module gère les biens <strong>consomptibles</strong> (articles consommés) et <strong>non-consomptibles</strong> (équipements durables) du CFPA selon les normes MFP.</p>

        <SubTitle>Biens inventaire (Grand Livre)</SubTitle>
        <ul className="list-disc list-inside space-y-1">
          <li>Liste de tous les biens non-consomptibles avec leur <strong>numéro d'inventaire</strong>.</li>
          <li>Cliquer sur un bien pour accéder à sa <strong>fiche détaillée</strong>.</li>
          <li>Chaque bien est affecté à un <strong>service</strong> et peut avoir un <strong>état</strong> : En service, Hors service, Réformé…</li>
        </ul>
        <button onClick={() => navigate('/inventaire/nouveau')}
          className="mt-1 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">
          + Créer un bien
        </button>

        <SubTitle>Bons d'entrée CFPA</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Aller dans <strong>Bons d'entrée</strong> → <strong>Nouveau</strong>.</Step>
          <Step num={2}>Renseigner le <strong>numéro de bon</strong>, la <strong>date</strong> et le <strong>fournisseur</strong>.</Step>
          <Step num={3}>Ajouter les articles (consomptibles) ou biens (non-consomptibles) avec quantités.</Step>
          <Step num={4}><strong>Valider</strong> le bon pour l'intégrer au stock.</Step>
        </div>

        <SubTitle>Bons de sortie CFPA</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Aller dans <strong>Bons de sortie</strong> → <strong>Nouveau</strong>.</Step>
          <Step num={2}>Choisir le <strong>demandeur / consommateur</strong> et le <strong>service de destination</strong>.</Step>
          <Step num={3}>Ajouter les articles demandés.</Step>
          <Step num={4}>Enregistrer en statut <strong>EN_ATTENTE</strong> pour validation, ou directement <strong>TRAITÉ</strong>.</Step>
        </div>
        <Tip>Les bons en statut EN_ATTENTE apparaissent en orange sur le tableau de bord. Pensez à les traiter régulièrement.</Tip>

        <SubTitle>Demandeurs / Consommateurs et Stagiaires</SubTitle>
        <p>Ces référentiels permettent d'associer les bons de sortie à une personne ou un groupe précis. Les stagiaires constituent une catégorie spéciale de consommateurs.</p>

        <SubTitle>État des besoins</SubTitle>
        <p>Affiche automatiquement les articles dont le stock est <strong>sous le seuil minimum</strong>. Utilisé pour déclencher les commandes fournisseurs.</p>
        <button onClick={() => navigate('/etat-besoins')}
          className="mt-1 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">
          Voir l'état des besoins
        </button>
      </Section>

      {/* ── États et Fiches ────────────────────────────────────────── */}
      <Section id="etats" emoji="📄" title="États et Fiches MFP"
        color="bg-rose-700" open={isOpen('etats')} onToggle={() => toggle('etats')}>
        <p>Cette page regroupe les <strong>12 documents réglementaires MFP</strong>. Chaque document est paramétrable (dates, articles, biens) avant génération.</p>

        <SubTitle>Comment générer et imprimer un document</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Aller dans <strong>États &amp; fiches</strong> dans la barre latérale.</Step>
          <Step num={2}>Renseigner les <strong>critères</strong> du document (dates de début/fin, article, bien…).</Step>
          <Step num={3}>Cliquer sur <strong>👁 Aperçu</strong>. Le document s'affiche dans une fenêtre de prévisualisation.</Step>
          <Step num={4}>Dans la fenêtre, cliquer sur <strong>🖨 Imprimer</strong> pour ouvrir le PDF dans un onglet et lancer l'impression.</Step>
          <Step num={5}>Fermer la fenêtre avec ✕ ou la touche <kbd className="bg-gray-100 border border-gray-300 rounded px-1">Échap</kbd>.</Step>
        </div>
        <Tip>Cliquer sur le fond sombre autour du document ferme aussi la prévisualisation.</Tip>

        <SubTitle>Liste des 12 documents disponibles</SubTitle>
        <table className="w-full text-xs border border-gray-200 rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2">Référence MFP</th>
              <th className="text-left px-3 py-2">Document</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['MFP/G/CMM/BJR/01', 'Bulletin Journalier de Réception'],
              ['MFP/G/CMM/EJS/01', 'État Journalier des Sorties'],
              ['MFP/G/CMM/REF/01', 'État du Matériel à Proposer à la Réforme'],
              ['MFP/G/CMM/BES/01', 'État des Besoins'],
              ['MFP/G/CMM/FC-MC/01', 'Fichier Central — Matériel Consomptible'],
              ['MFP/G/CMM/FC-MNC/01', 'Fichier Central — Matériel Non Consomptible'],
              ['MFP/G/CMM/RSR/01', 'Registre de Suivi des Ressources'],
              ['MFP/G/CMM/RM/01', 'Registre Matière'],
              ['MFP/G/CMM/RGBI/01', 'Registre Général des Biens Immobiliers'],
              ['MFP/G/CMM/PVC/01', 'Procès-Verbal de Cession / Transfert'],
              ['MFP/G/CMM/PVP/01', 'Procès-Verbal de Perte / Vol'],
              ['MFP/G/CMM/PVR/01', 'Procès-Verbal de Réforme'],
            ].map(([ref, label]) => (
              <tr key={ref} className="border-t">
                <td className="px-3 py-1.5 font-mono text-gray-500">{ref}</td>
                <td className="px-3 py-1.5 font-medium">{label}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => navigate('/etats')}
          className="mt-2 px-3 py-1.5 bg-rose-600 text-white text-xs rounded hover:bg-rose-700">
          Ouvrir États &amp; Fiches
        </button>
      </Section>

      {/* ── Rapports CFPA ──────────────────────────────────────────── */}
      <Section id="rapports" emoji="📈" title="Rapports CFPA"
        color="bg-violet-700" open={isOpen('rapports')} onToggle={() => toggle('rapports')}>
        <p>La page Rapports CFPA offre <strong>7 rapports analytiques</strong> exportables en PDF ou Excel, avec filtres avancés.</p>

        <SubTitle>Rapports disponibles</SubTitle>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Registre de consommation</strong> — sorties filtrées par période, affectation ou consommateur.</li>
          <li><strong>État des besoins</strong> — articles sous seuil de stock minimum.</li>
          <li><strong>Grand Livre d'inventaire</strong> — tous les biens non-consomptibles.</li>
          <li><strong>Fiche bien</strong> — détail d'un bien par son identifiant.</li>
          <li><strong>Registre des entrées</strong> — bons d'entrée filtrés par période et fournisseur.</li>
          <li><strong>Registre des sorties</strong> — bons de sortie filtrés par période et service.</li>
          <li><strong>Bordereau de transmission</strong> — bordereau d'un bon de sortie précis.</li>
        </ul>

        <SubTitle>Exporter un rapport</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Choisir le rapport dans la liste.</Step>
          <Step num={2}>Renseigner les <strong>filtres</strong> (dates, affectation, consommateur…).</Step>
          <Step num={3}>Cliquer sur <strong>📄 PDF</strong> pour télécharger en PDF, ou <strong>📊 Excel</strong> pour le tableur.</Step>
        </div>
        <Tip>Les rapports PDF et Excel utilisent les mêmes filtres. Si aucune date n'est saisie, le rapport couvre toute la période.</Tip>
        <button onClick={() => navigate('/rapports')}
          className="mt-1 px-3 py-1.5 bg-violet-600 text-white text-xs rounded hover:bg-violet-700">
          Ouvrir les Rapports CFPA
        </button>
      </Section>

      {/* ── Réparations ────────────────────────────────────────────── */}
      <Section id="reparations" emoji="🔧" title="Réparations (Registre RSR)"
        color="bg-orange-700" open={isOpen('reparations')} onToggle={() => toggle('reparations')}>
        <p>Le module RSR (Registre de Suivi des Réparations) trace les interventions de maintenance sur les biens du CFPA.</p>

        <SubTitle>Créer une fiche de réparation</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Aller dans <strong>Fiches RSR</strong> → <strong>Nouveau</strong>.</Step>
          <Step num={2}>Sélectionner le <strong>bien concerné</strong> dans la liste des biens inventoriés.</Step>
          <Step num={3}>Décrire la <strong>panne</strong>, la <strong>date de prise en charge</strong> et le <strong>technicien</strong>.</Step>
          <Step num={4}>Renseigner la <strong>date de retour</strong> et le <strong>coût</strong> une fois la réparation terminée.</Step>
          <Step num={5}>Enregistrer. La fiche est archivée dans le registre RSR.</Step>
        </div>
        <Tip>Chaque fiche RSR peut être imprimée directement depuis la page de détail (icône imprimante).</Tip>
      </Section>

      {/* ── Carburant ──────────────────────────────────────────────── */}
      <Section id="carburant" emoji="⛽" title="Gestion du Carburant"
        color="bg-yellow-700" open={isOpen('carburant')} onToggle={() => toggle('carburant')}>
        <p>Ce module suit la consommation de carburant des véhicules du CFPA via des bons d'approvisionnement et de distribution.</p>

        <SubTitle>Référentiel Véhicules</SubTitle>
        <p>Créer chaque véhicule (matricule, marque, modèle) avant de saisir des bons de carburant.</p>

        <SubTitle>Bons d'approvisionnement</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Aller dans <strong>Approvisionnement</strong> → <strong>Nouveau</strong>.</Step>
          <Step num={2}>Choisir la <strong>date</strong>, le <strong>fournisseur</strong> et la <strong>quantité</strong> en litres.</Step>
          <Step num={3}>Enregistrer pour créditer le stock de carburant.</Step>
        </div>

        <SubTitle>Bons de distribution</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Aller dans <strong>Distributions</strong> → <strong>Nouveau</strong>.</Step>
          <Step num={2}>Sélectionner le <strong>véhicule</strong>, le <strong>chauffeur</strong> et la <strong>quantité distribuée</strong>.</Step>
          <Step num={3}>Enregistrer. Le stock de carburant se décrémente automatiquement.</Step>
        </div>
        <Tip>Le solde de carburant disponible s'affiche en haut de la liste des distributions. Une alerte apparaît si le stock est insuffisant.</Tip>
      </Section>

      {/* ── Bibliothèque ───────────────────────────────────────────── */}
      <Section id="bibliotheque" emoji="📚" title="Bibliothèque"
        color="bg-teal-700" open={isOpen('bibliotheque')} onToggle={() => toggle('bibliotheque')}>
        <p>La bibliothèque répertorie les ouvrages pédagogiques et documentaires du CFPA.</p>

        <SubTitle>Ajouter un ouvrage</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Aller dans <strong>Ouvrages</strong> → <strong>Nouveau</strong>.</Step>
          <Step num={2}>Saisir le <strong>titre</strong>, l'<strong>auteur</strong>, l'<strong>ISBN</strong>, l'<strong>éditeur</strong> et la <strong>catégorie</strong>.</Step>
          <Step num={3}>Indiquer le <strong>nombre d'exemplaires</strong> disponibles.</Step>
          <Step num={4}>Enregistrer. L'ouvrage apparaît dans la liste et est consultable.</Step>
        </div>

        <SubTitle>Rechercher un ouvrage</SubTitle>
        <p>La liste des ouvrages dispose d'un <strong>champ de recherche</strong> en haut pour filtrer par titre, auteur ou ISBN en temps réel.</p>
        <Tip>Cliquer sur un ouvrage dans la liste ouvre sa fiche complète avec tous les détails bibliographiques.</Tip>
      </Section>

      {/* ── Commercial ─────────────────────────────────────────────── */}
      <Section id="commercial" emoji="🛒" title="Module Commercial"
        color="bg-pink-700" open={isOpen('commercial')} onToggle={() => toggle('commercial')}>
        <p>Le module Commercial gère la facturation client du CFPA (ventes, prestations…).</p>

        <SubTitle>Référentiels</SubTitle>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Articles</strong> — produits ou services vendus, avec prix unitaire.</li>
          <li><strong>Clients</strong> — personnes morales ou physiques facturées.</li>
          <li><strong>Vendeurs</strong> — agents responsables des ventes.</li>
        </ul>
        <Tip>Créez d'abord les articles, clients et vendeurs avant de saisir une facture.</Tip>

        <SubTitle>Créer une facture</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Aller dans <strong>Factures</strong> → <strong>Nouveau</strong>.</Step>
          <Step num={2}>Choisir le <strong>client</strong> et le <strong>vendeur</strong>.</Step>
          <Step num={3}>Ajouter les <strong>lignes</strong> (article + quantité). Le montant total se calcule automatiquement.</Step>
          <Step num={4}>Enregistrer. La facture est créée avec le statut <strong>IMPAYÉ</strong>.</Step>
        </div>

        <SubTitle>Marquer une facture comme payée</SubTitle>
        <div className="space-y-2">
          <Step num={1}>Ouvrir la fiche de la facture depuis la liste.</Step>
          <Step num={2}>Cliquer sur <strong>Marquer comme payée</strong>. Le statut passe à <strong>PAYÉ</strong>.</Step>
        </div>
        <Tip>Le tableau de bord affiche en temps réel le nombre de factures payées et impayées.</Tip>

        <button onClick={() => navigate('/factures/nouveau')}
          className="mt-1 px-3 py-1.5 bg-pink-600 text-white text-xs rounded hover:bg-pink-700">
          + Nouvelle facture
        </button>
      </Section>

      {/* Pied de page */}
      <div className="text-center text-xs text-gray-400 mt-6 pb-4">
        GestionMagasin — CFPA · Pour toute assistance, contacter l'administrateur système.
      </div>
    </div>
  )
}
