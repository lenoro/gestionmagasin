import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

const icons = {
  success: <CheckCircle size={18} className="text-green-500 shrink-0" />,
  error: <XCircle size={18} className="text-red-500 shrink-0" />,
  info: <AlertCircle size={18} className="text-blue-500 shrink-0" />,
}

const borders = {
  success: 'border-l-4 border-green-500',
  error: 'border-l-4 border-red-500',
  info: 'border-l-4 border-blue-500',
}

let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map(t => (
          <div key={t.id}
            className={`flex items-start gap-3 bg-white shadow-lg rounded-lg px-4 py-3 text-sm text-gray-800 ${borders[t.type]} animate-fade-in`}>
            {icons[t.type]}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-gray-600 ml-1">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
