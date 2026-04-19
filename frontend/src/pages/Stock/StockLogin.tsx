import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { stockAuthApi } from '../../api/stockApi'

export default function StockLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) { setError('Identifiant obligatoire'); return }
    if (!password.trim()) { setError('Mot de passe obligatoire'); return }
    setLoading(true); setError('')
    try {
      const res = await stockAuthApi.login(username.trim(), password)
      localStorage.setItem('gs_username', res.username)
      navigate('/produits')
    } catch {
      setError('Identifiants incorrects')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Gestion Stock</h1>
            <p className="text-sm text-gray-500 mt-1">Connexion requise pour accéder aux données stock</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant</label>
              <input
                value={username}
                onChange={e => { setUsername(e.target.value); setError('') }}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-4 text-xs text-center text-gray-400">
            Comptes disponibles : admin, directeur, magasinier (mot de passe : 123)
          </p>
        </div>
      </div>
    </div>
  )
}
