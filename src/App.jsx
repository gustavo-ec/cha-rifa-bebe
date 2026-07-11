import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import GradeNumeros from './components/GradeNumeros'
import ModalCompra from './components/ModalCompra'
import SecaoDoacao from './components/SecaoDoacao'
import SecaoPremio from './components/SecaoPremio'
import Admin from './pages/Admin'
import { CONFIG } from './config'
import { supabase } from './lib/supabaseClient'

function gerarNumerosLocais() {
  return Array.from({ length: CONFIG.rifa.totalNumeros }, (_, i) => ({
    numero: i,
    status: 'livre',
  }))
}

function SetaFixa() {
  const [visivel, setVisivel] = useState(true)

  useEffect(() => {
    function onScroll() {
      setVisivel(window.scrollY < 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        pointerEvents: 'none',
        opacity: visivel ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      <div style={{ animation: 'setaBounce 1.4s ease-in-out infinite' }}>
        <div style={{
          background: 'rgba(251, 245, 238, 0.85)',
          backdropFilter: 'blur(6px)',
          border: '1.5px solid #E8B4BC',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(201,124,93,0.18)',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4 L10 16 M4 11 L10 16 L16 11" stroke="#C97C5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <style>{`
        @keyframes setaBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(7px); }
        }
      `}</style>
    </div>
  )
}

function PaginaRifa() {
  const [numeros, setNumeros] = useState(gerarNumerosLocais)
  const [selecionado, setSelecionado] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [usandoSupabase, setUsandoSupabase] = useState(false)

  const carregarNumeros = useCallback(async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setCarregando(false)
      return
    }
    const { data, error } = await supabase
      .from('numeros_rifa')
      .select('numero, status')
      .order('numero', { ascending: true })

    if (!error && data && data.length > 0) {
      setNumeros(data)
      setUsandoSupabase(true)
    }
    setCarregando(false)
  }, [])

  useEffect(() => { carregarNumeros() }, [carregarNumeros])

  useEffect(() => {
    if (!usandoSupabase) return
    const channel = supabase
      .channel('numeros_rifa_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'numeros_rifa' }, () => {
        carregarNumeros()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [usandoSupabase, carregarNumeros])

  async function confirmarReserva({ numero, nome, telefone }) {
    if (!usandoSupabase) {
      setNumeros((prev) => prev.map((n) => (n.numero === numero ? { ...n, status: 'reservado' } : n)))
      setSelecionado(null)
      return { ok: true }
    }

    const { error } = await supabase
      .from('numeros_rifa')
      .update({
        status: 'reservado',
        nome_comprador: nome,
        telefone_comprador: telefone,
        reservado_em: new Date().toISOString(),
      })
      .eq('numero', numero)
      .eq('status', 'livre')

    if (error) return { ok: false, mensagem: 'Não foi possível reservar. Tente novamente.' }

    await carregarNumeros()
    setSelecionado(null)
    return { ok: true }
  }

  const vendidos = numeros.filter((n) => n.status === 'pago').length

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="text-4xl mb-3" aria-hidden="true">🌸</div>
          <p className="font-body text-charcoal-soft">Carregando a rifa da Maria Idália...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Hero vendidos={vendidos} total={CONFIG.rifa.totalNumeros} />

      {!usandoSupabase && (
        <div className="max-w-3xl mx-auto px-6 pt-6 pb-0">
          <div className="bg-terracotta/10 border border-terracotta/30 rounded-xl px-4 py-3 text-center">
            <p className="font-body text-xs text-charcoal-soft">
              ⚠️ Modo demonstração — Supabase ainda não configurado. Veja <strong>CONFIGURACAO.md</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Prêmio */}
      <div className="pt-10">
        <SecaoPremio />
      </div>

      {/* Doação — entre prêmio e grade */}
      <div className="max-w-3xl mx-auto px-6 pb-2">
        <SecaoDoacao />
      </div>

      {/* Grade de números */}
      <main className="max-w-3xl mx-auto px-6 pt-6 pb-12">
        <div className="text-center mb-8">
          <h2 className="font-display text-4xl text-charcoal mb-1">Escolha seu número</h2>
          <p className="font-body text-charcoal-soft text-sm">
            R$ {CONFIG.rifa.precoPorNumero},00 por número · pagamento via Pix na hora
          </p>
        </div>
        <GradeNumeros numeros={numeros} selecionado={selecionado} onSelecionar={setSelecionado} />
      </main>

      {/* Rodapé */}
      <footer className="text-center py-10 px-6 border-t border-blush/40">
        <div className="text-2xl mb-2" aria-hidden="true">🌸</div>
        <p className="font-display italic text-lg text-charcoal/60 mb-1">Maria Idália</p>
        <p className="font-body text-xs text-charcoal-soft">
          Chegando em {CONFIG.rifa.dataPrevista} · Feito com amor pela família
        </p>
      </footer>

      {/* Seta fixa na parte inferior da tela */}
      <SetaFixa />

      {selecionado !== null && (
        <ModalCompra
          numero={selecionado}
          onClose={() => setSelecionado(null)}
          onConfirmarReserva={confirmarReserva}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaRifa />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
