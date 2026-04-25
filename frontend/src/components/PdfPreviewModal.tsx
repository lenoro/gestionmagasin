import { useEffect, useState } from 'react'

interface PdfPreviewModalProps {
  url: string | null
  title: string
  onClose: () => void
}

export default function PdfPreviewModal({ url, title, onClose }: PdfPreviewModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Charger le PDF comme blob pour contourner le plugin Acrobat
  useEffect(() => {
    if (!url) {
      setBlobUrl(null)
      return
    }

    let objectUrl: string | null = null
    setLoading(true)

    const token = localStorage.getItem('gs_token')
    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.blob())
      .then(blob => {
        objectUrl = URL.createObjectURL(blob)
        setBlobUrl(objectUrl)
        setLoading(false)
      })
      .catch(() => {
        // Fallback : URL directe si le fetch échoue
        setBlobUrl(url)
        setLoading(false)
      })

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      setBlobUrl(null)
    }
  }, [url])

  // Touche Escape
  useEffect(() => {
    if (!url) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [url, onClose])

  if (!url) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl flex flex-col"
        style={{ width: '90vw', height: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 rounded-t-lg">
          <h2 className="font-semibold text-gray-800 text-sm truncate">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-4"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Corps — iframe PDF (blob URL contourne Acrobat) */}
        {loading
          ? <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Chargement…</div>
          : <iframe
              src={blobUrl ?? undefined}
              className="flex-1 w-full border-0"
              title={title}
            />
        }

        {/* Pied */}
        <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50 rounded-b-lg gap-3">
          <button
            onClick={() => window.open(url, '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            🖨 Imprimer
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
