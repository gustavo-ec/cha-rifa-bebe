import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LoginAdmin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    })

    setCarregando(false)

    if (error) {
      setErro('E-mail ou senha incorretos.')
      return
    }

    onLogin(data.session)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-charcoal text-center mb-1">Painel da rifa</h1>
        <p className="font-body text-sm text-charcoal-soft text-center mb-8">Acesso restrito</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-body text-sm font-medium text-charcoal mb-1.5">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 font-body text-charcoal focus-ring"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="senha" className="block font-body text-sm font-medium text-charcoal mb-1.5">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 font-body text-charcoal focus-ring"
            />
          </div>

          {erro && <p className="font-body text-sm text-terracotta">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-terracotta text-cream font-body font-semibold py-3 rounded-xl hover:bg-terracotta/90 disabled:opacity-50 transition-colors focus-ring"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
