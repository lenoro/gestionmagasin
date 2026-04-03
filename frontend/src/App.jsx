// src/App.jsx
import { useState } from 'react';
import './styles/global.css';

import Accueil    from './pages/Accueil';
import Recherche  from './pages/Recherche';
import Articles   from './pages/Articles';
import Aides      from './pages/Aides';
import OrderForm  from './pages/OrderForm';
import Etats      from './pages/Etats';

const PAGES = {
  accueil:   Accueil,
  recherche: Recherche,
  articles:  Articles,
  aides:     Aides,
  etats:     Etats,
};

export default function App() {
  const [page, setPage] = useState('accueil');

  if (page === 'orderform') return <OrderForm navigate={setPage} />;
  if (page === 'etats')     return <Etats     navigate={setPage} />;

  const PageComponent = PAGES[page] || Accueil;
  return (
    <div className="app-container">
      <PageComponent navigate={setPage} />
    </div>
  );
}
