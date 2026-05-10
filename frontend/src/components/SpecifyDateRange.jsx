// src/components/SpecifyDateRange.jsx

const S = {
  label:  { fontSize: 13, display: 'block', marginBottom: 3, fontWeight: 500 },
  input:  { padding: '3px 6px', fontSize: 13, border: '1px solid #aaa', borderRadius: 2, fontFamily: 'inherit', background: '#fff', width: 130 },
  btnCal: { width: 22, height: 22, fontSize: 11, border: '1px solid #aaa', background: '#e8e8e8', cursor: 'pointer', borderRadius: 2, fontWeight: 700, color: '#333' },
  btnOk:  { padding: '4px 0', width: 80, fontSize: 13, border: '2px solid #0a246a', borderRadius: 3, background: '#e8e8e8', cursor: 'pointer', fontFamily: 'inherit' },
  btnCan: { padding: '4px 0', width: 80, fontSize: 13, border: '1px solid #888',    borderRadius: 3, background: '#e8e8e8', cursor: 'pointer', fontFamily: 'inherit' },
};

export default function SpecifyDateRange({ dateFrom, dateTo, onChange, onOk, onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ width: 370, background: '#d4d0c8', border: '2px solid #888', borderRadius: 3, boxShadow: '4px 4px 10px rgba(0,0,0,0.4)', fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 13 }}>

        {/* Barre de titre */}
        <div style={{ background: 'linear-gradient(to right, #0a246a, #a6b8d8)', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Specify Date Range</span>
          <button onClick={onClose} style={{ width: 16, height: 14, fontSize: 10, background: '#c0c0c0', border: '1px solid #888', cursor: 'pointer', color: '#900', fontWeight: 700, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: '14px 16px' }}>

          {/* Description */}
          <p style={{ fontSize: 13, marginBottom: 14, color: '#000' }}>
            Customers with LastInvoiceDate ranging:
          </p>

          {/* Layout : champs à gauche, boutons à droite */}
          <div style={{ display: 'flex', gap: 16 }}>

            {/* Champs From / To */}
            <div style={{ flex: 1 }}>
              {/* From */}
              <div style={{ marginBottom: 10 }}>
                <span style={S.label}>From</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => onChange('from', e.target.value)}
                    style={S.input}
                  />
                  <button style={S.btnCal} title="Calendrier">15</button>
                </div>
              </div>

              {/* To */}
              <div>
                <span style={S.label}>To</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => onChange('to', e.target.value)}
                    style={S.input}
                  />
                  <button style={S.btnCal} title="Calendrier">15</button>
                </div>
              </div>
            </div>

            {/* Boutons OK / Cancel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'flex-start', paddingTop: 20 }}>
              <button style={S.btnOk} onClick={onOk}>
                <span style={{ textDecoration: 'underline' }}>O</span>K
              </button>
              <button style={S.btnCan} onClick={onClose}>
                <span style={{ textDecoration: 'underline' }}>C</span>ancel
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
