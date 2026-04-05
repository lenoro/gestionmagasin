// src/data/api.js
// Service centralisé pour les appels REST vers le backend Spring Boot
// En dev (localhost) : appel direct au backend sur port 8080
// En prod (VPS)      : appel relatif via proxy nginx /api/

const isLocal   = window.location.hostname === 'localhost';
const BASE_URL  = isLocal ? 'http://localhost:8080' : '';
const API_PREFIX = isLocal ? '' : '/api';

// Récupère le token JWT depuis localStorage
const getToken = () => localStorage.getItem('token');

// Headers avec JWT
const h = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}),
});

// Auth
export const AuthAPI = {
  login: (username, password) =>
    fetch(`${BASE_URL}${API_PREFIX}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }).then(r => {
      if (!r.ok) throw new Error('Identifiants incorrects');
      return r.json();
    }),
};

/* ══════════════════════════════════════
   CLIENTS
══════════════════════════════════════ */
export const ClientAPI = {
  getAll:    ()         => fetch(`${BASE_URL}${API_PREFIX}/clients`,              { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById:   (id)       => fetch(`${BASE_URL}${API_PREFIX}/clients/${id}`,        { headers: h() }).then(r => r.json()),
  getByCode: (code)     => fetch(`${BASE_URL}${API_PREFIX}/clients/code/${code}`, { headers: h() }).then(r => r.json()),
  search:    (name)     => fetch(`${BASE_URL}${API_PREFIX}/clients/search?name=${name}`, { headers: h() }).then(r => r.json()),
  create:    (data)     => fetch(`${BASE_URL}${API_PREFIX}/clients`,              { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  update:    (id, data) => fetch(`${BASE_URL}${API_PREFIX}/clients/${id}`,        { method: 'PUT',    headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  delete:    (id)       => fetch(`${BASE_URL}${API_PREFIX}/clients/${id}`,        { method: 'DELETE', headers: h() }).then(r => r.ok),
};

/* ══════════════════════════════════════
   ARTICLES
══════════════════════════════════════ */
export const ArticleAPI = {
  getAll:    ()         => fetch(`${BASE_URL}${API_PREFIX}/articles`,              { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById:   (id)       => fetch(`${BASE_URL}${API_PREFIX}/articles/${id}`,        { headers: h() }).then(r => r.json()),
  getByCode: (code)     => fetch(`${BASE_URL}${API_PREFIX}/articles/code/${code}`, { headers: h() }).then(r => r.json()),
  create:    (data)     => fetch(`${BASE_URL}${API_PREFIX}/articles`,              { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  update:    (id, data) => fetch(`${BASE_URL}${API_PREFIX}/articles/${id}`,        { method: 'PUT',    headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  delete:    (id)       => fetch(`${BASE_URL}${API_PREFIX}/articles/${id}`,        { method: 'DELETE', headers: h() }).then(r => r.ok),
};

/* ══════════════════════════════════════
   FACTURES
══════════════════════════════════════ */
export const FactureAPI = {
  getAll:      ()         => fetch(`${BASE_URL}${API_PREFIX}/factures`,                    { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById:     (id)       => fetch(`${BASE_URL}${API_PREFIX}/factures/${id}`,              { headers: h() }).then(r => r.json()),
  getByClient: (clientId) => fetch(`${BASE_URL}${API_PREFIX}/factures/client/${clientId}`, { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getByNumber: (num)      => fetch(`${BASE_URL}${API_PREFIX}/factures/number/${num}`,      { headers: h() }).then(r => r.json()),
  create:      (data)     => fetch(`${BASE_URL}${API_PREFIX}/factures`,                    { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  update:      (id, data) => fetch(`${BASE_URL}${API_PREFIX}/factures/${id}`,              { method: 'PUT',    headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  delete:      (id)       => fetch(`${BASE_URL}${API_PREFIX}/factures/${id}`,              { method: 'DELETE', headers: h() }).then(r => r.ok),
};

/* ══════════════════════════════════════
   ITEMS
══════════════════════════════════════ */
export const ItemAPI = {
  getByFacture: (factureId) => fetch(`${BASE_URL}${API_PREFIX}/factures/${factureId}/items`, { headers: h() }).then(r => r.json()),
  create:       (data)      => fetch(`${BASE_URL}${API_PREFIX}/items`,       { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  update:       (id, data)  => fetch(`${BASE_URL}${API_PREFIX}/items/${id}`, { method: 'PUT',    headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  delete:       (id)        => fetch(`${BASE_URL}${API_PREFIX}/items/${id}`, { method: 'DELETE', headers: h() }).then(r => r.ok),
};

/* ══════════════════════════════════════
   VENDEURS
══════════════════════════════════════ */
export const VendeurAPI = {
  getAll:    ()         => fetch(`${BASE_URL}${API_PREFIX}/vendeurs`,              { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById:   (id)       => fetch(`${BASE_URL}${API_PREFIX}/vendeurs/${id}`,        { headers: h() }).then(r => r.json()),
  getByCode: (code)     => fetch(`${BASE_URL}${API_PREFIX}/vendeurs/code/${code}`, { headers: h() }).then(r => r.json()),
  search:    (name)     => fetch(`${BASE_URL}${API_PREFIX}/vendeurs/search?name=${name}`, { headers: h() }).then(r => r.json()),
  create:    (data)     => fetch(`${BASE_URL}${API_PREFIX}/vendeurs`,              { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  update:    (id, data) => fetch(`${BASE_URL}${API_PREFIX}/vendeurs/${id}`,        { method: 'PUT',    headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  delete:    (id)       => fetch(`${BASE_URL}${API_PREFIX}/vendeurs/${id}`,        { method: 'DELETE', headers: h() }).then(r => r.ok),
};

/* ══════════════════════════════════════
   PRODUCTEURS
══════════════════════════════════════ */
export const ProducteurAPI = {
  getAll:  ()         => fetch(`${BASE_URL}${API_PREFIX}/producteurs`,       { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById: (id)       => fetch(`${BASE_URL}${API_PREFIX}/producteurs/${id}`, { headers: h() }).then(r => r.json()),
  create:  (data)     => fetch(`${BASE_URL}${API_PREFIX}/producteurs`,       { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  update:  (id, data) => fetch(`${BASE_URL}${API_PREFIX}/producteurs/${id}`, { method: 'PUT',    headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  delete:  (id)       => fetch(`${BASE_URL}${API_PREFIX}/producteurs/${id}`, { method: 'DELETE', headers: h() }).then(r => r.ok),
};

/* ══════════════════════════════════════
   APPROVISIONNEMENTS
══════════════════════════════════════ */
export const ApproAPI = {
  getAll:   ()     => fetch(`${BASE_URL}${API_PREFIX}/approvisionnements`,            { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : []),
  getById:  (id)   => fetch(`${BASE_URL}${API_PREFIX}/approvisionnements/${id}`,      { headers: h() }).then(r => r.json()),
  create:   (data) => fetch(`${BASE_URL}${API_PREFIX}/approvisionnements`,            { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  valider:  (id)   => fetch(`${BASE_URL}${API_PREFIX}/approvisionnements/${id}/valider`, { method: 'POST', headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }),
  delete:   (id)   => fetch(`${BASE_URL}${API_PREFIX}/approvisionnements/${id}`,      { method: 'DELETE', headers: h() }).then(r => r.ok),
};

/* ══════════════════════════════════════
   RETOURS
══════════════════════════════════════ */
export const RetourAPI = {
  getAll:   ()     => fetch(`${BASE_URL}${API_PREFIX}/retours`,            { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : []),
  getById:  (id)   => fetch(`${BASE_URL}${API_PREFIX}/retours/${id}`,      { headers: h() }).then(r => r.json()),
  create:   (data) => fetch(`${BASE_URL}${API_PREFIX}/retours`,            { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  accepter: (id)   => fetch(`${BASE_URL}${API_PREFIX}/retours/${id}/accepter`, { method: 'POST', headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }),
  refuser:  (id)   => fetch(`${BASE_URL}${API_PREFIX}/retours/${id}/refuser`,  { method: 'POST', headers: h() }).then(r => r.json()),
  delete:   (id)   => fetch(`${BASE_URL}${API_PREFIX}/retours/${id}`,      { method: 'DELETE', headers: h() }).then(r => r.ok),
};

/* ══════════════════════════════════════
   MOUVEMENTS STOCK
══════════════════════════════════════ */
export const MouvementAPI = {
  getAll:       ()        => fetch(`${BASE_URL}${API_PREFIX}/mouvements-stock`,                   { headers: h() }).then(r => r.json()).then(d => Array.isArray(d) ? d : []),
  getByArticle: (artId)   => fetch(`${BASE_URL}${API_PREFIX}/mouvements-stock/article/${artId}`,  { headers: h() }).then(r => r.json()).then(d => Array.isArray(d) ? d : []),
  ajuster:      (data)    => fetch(`${BASE_URL}${API_PREFIX}/mouvements-stock/ajuster`,           { method: 'POST', headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
};

/* ══════════════════════════════════════
   ETABLISSEMENT
══════════════════════════════════════ */
export const EtablissementAPI = {
  get:    ()     => fetch(`${BASE_URL}${API_PREFIX}/etablissement`, { headers: h() }).then(r => r.ok ? r.json() : null).catch(() => null),
  create: (data) => fetch(`${BASE_URL}${API_PREFIX}/etablissement`, { method: 'POST', headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  update: (data) => fetch(`${BASE_URL}${API_PREFIX}/etablissement`, { method: 'PUT',  headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
};
