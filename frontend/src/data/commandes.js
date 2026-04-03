// src/data/commandes.js
// Variables alignées avec les entités Facture.java et Item.java du backend Spring Boot
// API : GET /api/factures  |  GET /api/factures/{id}/items

export const COMMANDES = [
  {
    id:            1,
    invoiceNumber: 'BON-1076',       // Facture.invoiceNumber
    invoiceDate:   '2026-01-15',     // Facture.invoiceDate
    shipDate:      '2026-01-20',
    clientId:      1,                // Facture.client.id  (FK → Client)
    vendeurId:     1,                // Facture.vendeur.id (FK → Vendeur)
    vendeur:       'Parker, Bill',
    termes:        'FOB',
    paiement:      'Credit',
    transporteur:  'UPS',
    taxRate:       4.50,
    freight:       12.00,
    paid:          1306.25,
    totalAmount:   1478.00,          // Facture.totalAmount
    status:        'PAID',           // Facture.status
    items: [                         // Facture.items (entité Item.java)
      {
        id:         1,
        articleId:  1,               // Item.article.id
        articleCode:'A001',          // Item.article.articleCode
        articleName:'Laptop Pro 15"',// Item.article.articleName
        quantity:   1,               // Item.quantity
        unitPrice:  1299.00,         // Item.unitPrice
        lineTotal:  1299.00,         // Item.lineTotal
        remise:     0,
      },
      {
        id:         2,
        articleId:  3,
        articleCode:'A003',
        articleName:'Clavier mécanique',
        quantity:   2,
        unitPrice:  89.50,
        lineTotal:  170.05,
        remise:     5,
      },
    ],
  },
  {
    id:            2,
    invoiceNumber: 'BON-1123',
    invoiceDate:   '2026-02-10',
    shipDate:      '2026-02-14',
    clientId:      1,
    vendeurId:     2,
    vendeur:       'Martin, Jean',
    termes:        'Net 30',
    paiement:      'Chèque',
    transporteur:  'FedEx',
    taxRate:       4.50,
    freight:       0,
    paid:          600.00,
    totalAmount:   730.43,
    status:        'PARTIAL',
    items: [
      { id: 3, articleId: 4, articleCode: 'A004', articleName: 'Écran 27" 4K',    quantity: 1, unitPrice: 549.00, lineTotal: 549.00, remise: 0 },
      { id: 4, articleId: 6, articleCode: 'A006', articleName: 'Casque audio BT', quantity: 1, unitPrice: 149.00, lineTotal: 149.00, remise: 0 },
    ],
  },
  {
    id:            3,
    invoiceNumber: 'BON-1169',
    invoiceDate:   '2026-02-03',
    shipDate:      '2026-02-08',
    clientId:      2,
    vendeurId:     3,
    vendeur:       'Tremblay, Luc',
    termes:        'Net 30',
    paiement:      'Credit',
    transporteur:  'Purolator',
    taxRate:       4.50,
    freight:       8.50,
    paid:          0,
    totalAmount:   582.70,
    status:        'UNPAID',
    items: [
      { id: 5, articleId: 4, articleCode: 'A004', articleName: 'Écran 27" 4K', quantity: 1, unitPrice: 549.00, lineTotal: 549.00, remise: 0 },
    ],
  },
  {
    id:            4,
    invoiceNumber: 'BON-1176',
    invoiceDate:   '2026-03-10',
    shipDate:      '2026-03-15',
    clientId:      3,
    vendeurId:     1,
    vendeur:       'Parker, Bill',
    termes:        'FOB',
    paiement:      'Virement',
    transporteur:  'UPS',
    taxRate:       4.50,
    freight:       15.00,
    paid:          500,
    totalAmount:   657.93,
    status:        'PARTIAL',
    items: [
      { id: 6, articleId: 6,  articleCode: 'A006', articleName: 'Casque audio BT',   quantity: 3, unitPrice: 149.00, lineTotal: 402.30, remise: 10 },
      { id: 7, articleId: 7,  articleCode: 'A007', articleName: 'Hub USB-C 7 ports', quantity: 5, unitPrice: 45.00,  lineTotal: 225.00, remise: 0  },
    ],
  },
  {
    id:            5,
    invoiceNumber: 'BON-1269',
    invoiceDate:   '2026-03-22',
    shipDate:      '2026-03-28',
    clientId:      4,
    vendeurId:     4,
    vendeur:       'Côté, Marie',
    termes:        'Net 60',
    paiement:      'Credit',
    transporteur:  'Canada Post',
    taxRate:       4.50,
    freight:       5.00,
    paid:          0,
    totalAmount:   422.57,
    status:        'UNPAID',
    items: [
      { id: 8, articleId: 8, articleCode: 'A008', articleName: 'Chaise ergonomique', quantity: 1, unitPrice: 399.00, lineTotal: 399.00, remise: 0 },
    ],
  },
  {
    id:            6,
    invoiceNumber: 'BON-1302',
    invoiceDate:   '2026-04-01',
    shipDate:      '',
    clientId:      5,
    vendeurId:     2,
    vendeur:       'Martin, Jean',
    termes:        'COD',
    paiement:      'Cash',
    transporteur:  'FedEx',
    taxRate:       4.50,
    freight:       20.00,
    paid:          200,
    totalAmount:   286.86,
    status:        'PARTIAL',
    items: [
      { id: 9,  articleId: 2,  articleCode: 'A002', articleName: 'Souris sans fil',     quantity: 4, unitPrice: 34.99, lineTotal: 139.96, remise: 0 },
      { id: 10, articleId: 10, articleCode: 'A010', articleName: 'Lampe de bureau LED', quantity: 2, unitPrice: 59.99, lineTotal: 113.98, remise: 5 },
    ],
  },
];

/* ── Calcul des totaux d'une facture ── */
export function calcCommandeTotaux(cmd) {
  // Utilise lineTotal (Item.lineTotal) si disponible, sinon calcule
  const subtotal = cmd.items
    ? cmd.items.reduce((s, item) => {
        if (item.lineTotal) return s + item.lineTotal;
        const base = item.unitPrice * item.quantity;
        return s + base - (base * (item.remise || 0) / 100);
      }, 0)
    : (cmd.totalAmount || 0);

  const tax     = subtotal * (cmd.taxRate || 0) / 100;
  const freight = parseFloat(cmd.freight) || 0;
  const paid    = parseFloat(cmd.paid)    || 0;
  const due     = subtotal + tax + freight - paid;
  return { subtotal, tax, freight, paid, due };
}
