// src/data/api.js
// Service centralisé pour les appels REST vers le backend Spring Boot
// Base URL : http://localhost:8080

const BASE_URL = 'http://localhost:8080';

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
    fetch(`${BASE_URL}/api/auth/login`, {
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
  getAll:    ()         => fetch(`${BASE_URL}/clients`,              { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById:   (id)       => fetch(`${BASE_URL}/clients/${id}`,        { headers: h() }).then(r => r.json()),
  getByCode: (code)     => fetch(`${BASE_URL}/clients/code/${code}`, { headers: h() }).then(r => r.json()),
  search:    (name)     => fetch(`${BASE_URL}/clients/search?name=${name}`, { headers: h() }).then(r => r.json()),
  create:    (data)     => fetch(`${BASE_URL}/clients`,              { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  update:    (id, data) => fetch(`${BASE_URL}/clients/${id}`,        { method: 'PUT',    headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  delete:    (id)       => fetch(`${BASE_URL}/clients/${id}`,        { method: 'DELETE', headers: h() }).then(r => r.ok),
};

/* ══════════════════════════════════════
   ARTICLES
══════════════════════════════════════ */
export const ArticleAPI = {
  getAll:    ()         => fetch(`${BASE_URL}/articles`,              { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById:   (id)       => fetch(`${BASE_URL}/articles/${id}`,        { headers: h() }).then(r => r.json()),
  getByCode: (code)     => fetch(`${BASE_URL}/articles/code/${code}`, { headers: h() }).then(r => r.json()),
  create:    (data)     => fetch(`${BASE_URL}/articles`,              { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  update:    (id, data) => fetch(`${BASE_URL}/articles/${id}`,        { method: 'PUT',    headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  delete:    (id)       => fetch(`${BASE_URL}/articles/${id}`,        { method: 'DELETE', headers: h() }).then(r => r.ok),
};

/* ══════════════════════════════════════
   FACTURES
══════════════════════════════════════ */
export const FactureAPI = {
  getAll:      ()         => fetch(`${BASE_URL}/factures`,                    { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById:     (id)       => fetch(`${BASE_URL}/factures/${id}`,              { headers: h() }).then(r => r.json()),
  getByClient: (clientId) => fetch(`${BASE_URL}/factures/client/${clientId}`, { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getByNumber: (num)      => fetch(`${BASE_URL}/factures/number/${num}`,      { headers: h() }).then(r => r.json()),
  create:      (data)     => fetch(`${BASE_URL}/factures`,                    { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  update:      (id, data) => fetch(`${BASE_URL}/factures/${id}`,              { method: 'PUT',    headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  delete:      (id)       => fetch(`${BASE_URL}/factures/${id}`,              { method: 'DELETE', headers: h() }).then(r => r.ok),
};

/* ══════════════════════════════════════
   ITEMS
══════════════════════════════════════ */
export const ItemAPI = {
  getByFacture: (factureId) => fetch(`${BASE_URL}/factures/${factureId}/items`, { headers: h() }).then(r => r.json()),
  create:       (data)      => fetch(`${BASE_URL}/items`,       { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  update:       (id, data)  => fetch(`${BASE_URL}/items/${id}`, { method: 'PUT',    headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  delete:       (id)        => fetch(`${BASE_URL}/items/${id}`, { method: 'DELETE', headers: h() }).then(r => r.ok),
};

/* ══════════════════════════════════════
   VENDEURS
══════════════════════════════════════ */
export const VendeurAPI = {
  getAll:    ()         => fetch(`${BASE_URL}/vendeurs`,              { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById:   (id)       => fetch(`${BASE_URL}/vendeurs/${id}`,        { headers: h() }).then(r => r.json()),
  getByCode: (code)     => fetch(`${BASE_URL}/vendeurs/code/${code}`, { headers: h() }).then(r => r.json()),
  search:    (name)     => fetch(`${BASE_URL}/vendeurs/search?name=${name}`, { headers: h() }).then(r => r.json()),
  create:    (data)     => fetch(`${BASE_URL}/vendeurs`,              { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  update:    (id, data) => fetch(`${BASE_URL}/vendeurs/${id}`,        { method: 'PUT',    headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  delete:    (id)       => fetch(`${BASE_URL}/vendeurs/${id}`,        { method: 'DELETE', headers: h() }).then(r => r.ok),
};

/* ══════════════════════════════════════
   PRODUCTEURS
══════════════════════════════════════ */
export const ProducteurAPI = {
  getAll:  ()         => fetch(`${BASE_URL}/producteurs`,       { headers: h() }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById: (id)       => fetch(`${BASE_URL}/producteurs/${id}`, { headers: h() }).then(r => r.json()),
  create:  (data)     => fetch(`${BASE_URL}/producteurs`,       { method: 'POST',   headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  update:  (id, data) => fetch(`${BASE_URL}/producteurs/${id}`, { method: 'PUT',    headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  delete:  (id)       => fetch(`${BASE_URL}/producteurs/${id}`, { method: 'DELETE', headers: h() }).then(r => r.ok),
};
