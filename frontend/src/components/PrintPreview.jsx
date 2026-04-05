// src/components/PrintPreview.jsx
import { useState, useRef } from 'react';

/* ══════════════════════════════════════════════
   Générateurs de pages pour chaque rapport
   Chaque rapport retourne un tableau de pages JSX
══════════════════════════════════════════════ */

const PAGE_W = 740;
const PAGE_H = 960;
const HDR_BG = '#0a246a';
const HDR_FG = '#ffffff';

/* En-tête commun à toutes les pages */
function ReportHeader({ title, subtitle, page, total, etab }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {/* En-tête établissement */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ flex: 1 }}>
          {etab ? (
            <>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#0a246a', textTransform: 'uppercase', letterSpacing: 0.5 }}>{etab.rep}</div>
              <div style={{ fontSize: 9, color: '#333', marginTop: 1 }}>{etab.ministere}</div>
              <div style={{ fontSize: 9, color: '#555', marginTop: 1 }}>{etab.wilaya}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1a1a1a', marginTop: 3 }}>{etab.centre}</div>
            </>
          ) : (
            <div style={{ fontSize: 14, fontWeight: 700 }}>—</div>
          )}
        </div>
        <div style={{ textAlign: 'right', fontSize: 10, color: '#666' }}>
          Page {page} / {total}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: '#555' }}>{subtitle}</div>}
      </div>
      <div style={{ borderTop: '2px solid #0a246a', marginBottom: 10 }} />
    </div>
  );
}

/* Cellule d'en-tête de grille */
function TH({ children, width, align = 'left' }) {
  return (
    <th style={{
      padding: '5px 8px',
      textAlign: align,
      background: HDR_BG,
      color: HDR_FG,
      fontSize: 11,
      fontWeight: 600,
      borderRight: '1px solid #2a4aaa',
      width: width || 'auto',
      whiteSpace: 'nowrap',
    }}>{children}</th>
  );
}

function TD({ children, align = 'left', bold, color, small }) {
  return (
    <td style={{
      padding: '4px 8px',
      textAlign: align,
      fontSize: small ? 10 : 12,
      fontWeight: bold ? 700 : 400,
      color: color || '#000',
      borderBottom: '1px solid #e0e0e0',
      borderRight: '1px solid #eee',
    }}>{children}</td>
  );
}

/* ── Rapport Customers ── */
function buildCustomersPages(clients, etab) {
  const ROWS_PER_PAGE = 14;
  const pages = [];
  const total = Math.ceil(clients.length / ROWS_PER_PAGE);
  for (let p = 0; p < total; p++) {
    const slice = clients.slice(p * ROWS_PER_PAGE, (p + 1) * ROWS_PER_PAGE);
    pages.push(
      <div key={p}>
        <ReportHeader title="Customer List" subtitle="By Last Invoice" page={p + 1} total={total} etab={etab} />
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              <TH width={70}>Last Invoice</TH>
              <TH>Customer / Address</TH>
              <TH width={110}>Phone / FAX</TH>
              <TH width={80} align="right">Customer No.</TH>
            </tr>
          </thead>
          <tbody>
            {slice.map((c, i) => (
              <tr key={c.id} style={{ background: i % 2 === 0 ? '#fff' : '#f7f7f5' }}>
                <TD small color="#555">{c.lastInvoice || '—'}</TD>
                <td style={{ padding: '4px 8px', fontSize: 12, borderBottom: '1px solid #e0e0e0' }}>
                  <div style={{ fontWeight: 700 }}>{c.clientName}</div>
                  <div style={{ fontSize: 10, color: '#666' }}>{c.add1}{c.add2 ? ', ' + c.add2 : ''}, {c.city}</div>
                </td>
                <td style={{ padding: '4px 8px', fontSize: 10, color: '#444', borderBottom: '1px solid #e0e0e0' }}>
                  <div>{c.phone}</div>
                  <div>{c.fax}</div>
                </td>
                <TD align="right" bold>{c.id}</TD>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pied de page */}
        <div style={{ marginTop: 12, borderTop: '1px solid #ccc', paddingTop: 6, fontSize: 10, color: '#888', display: 'flex', justifyContent: 'space-between' }}>
          <span>{etab?.centre || 'GestionMagasin'} — Confidentiel</span>
          <span>{new Date().toLocaleDateString('fr-CA')}</span>
        </div>
      </div>
    );
  }
  return pages;
}

/* ── Rapport Orders ── */
function buildOrdersPages(commandes, clients, calcTotaux, etab) {
  const ROWS_PER_PAGE = 12;
  const pages = [];
  const total = Math.ceil(commandes.length / ROWS_PER_PAGE);
  for (let p = 0; p < total; p++) {
    const slice = commandes.slice(p * ROWS_PER_PAGE, (p + 1) * ROWS_PER_PAGE);
    const grandPaid = commandes.reduce((s, c) => s + calcTotaux(c).paid, 0);
    const grandDue  = commandes.reduce((s, c) => s + calcTotaux(c).due,  0);
    pages.push(
      <div key={p} style={{ position: 'relative', minHeight: PAGE_H - 80 }}>
        <ReportHeader title="Liste des Affectations" subtitle={`${commandes.length} affectations au total`} page={p + 1} total={total} etab={etab} />
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              <TH width={70}>Clé Emp</TH>
              <TH>Employé</TH>
              <TH width={85}>Date Aff</TH>
              <TH width={85}>Date eff</TH>
              <TH width={70}>Fournisseurs</TH>
              <TH width={90} align="right">Total</TH>
            </tr>
          </thead>
          <tbody>
            {slice.map((cmd, i) => {
              const client = cmd.client || clients.find(c => c.id === (cmd.client?.id || cmd.clientId));
              const t = calcTotaux(cmd);
              return (
                <tr key={cmd.id} style={{ background: i % 2 === 0 ? '#fff' : '#f7f7f5' }}>
                  <TD bold>{cmd.invoiceNumber || cmd.id}</TD>
                  <TD>{client?.clientName || '—'}</TD>
                  <TD small>{cmd.invoiceDate}</TD>
                  <TD small color="#555">{cmd.shipDate || '—'}</TD>
                  <TD small>{cmd.vendeur?.vendorName || cmd.transporteur || '—'}</TD>
                  <TD align="right" bold color={t.due > 0 ? '#c00' : '#060'}>{t.due.toFixed(2)} $</TD>
                </tr>
              );
            })}
          </tbody>
          {p === total - 1 && (
            <tfoot>
              <tr style={{ background: HDR_BG }}>
                <td colSpan={5} style={{ padding: '5px 8px', color: HDR_FG, fontWeight: 700, fontSize: 12 }}>TOTAL</td>
                <td style={{ padding: '5px 8px', textAlign: 'right', color: '#ffcccc', fontWeight: 700, fontSize: 12 }}>{grandDue.toFixed(2)} $</td>
              </tr>
            </tfoot>
          )}
        </table>
        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, borderTop: '1px solid #ccc', paddingTop: 6, fontSize: 10, color: '#888', display: 'flex', justifyContent: 'space-between' }}>
          <span>{etab?.centre || 'GestionMagasin'} — Confidentiel</span>
          <span>{new Date().toLocaleDateString('fr-CA')}</span>
        </div>
      </div>
    );
  }
  return pages;
}

/* ── Rapport Invoice (1 facture par page) ── */
function buildInvoicePages(commandes, clients, calcTotaux, etab) {
  return commandes.map((cmd, idx) => {
    const client = cmd.client || clients.find(c => c.id === (cmd.client?.id || cmd.clientId));
    const t = calcTotaux(cmd);
    return (
      <div key={cmd.id} style={{ position: 'relative', minHeight: PAGE_H - 80 }}>
        <ReportHeader title={`Facture N° ${cmd.invoiceNumber || cmd.id}`} subtitle={`${client?.clientName || ''}`} page={idx + 1} total={commandes.length} etab={etab} />

        {/* En-tête facture */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 14, padding: '10px 14px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 3 }}>
          <div style={{ fontSize: 12 }}>
            <div style={{ fontWeight: 700 }}>{client?.clientName}</div>
            <div style={{ color: '#555' }}>{client?.address || client?.add1}{client?.add2 ? ', ' + client.add2 : ''}</div>
            <div style={{ color: '#555' }}>{client?.city}{client?.state ? ', ' + client.state : ''}{client?.zip ? ' ' + client.zip : ''}</div>
            <div style={{ marginTop: 4 }}>Tél : {client?.phone}</div>
          </div>
          <div style={{ fontSize: 12, textAlign: 'right' }}>
            <table style={{ marginLeft: 'auto', borderCollapse: 'collapse' }}>
              {[
                ['Date :', cmd.invoiceDate],
                ['Vendeur :', cmd.vendeur?.vendorName || cmd.vendeur || '—'],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{ padding: '1px 8px 1px 0', color: '#555', textAlign: 'right' }}>{k}</td>
                  <td style={{ padding: '1px 0', fontWeight: 600 }}>{v}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>

        {/* Lignes */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
          <thead>
            <tr>
              <TH width={80}>Code</TH>
              <TH>Désignation</TH>
              <TH width={90} align="right">Prix U</TH>
              <TH width={50} align="center">Qté</TH>
              <TH width={110} align="right">Total</TH>
            </tr>
          </thead>
          <tbody>
            {(cmd.items || []).map((l, i) => {
              const unitPrice = l.unitPrice || 0;
              const ext = unitPrice * (l.quantity || 0);
              return (
                <tr key={l.id} style={{ background: i % 2 === 0 ? '#fff' : '#f7f7f5' }}>
                  <TD bold>{l.article?.articleCode || l.articleCode || '—'}</TD>
                  <TD>{l.article?.articleName || l.articleName || '—'}</TD>
                  <TD align="right">{unitPrice.toFixed(2)} $</TD>
                  <TD align="center">{l.quantity}</TD>
                  <TD align="right" bold>{ext.toFixed(2)} $</TD>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 40 }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 12, minWidth: 220 }}>
            <tr style={{ borderTop: '2px solid #0a246a' }}>
              <td style={{ padding: '5px 12px 5px 0', fontWeight: 700, fontSize: 14, textAlign: 'right' }}>Total :</td>
              <td style={{ padding: '5px 0', fontWeight: 700, fontSize: 14, textAlign: 'right', color: '#0a246a' }}>
                {(t.due ?? t.subtotal ?? 0).toFixed(2)} $
              </td>
            </tr>
          </table>
        </div>

        {/* Pied de page — en bas */}
        <div style={{ position: 'absolute', bottom: 24, left: 40, right: 40, borderTop: '1px solid #ccc', paddingTop: 6, fontSize: 10, color: '#888', display: 'flex', justifyContent: 'space-between' }}>
          <span>{etab?.centre || 'GestionMagasin'} — Merci de votre confiance</span>
          <span>{new Date().toLocaleDateString('fr-CA')}</span>
        </div>
      </div>
    );
  });
}

/* ══════════════════════════════════════════════
   Composant PrintPreview principal
══════════════════════════════════════════════ */
export default function PrintPreview({ reportType, clients, commandes, articles, calcTotaux, onClose, etab }) {
  const [pageIdx,   setPageIdx]   = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode,  setViewMode]  = useState('single');
  const printRef  = useRef(null);
  const scrollRef = useRef(null);

  /* Scroll au début quand on change de page */
  const changePage = (newIdx) => {
    setPageIdx(newIdx);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  /* ── Générer les pages selon le type ── */
  const pages =
    reportType === 'customers' ? buildCustomersPages(clients, etab) :
    reportType === 'orders'    ? buildOrdersPages(commandes, clients, calcTotaux, etab) :
                                 buildInvoicePages(commandes, clients, calcTotaux, etab);

  const totalPages = pages.length;

  const goFirst = () => changePage(0);
  const goPrev  = () => changePage(Math.max(0, pageIdx - 1));
  const goNext  = () => changePage(Math.min(totalPages - 1, pageIdx + 1));
  const goLast  = () => changePage(totalPages - 1);

  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>GestionMagasin — Print</title>
      <style>
        body { font-family: Tahoma, Arial, sans-serif; margin: 0; }
        @media print { .no-print { display: none; } }
        table { border-collapse: collapse; width: 100%; }
        th { background: #0a246a; color: #fff; padding: 5px 8px; font-size: 11px; }
        td { padding: 4px 8px; font-size: 12px; border-bottom: 1px solid #eee; }
        .page { width: 210mm; min-height: 297mm; padding: 20mm; box-sizing: border-box; page-break-after: always; }
      </style></head><body>
      ${pages.map((_, i) => `<div class="page" id="page-${i}"></div>`).join('')}
      </body></html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5];
  const zoomPct = Math.round(zoomLevel * 100);

  const btnNav = {
    width: 28, height: 24, fontSize: 12,
    border: '1px solid #aaa', background: '#e8e8e8',
    cursor: 'pointer', borderRadius: 2, fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  const btnView = (active) => ({
    width: 26, height: 24, fontSize: 11,
    border: active ? '2px inset #6090b8' : '1px solid #aaa',
    background: active ? '#a8c8e8' : '#e8e8e8',
    cursor: 'pointer', borderRadius: 2,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  });

  return (
    <div style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 13, background: '#808080', minHeight: '100vh' }}>

      {/* ── Fenêtre Print Preview ── */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

        {/* Barre de titre */}
        <div style={{ background: 'linear-gradient(to right, #0a246a, #a6b8d8)', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>🖨</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Affichage avant impression</span>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            <button style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer' }}>─</button>
            <button style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer' }}>□</button>
            <button onClick={onClose} style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer', color: '#900', fontWeight: 700 }}>✕</button>
          </div>
        </div>

        {/* Barre d'outils */}
        <div style={{ background: '#d4d0c8', borderBottom: '2px solid #888', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>

          {/* Boutons vue */}
          <button style={btnView(viewMode === 'single')} onClick={() => setViewMode('single')} title="Page simple">▣</button>
          <button style={btnView(viewMode === 'full')}   onClick={() => setViewMode('full')}   title="Pleine page">⊟</button>
          <button style={btnView(viewMode === 'two')}    onClick={() => setViewMode('two')}    title="Deux pages">⊞</button>

          <div style={{ width: 1, height: 20, background: '#aaa', margin: '0 4px' }} />

          {/* Navigator */}
          <button style={{ ...btnNav, opacity: pageIdx === 0 ? 0.35 : 1, cursor: pageIdx === 0 ? 'default' : 'pointer' }}
            onClick={goFirst} title="Première page">|◄</button>
          <button style={{ ...btnNav, opacity: pageIdx === 0 ? 0.35 : 1, cursor: pageIdx === 0 ? 'default' : 'pointer' }}
            onClick={goPrev}  title="Page précédente">◄</button>
          <button style={{ ...btnNav, opacity: pageIdx === totalPages - 1 ? 0.35 : 1, cursor: pageIdx === totalPages - 1 ? 'default' : 'pointer' }}
            onClick={goNext}  title="Page suivante">►</button>
          <button style={{ ...btnNav, opacity: pageIdx === totalPages - 1 ? 0.35 : 1, cursor: pageIdx === totalPages - 1 ? 'default' : 'pointer' }}
            onClick={goLast}  title="Dernière page">►|</button>
          {/* Saisie directe de page */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
            <span style={{ fontSize: 11, color: '#444' }}>Page</span>
            <input
              type="number" min="1" max={totalPages}
              value={pageIdx + 1}
              onChange={e => {
                const v = parseInt(e.target.value) - 1;
                if (!isNaN(v) && v >= 0 && v < totalPages) changePage(v);
              }}
              style={{ width: 38, textAlign: 'center', fontSize: 12, padding: '1px 3px', border: '1px solid #aaa', borderRadius: 2, fontFamily: 'inherit' }}
            />
            <span style={{ fontSize: 11, color: '#444' }}>/ {totalPages}</span>
          </div>

          <div style={{ width: 1, height: 20, background: '#aaa', margin: '0 4px' }} />

          {/* Imprimer */}
          <button style={{ ...btnNav, width: 26 }} onClick={handlePrint} title="Imprimer">🖨</button>
          <button style={{ ...btnNav, width: 26 }} onClick={handlePrint} title="Imprimer tout">🖨️</button>

          <div style={{ width: 1, height: 20, background: '#aaa', margin: '0 4px' }} />

          {/* Zoom */}
          <button style={{ ...btnNav, width: 22 }} onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.25))} title="Zoom -">−</button>
          <select
            value={zoomLevel}
            onChange={e => setZoomLevel(parseFloat(e.target.value))}
            style={{ fontSize: 12, padding: '1px 4px', border: '1px solid #aaa', borderRadius: 2, width: 65, fontFamily: 'inherit' }}
          >
            {ZOOM_LEVELS.map(z => <option key={z} value={z}>{Math.round(z * 100)}%</option>)}
          </select>
          <button style={{ ...btnNav, width: 22 }} onClick={() => setZoomLevel(z => Math.min(1.5, z + 0.25))} title="Zoom +">+</button>

          <div style={{ width: 1, height: 20, background: '#aaa', margin: '0 4px' }} />

          {/* Sauvegarder */}
          <button style={{ ...btnNav, width: 26 }} title="Sauvegarder">💾</button>
          <button style={{ ...btnNav, width: 26 }} title="Ouvrir">📂</button>

          <div style={{ marginLeft: 'auto' }}>
            <button
              style={{ padding: '3px 16px', fontSize: 13, border: '1px solid #888', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>

        {/* Zone d'aperçu */}
        <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', background: '#808080', padding: '20px', display: 'flex', justifyContent: 'center', gap: 16 }}>

          {/* Page(s) */}
          {viewMode === 'two' ? (
            /* Deux pages côte à côte */
            <>
              {[pageIdx, pageIdx + 1].filter(i => i < totalPages).map(i => (
                <div key={i} ref={i === pageIdx ? printRef : null}
                  style={{ background: '#fff', width: PAGE_W * zoomLevel * 0.6, minHeight: PAGE_H * zoomLevel * 0.6, boxShadow: '3px 3px 12px rgba(0,0,0,0.5)', padding: 24 * zoomLevel * 0.6, boxSizing: 'border-box', transform: `scale(${zoomLevel * 0.6})`, transformOrigin: 'top left' }}>
                  {pages[i]}
                </div>
              ))}
            </>
          ) : (
            /* Page simple ou pleine page */
            <div
              ref={printRef}
              style={{
                background: '#fff',
                width: viewMode === 'full' ? '90%' : PAGE_W,
                minHeight: PAGE_H,
                boxShadow: '4px 4px 16px rgba(0,0,0,0.5)',
                padding: 40,
                boxSizing: 'border-box',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
              }}
            >
              {pages[pageIdx]}
            </div>
          )}
        </div>

        {/* Barre de statut */}
        <div style={{ background: '#d4d0c8', borderTop: '2px solid #888', padding: '2px 10px', display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, flexShrink: 0 }}>
          <span style={{ borderRight: '1px solid #aaa', paddingRight: 10 }}>{zoomPct}%</span>
          <span>Page {pageIdx + 1} of {totalPages}</span>
          <span style={{ marginLeft: 'auto', color: '#555' }}>
            {reportType === 'customers' ? 'État Employés' : reportType === 'orders' ? 'Liste des Affectations' : 'État des Factures'}
          </span>
        </div>

      </div>
    </div>
  );
}
