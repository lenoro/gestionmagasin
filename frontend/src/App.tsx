import { Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, Ruler, Truck, Warehouse, Users, Award, Briefcase, Building2,
  PackageCheck, PackageMinus, ClipboardList, ArrowDownCircle, ArrowUpCircle, FileText,
  Wrench, Car, Fuel, Share2, BookOpen, ShoppingBag, UserCircle, UserCheck, FileSpreadsheet,
  LogOut, ChevronRight, GraduationCap, AlertTriangle, BookMarked,
} from 'lucide-react'
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
import ProducteurListe from './pages/RGBI/ProducteurListe'
import AffectationListe from './pages/RGBI/AffectationListe'
import ConsommateurListe from './pages/RGBI/ConsommateurListe'
import StagiaireListe from './pages/RGBI/StagiaireListe'
import BienInventaireListe from './pages/RGBI/BienInventaireListe'
import EtatDesBesoins from './pages/RGBI/EtatDesBesoins'
import Dashboard from './pages/Dashboard'
import { ToastProvider } from './components/Toast'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </p>
  )
}

function NavItem({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-blue-600 text-white font-semibold'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`
      }
    >
      <span className="shrink-0 opacity-80">{icon}</span>
      {children}
    </NavLink>
  )
}

function PageTitle() {
  const location = useLocation()
  const titles: Record<string, string> = {
    '/': 'Tableau de bord',
    '/inventaire': "Registre d'inventaire",
    '/grand-livre': "Grand Livre d'Inventaire",
    '/bons-entree': "Bons d'entrée",
    '/bons-sortie': 'Bons de sortie',
    '/consommateurs': 'Demandeurs / Consommateurs',
    '/stagiaires': 'Stagiaires',
    '/etat-besoins': 'État des besoins',
    '/fiches-reparation': 'Fiches de réparation',
    '/vehicules': 'Gestion des véhicules',
    '/bons-approvisionnement': 'Approvisionnement carburant',
    '/bons-distribution': 'Distributions carburant',
    '/ouvrages': 'Registre des ouvrages',
    '/etats': 'États et fiches',
  }
  const parts = location.pathname.split('/').filter(Boolean)
  const base = parts.length ? '/' + parts[0] : '/'
  const title = titles[base] ?? 'Gestion Magasin'

  return (
    <header className="h-14 flex items-center px-6 bg-white border-b border-slate-200 gap-2">
      <span className="text-slate-700 font-semibold">{title}</span>
      {parts.length > 1 && (
        <>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-500 text-sm capitalize">
            {parts[parts.length - 1] === 'nouveau' ? 'Nouveau' : parts[parts.length - 1] === 'edit' ? 'Modifier' : `#${parts[parts.length - 1]}`}
          </span>
        </>
      )}
    </header>
  )
}

function UserFooter() {
  const navigate = useNavigate()
  const username = localStorage.getItem('gs_username') || 'admin'

  const handleLogout = () => {
    localStorage.removeItem('gs_token')
    localStorage.removeItem('gs_username')
    navigate('/gs-login')
  }

  return (
    <div className="shrink-0 border-t border-slate-700 px-3 py-3 flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
        {username.charAt(0).toUpperCase()}
      </div>
      <span className="text-slate-300 text-sm flex-1 truncate">{username}</span>
      <button onClick={handleLogout} title="Déconnexion"
        className="text-slate-400 hover:text-white transition-colors p-1 rounded">
        <LogOut size={16} />
      </button>
    </div>
  )
}

function AppLayout() {
  const token = localStorage.getItem('gs_token')
  if (!token) return <Navigate to="/gs-login" replace />

  return (
    <ToastProvider>
      <div className="flex h-screen bg-slate-100 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-slate-800 flex flex-col shrink-0">
          {/* Logo */}
          <div className="h-14 flex items-center px-4 bg-slate-900 shrink-0">
            <span className="text-white font-bold text-lg tracking-tight">GestionMagasin</span>
          </div>

          <nav className="flex-1 px-2 pb-2 overflow-y-auto">
            <div className="mt-2">
              <NavItem to="/" icon={<LayoutDashboard size={16} />}>Tableau de bord</NavItem>
            </div>

            <SectionLabel>Gestion Stock</SectionLabel>
            <NavItem to="/produits" icon={<Package size={16} />}>Produits</NavItem>
            <NavItem to="/familles" icon={<Tag size={16} />}>Familles</NavItem>
            <NavItem to="/unites" icon={<Ruler size={16} />}>Unités</NavItem>
            <NavItem to="/fournisseurs" icon={<Truck size={16} />}>Fournisseurs</NavItem>
            <NavItem to="/depots" icon={<Warehouse size={16} />}>Dépôts</NavItem>
            <NavItem to="/employes" icon={<Users size={16} />}>Employés</NavItem>
            <NavItem to="/grades" icon={<Award size={16} />}>Grades</NavItem>
            <NavItem to="/fonctions" icon={<Briefcase size={16} />}>Fonctions</NavItem>
            <NavItem to="/services-ref" icon={<Building2 size={16} />}>Services</NavItem>
            <NavItem to="/stock-entrees" icon={<PackageCheck size={16} />}>Réceptions</NavItem>
            <NavItem to="/stock-sorties" icon={<PackageMinus size={16} />}>Sorties stock</NavItem>

            <SectionLabel>Inventaire CFPA</SectionLabel>
            <NavItem to="/grand-livre" icon={<BookMarked size={16} />}>Grand Livre</NavItem>
            <NavItem to="/bons-entree" icon={<ArrowDownCircle size={16} />}>Bons d'entrée</NavItem>
            <NavItem to="/bons-sortie" icon={<ArrowUpCircle size={16} />}>Bons de sortie</NavItem>
            <NavItem to="/consommateurs" icon={<UserCheck size={16} />}>Demandeurs</NavItem>
            <NavItem to="/stagiaires" icon={<GraduationCap size={16} />}>Stagiaires</NavItem>
            <NavItem to="/affectations" icon={<Building2 size={16} />}>Affectations</NavItem>
            <NavItem to="/etat-besoins" icon={<AlertTriangle size={16} />}>État des besoins</NavItem>
            <NavItem to="/inventaire" icon={<ClipboardList size={16} />}>Biens inventaire</NavItem>
            <NavItem to="/etats" icon={<FileText size={16} />}>États &amp; fiches</NavItem>

            <SectionLabel>Réparations</SectionLabel>
            <NavItem to="/fiches-reparation" icon={<Wrench size={16} />}>Fiches RSR</NavItem>

            <SectionLabel>Carburant</SectionLabel>
            <NavItem to="/vehicules" icon={<Car size={16} />}>Véhicules</NavItem>
            <NavItem to="/bons-approvisionnement" icon={<Fuel size={16} />}>Approvisionnement</NavItem>
            <NavItem to="/bons-distribution" icon={<Share2 size={16} />}>Distributions</NavItem>

            <SectionLabel>Bibliothèque</SectionLabel>
            <NavItem to="/ouvrages" icon={<BookOpen size={16} />}>Ouvrages</NavItem>

            <SectionLabel>Commercial</SectionLabel>
            <NavItem to="/articles" icon={<ShoppingBag size={16} />}>Articles</NavItem>
            <NavItem to="/clients" icon={<UserCircle size={16} />}>Clients</NavItem>
            <NavItem to="/vendeurs" icon={<UserCheck size={16} />}>Vendeurs</NavItem>
            <NavItem to="/factures" icon={<FileSpreadsheet size={16} />}>Factures</NavItem>
          </nav>

          <UserFooter />
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
              <Route path="/producteurs" element={<ProducteurListe />} />
              <Route path="/affectations" element={<AffectationListe />} />
              <Route path="/consommateurs" element={<ConsommateurListe />} />
              <Route path="/stagiaires" element={<StagiaireListe />} />
              <Route path="/grand-livre" element={<BienInventaireListe />} />
              <Route path="/etat-besoins" element={<EtatDesBesoins />} />
              <Route path="/etats" element={<EtatsPage />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </ToastProvider>
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
