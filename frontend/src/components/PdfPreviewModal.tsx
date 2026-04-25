import { useEffect } from 'react'

interface PdfPreviewModalProps {
  url: string | null
  title: string
  onClose: () => void
}

export default function PdfPreviewModal({ url, title, onClose }: PdfPreviewModalProps) {
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

        {/* Corps — iframe PDF */}
        <iframe
          src={url}
          className="flex-1 w-full border-0"
          title={title}
        />

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
