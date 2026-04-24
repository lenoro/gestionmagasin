import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom'
import InventaireListe from './pages/Inventaire/InventaireListe'
import InventaireForm from './pages/Inventaire/InventaireForm'
import InventaireFiche from './pages/Inventaire/InventaireFiche'
import BonEntreeListe from './pages/RGBI/BonEntreeListe'
import BonEntreeForm from './pages/RGBI/BonEntreeForm'
import BonEntreeFiche from './pages/RGBI/BonEntreeFiche'
import BonSortieListe from './pages/RGBI/BonSortieListe'
import BonSortieForm from './pages/RGBI/BonSortieForm'
import BonSortieFiche from './pages/RGBI/BonSortieFiche'
import FicheReparationListe from './pages/RSR/FicheReparationListe'
import FicheReparationForm from './pages/RSR/FicheReparationForm'
import FicheReparationFiche from './pages/RSR/FicheReparationFiche'
import VehiculeListe from './pages/Carburant/VehiculeListe'
import BonApproListe from './pages/Carburant/BonApproListe'
import BonApproForm from './pages/Carburant/BonApproForm'
import BonApproFiche from './pages/Carburant/BonApproFiche'
import BonDistribListe from './pages/Carburant/BonDistribListe'
import BonDistribForm from './pages/Carburant/BonDistribForm'
import BonDistribFiche from './pages/Carburant/BonDistribFiche'
import OuvrageListe from './pages/Bibliotheque/OuvrageListe'
import OuvrageForm from './pages/Bibliotheque/OuvrageForm'
import OuvrageFiche from './pages/Bibliotheque/OuvrageFiche'
import ArticleListe from './pages/Commercial/ArticleListe'
import ArticleForm from './pages/Commercial/ArticleForm'
import ClientListe from './pages/Commercial/ClientListe'
import ClientForm from './pages/Commercial/ClientForm'
import VendeurListe from './pages/Commercial/VendeurListe'
import VendeurForm from './pages/Commercial/VendeurForm'
import FactureListe from './pages/Commercial/FactureListe'
import FactureForm from './pages/Commercial/FactureForm'
import FactureFiche from './pages/Commercial/FactureFiche'
import FamilleListe from './pages/Stock/FamilleListe'
import FamilleForm from './pages/Stock/FamilleForm'
import UniteListe from './pages/Stock/UniteListe'
import UniteForm from './pages/Stock/UniteForm'
import DepotListe from './pages/Stock/DepotListe'
import DepotForm from './pages/Stock/DepotForm'
import EmployeListe from './pages/Stock/EmployeListe'
import EmployeForm from './pages/Stock/EmployeForm'
import FournisseurListe from './pages/Stock/FournisseurListe'
import FournisseurForm from './pages/Stock/FournisseurForm'
import ProduitListe from './pages/Stock/ProduitListe'
import ProduitForm from './pages/Stock/ProduitForm'
import BonEntreeListeGS from './pages/Stock/BonEntreeListe'
import BonEntreeFormGS from './pages/Stock/BonEntreeForm'
import BonEntreeFicheGS from './pages/Stock/BonEntreeFiche'
import BonSortieListeGS from './pages/Stock/BonSortieListe'
import BonSortieFormGS from './pages/Stock/BonSortieForm'
import BonSortieFicheGS from './pages/Stock/BonSortieFiche'
import StockLogin from './pages/Stock/StockLogin'
import GradeListe from './pages/Stock/GradeListe'
import GradeForm from './pages/Stock/GradeForm'
import FonctionListe from './pages/Stock/FonctionListe'
import FonctionForm from './pages/Stock/FonctionForm'
import ServiceRefListe from './pages/Stock/ServiceRefListe'
import ServiceRefForm from './pages/Stock/ServiceRefForm'
import EtatsPage from './pages/Etats/EtatsPage'
import Dashboard from './pages/Dashboard'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </p>
  )
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-blue-600 text-white font-semibold'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

function PageTitle() {
  const location = useLocation()
  const titles: Record<string, string> = {
    '/': 'Tableau de bord',
    '/inventaire': "Registre d'inventaire",
    '/bons-entree': "Bons d'entrée",
    '/bons-sortie': 'Bons de sortie',
    '/fiches-reparation': 'Fiches de réparation',
    '/vehicules': 'Gestion des véhicules',
    '/bons-approvisionnement': 'Approvisionnement carburant',
    '/bons-distribution': 'Distributions carburant',
    '/ouvrages': 'Registre des ouvrages',
    '/etats': 'États et fiches',
  }
  const base = '/' + location.pathname.split('/')[1]
  return (
    <header className="h-14 flex items-center px-6 bg-white border-b border-slate-200">
      <span className="text-slate-700 font-semibold">{titles[base] ?? 'Gestion Magasin'}</span>
    </header>
  )
}

function AppLayout() {
  const token = localStorage.getItem('gs_token')
  if (!token) return <Navigate to="/gs-login" replace />

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-800 flex flex-col shrink-0 overflow-y-auto">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 bg-slate-900 shrink-0">
          <span className="text-white font-bold text-lg tracking-tight">GestionMagasin</span>
        </div>

        <nav className="flex-1 px-2 pb-6">
          <NavItem to="/">Tableau de bord</NavItem>
          <SectionLabel>Gestion Stock</SectionLabel>
          <NavItem to="/produits">Produits</NavItem>
          <NavItem to="/familles">Familles</NavItem>
          <NavItem to="/unites">Unités</NavItem>
          <NavItem to="/fournisseurs">Fournisseurs</NavItem>
          <NavItem to="/depots">Dépôts</NavItem>
          <NavItem to="/employes">Employés</NavItem>
          <NavItem to="/grades">Grades</NavItem>
          <NavItem to="/fonctions">Fonctions</NavItem>
          <NavItem to="/services-ref">Services</NavItem>
          <NavItem to="/stock-entrees">Réceptions</NavItem>
          <NavItem to="/stock-sorties">Sorties stock</NavItem>

          <SectionLabel>Inventaire</SectionLabel>
          <NavItem to="/inventaire">Registre</NavItem>
          <NavItem to="/bons-entree">Bons d'entrée</NavItem>
          <NavItem to="/bons-sortie">Bons de sortie</NavItem>
          <NavItem to="/etats">États &amp; fiches</NavItem>

          <SectionLabel>Réparations</SectionLabel>
          <NavItem to="/fiches-reparation">Fiches RSR</NavItem>

          <SectionLabel>Carburant</SectionLabel>
          <NavItem to="/vehicules">Véhicules</NavItem>
          <NavItem to="/bons-approvisionnement">Approvisionnement</NavItem>
          <NavItem to="/bons-distribution">Distributions</NavItem>

          <SectionLabel>Bibliothèque</SectionLabel>
          <NavItem to="/ouvrages">Ouvrages</NavItem>

          <SectionLabel>Commercial</SectionLabel>
          <NavItem to="/articles">Articles</NavItem>
          <NavItem to="/clients">Clients</NavItem>
          <NavItem to="/vendeurs">Vendeurs</NavItem>
          <NavItem to="/factures">Factures</NavItem>
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <PageTitle />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/inventaire" element={<InventaireListe />} />
            <Route path="/inventaire/nouveau" element={<InventaireForm />} />
            <Route path="/inventaire/:id/edit" element={<InventaireForm />} />
            <Route path="/inventaire/:id" element={<InventaireFiche />} />
            <Route path="/bons-entree" element={<BonEntreeListe />} />
            <Route path="/bons-entree/nouveau" element={<BonEntreeForm />} />
            <Route path="/bons-entree/:id" element={<BonEntreeFiche />} />
            <Route path="/bons-sortie" element={<BonSortieListe />} />
            <Route path="/bons-sortie/nouveau" element={<BonSortieForm />} />
            <Route path="/bons-sortie/:id" element={<BonSortieFiche />} />
            <Route path="/fiches-reparation" element={<FicheReparationListe />} />
            <Route path="/fiches-reparation/nouveau" element={<FicheReparationForm />} />
            <Route path="/fiches-reparation/:id" element={<FicheReparationFiche />} />
            <Route path="/vehicules" element={<VehiculeListe />} />
            <Route path="/bons-approvisionnement" element={<BonApproListe />} />
            <Route path="/bons-approvisionnement/nouveau" element={<BonApproForm />} />
            <Route path="/bons-approvisionnement/:id" element={<BonApproFiche />} />
            <Route path="/bons-distribution" element={<BonDistribListe />} />
            <Route path="/bons-distribution/nouveau" element={<BonDistribForm />} />
            <Route path="/bons-distribution/:id" element={<BonDistribFiche />} />
            <Route path="/ouvrages" element={<OuvrageListe />} />
            <Route path="/ouvrages/nouveau" element={<OuvrageForm />} />
            <Route path="/ouvrages/:id/edit" element={<OuvrageForm />} />
            <Route path="/ouvrages/:id" element={<OuvrageFiche />} />
            <Route path="/articles" element={<ArticleListe />} />
            <Route path="/articles/nouveau" element={<ArticleForm />} />
            <Route path="/articles/:id/edit" element={<ArticleForm />} />
            <Route path="/clients" element={<ClientListe />} />
            <Route path="/clients/nouveau" element={<ClientForm />} />
            <Route path="/clients/:id/edit" element={<ClientForm />} />
            <Route path="/vendeurs" element={<VendeurListe />} />
            <Route path="/vendeurs/nouveau" element={<VendeurForm />} />
            <Route path="/vendeurs/:id/edit" element={<VendeurForm />} />
            <Route path="/factures" element={<FactureListe />} />
            <Route path="/factures/nouveau" element={<FactureForm />} />
            <Route path="/factures/:id" element={<FactureFiche />} />
            {/* Gestion Stock (port 8081) */}
            <Route path="/produits" element={<ProduitListe />} />
            <Route path="/produits/nouveau" element={<ProduitForm />} />
            <Route path="/produits/:id/edit" element={<ProduitForm />} />
            <Route path="/familles" element={<FamilleListe />} />
            <Route path="/familles/nouveau" element={<FamilleForm />} />
            <Route path="/familles/:id/edit" element={<FamilleForm />} />
            <Route path="/unites" element={<UniteListe />} />
            <Route path="/unites/nouveau" element={<UniteForm />} />
            <Route path="/unites/:id/edit" element={<UniteForm />} />
            <Route path="/fournisseurs" element={<FournisseurListe />} />
            <Route path="/fournisseurs/nouveau" element={<FournisseurForm />} />
            <Route path="/fournisseurs/:id/edit" element={<FournisseurForm />} />
            <Route path="/depots" element={<DepotListe />} />
            <Route path="/depots/nouveau" element={<DepotForm />} />
            <Route path="/depots/:id/edit" element={<DepotForm />} />
            <Route path="/employes" element={<EmployeListe />} />
            <Route path="/employes/nouveau" element={<EmployeForm />} />
            <Route path="/employes/:id/edit" element={<EmployeForm />} />
            <Route path="/stock-entrees" element={<BonEntreeListeGS />} />
            <Route path="/stock-entrees/nouveau" element={<BonEntreeFormGS />} />
            <Route path="/stock-entrees/:id" element={<BonEntreeFicheGS />} />
            <Route path="/stock-sorties" element={<BonSortieListeGS />} />
            <Route path="/stock-sorties/nouveau" element={<BonSortieFormGS />} />
            <Route path="/stock-sorties/:id" element={<BonSortieFicheGS />} />
            <Route path="/grades" element={<GradeListe />} />
            <Route path="/grades/new" element={<GradeForm />} />
            <Route path="/grades/:id" element={<GradeForm />} />
            <Route path="/fonctions" element={<FonctionListe />} />
            <Route path="/fonctions/new" element={<FonctionForm />} />
            <Route path="/fonctions/:id" element={<FonctionForm />} />
            <Route path="/services-ref" element={<ServiceRefListe />} />
            <Route path="/services-ref/new" element={<ServiceRefForm />} />
            <Route path="/services-ref/:id" element={<ServiceRefForm />} />
            <Route path="/etats" element={<EtatsPage />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/gs-login" element={<StockLogin />} />
      <Route path="/*" element={<AppLayout />} />
    </Routes>
  )
}
