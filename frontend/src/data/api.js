// src/data/api.js
// Service centralisé pour les appels REST vers le backend Spring Boot
// Base URL : http://localhost:8080

const BASE_URL = 'http://localhost:8080';

const headers = { 'Content-Type': 'application/json' };

/* ══════════════════════════════════════
   CLIENTS  (entité Client.java)
   Table: clients
══════════════════════════════════════ */
export const ClientAPI = {
  getAll:     ()         => fetch(`${BASE_URL}/clients`).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById:    (id)       => fetch(`${BASE_URL}/clients/${id}`).then(r => r.json()),
  getByCode:  (code)     => fetch(`${BASE_URL}/clients/code/${code}`).then(r => r.json()),
  search:     (name)     => fetch(`${BASE_URL}/clients/search?name=${name}`).then(r => r.json()),
  create:     (client)   => fetch(`${BASE_URL}/clients`,      { method: 'POST',   headers, body: JSON.stringify(client)  }).then(r => r.json()),
  update:     (id, data) => fetch(`${BASE_URL}/clients/${id}`,{ method: 'PUT',    headers, body: JSON.stringify(data)    }).then(r => r.json()),
  delete:     (id)       => fetch(`${BASE_URL}/clients/${id}`,{ method: 'DELETE'                                         }).then(r => r.ok),
};

/* ══════════════════════════════════════
   ARTICLES  (entité Article.java)
   Table: articles
══════════════════════════════════════ */
export const ArticleAPI = {
  getAll:     ()         => fetch(`${BASE_URL}/articles`).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById:    (id)       => fetch(`${BASE_URL}/articles/${id}`).then(r => r.json()),
  getByCode:  (code)     => fetch(`${BASE_URL}/articles/code/${code}`).then(r => r.json()),
  create:     (article)  => fetch(`${BASE_URL}/articles`,       { method: 'POST',   headers, body: JSON.stringify(article) }).then(r => r.json()),
  update:     (id, data) => fetch(`${BASE_URL}/articles/${id}`, { method: 'PUT',    headers, body: JSON.stringify(data)    }).then(r => r.json()),
  delete:     (id)       => fetch(`${BASE_URL}/articles/${id}`, { method: 'DELETE'                                          }).then(r => r.ok),
};

/* ══════════════════════════════════════
   FACTURES  (entité Facture.java)
   Table: invoices
══════════════════════════════════════ */
export const FactureAPI = {
  getAll:         ()         => fetch(`${BASE_URL}/factures`).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById:        (id)       => fetch(`${BASE_URL}/factures/${id}`).then(r => r.json()),
  getByClient:    (clientId) => fetch(`${BASE_URL}/factures/client/${clientId}`).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getByNumber:    (num)      => fetch(`${BASE_URL}/factures/number/${num}`).then(r => r.json()),
  create:         (facture)  => fetch(`${BASE_URL}/factures`,       { method: 'POST',   headers, body: JSON.stringify(facture) }).then(r => r.json()),
  update:         (id, data) => fetch(`${BASE_URL}/factures/${id}`, { method: 'PUT',    headers, body: JSON.stringify(data)    }).then(r => r.json()),
  delete:         (id)       => fetch(`${BASE_URL}/factures/${id}`, { method: 'DELETE'                                          }).then(r => r.ok),
};

/* ══════════════════════════════════════
   ITEMS  (entité Item.java)
   Table: invoice_items
══════════════════════════════════════ */
export const ItemAPI = {
  getByFacture: (factureId) => fetch(`${BASE_URL}/factures/${factureId}/items`).then(r => r.json()),
  create:       (item)      => fetch(`${BASE_URL}/items`,       { method: 'POST',   headers, body: JSON.stringify(item) }).then(r => r.json()),
  update:       (id, data)  => fetch(`${BASE_URL}/items/${id}`, { method: 'PUT',    headers, body: JSON.stringify(data) }).then(r => r.json()),
  delete:       (id)        => fetch(`${BASE_URL}/items/${id}`, { method: 'DELETE'                                       }).then(r => r.ok),
};

/* ══════════════════════════════════════
   VENDEURS  (entité Vendeur.java)
   Table: vendors
══════════════════════════════════════ */
export const VendeurAPI = {
  getAll:     ()         => fetch(`${BASE_URL}/vendeurs`).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById:    (id)       => fetch(`${BASE_URL}/vendeurs/${id}`).then(r => r.json()),
  getByCode:  (code)     => fetch(`${BASE_URL}/vendeurs/code/${code}`).then(r => r.json()),
  search:     (name)     => fetch(`${BASE_URL}/vendeurs/search?name=${name}`).then(r => r.json()),
  create:     (vendeur)  => fetch(`${BASE_URL}/vendeurs`,       { method: 'POST',   headers, body: JSON.stringify(vendeur) }).then(r => r.json()),
  update:     (id, data) => fetch(`${BASE_URL}/vendeurs/${id}`, { method: 'PUT',    headers, body: JSON.stringify(data)    }).then(r => r.json()),
  delete:     (id)       => fetch(`${BASE_URL}/vendeurs/${id}`, { method: 'DELETE'                                          }).then(r => r.ok),
};

/* ══════════════════════════════════════
   PRODUCTEURS  (entité Produit.java)
   Table: produits
══════════════════════════════════════ */
export const ProducteurAPI = {
  getAll:     ()         => fetch(`${BASE_URL}/producteurs`).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(d => Array.isArray(d) ? d : (d.content ?? [])),
  getById:    (id)       => fetch(`${BASE_URL}/producteurs/${id}`).then(r => r.json()),
  create:     (prod)     => fetch(`${BASE_URL}/producteurs`,       { method: 'POST',   headers, body: JSON.stringify(prod) }).then(r => r.json()),
  update:     (id, data) => fetch(`${BASE_URL}/producteurs/${id}`, { method: 'PUT',    headers, body: JSON.stringify(data) }).then(r => r.json()),
  delete:     (id)       => fetch(`${BASE_URL}/producteurs/${id}`, { method: 'DELETE'                                       }).then(r => r.ok),
};
