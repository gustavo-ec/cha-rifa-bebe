import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import GradeNumeros from './components/GradeNumeros'
import ModalCompra from './components/ModalCompra'
import SecaoDoacao from './components/SecaoDoacao'
import Admin from './pages/Admin'
import { CONFIG } from './config'
import { supabase } from './lib/supabaseClient'

function gerarNumerosLocais() {
  return Array.from({ length: CONFIG.rifa.totalNumeros }, (_, i) => ({
    numero: i,
    status: 'livre',
  }))
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

  useEffect(() => {
    carregarNumeros()
  }, [carregarNumeros])

  // Atualiza em tempo real quando outras pessoas reservam números
  useEffect(() => {
    if (!usandoSupabase) return
    const channel = supabase
      .channel('numeros_rifa_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'numeros_rifa' }, () => {
        carregarNumeros()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [usandoSupabase, carregarNumeros])

  async function confirmarReserva({ numero, nome, telefone }) {
    if (!usandoSupabase) {
      // modo demo local, sem persistência real
      setNumeros((prev) =>
        prev.map((n) => (n.numero === numero ? { ...n, status: 'reservado' } : n))
      )
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
      .eq('status', 'livre') // só reserva se ainda estiver livre (evita corrida entre dois compradores)

    if (error) {
      return { ok: false, mensagem: 'Não foi possível reservar. Tente novamente.' }
    }

    await carregarNumeros()
    setSelecionado(null)
    return { ok: true }
  }

  const vendidos = numeros.filter((n) => n.status === 'pago').length

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="font-body text-charcoal-soft">Carregando rifa...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Hero vendidos={vendidos} total={CONFIG.rifa.totalNumeros} />

      {!usandoSupabase && (
        <div className="max-w-3xl mx-auto px-6 -mt-2 mb-8">
          <div className="bg-terracotta/10 border border-terracotta/30 rounded-xl px-4 py-3 text-center">
            <p className="font-body text-xs text-charcoal-soft">
              ⚠️ Modo demonstração: o Supabase ainda não foi configurado, então as reservas não são salvas de verdade.
              Veja <strong>CONFIGURACAO.md</strong> para ativar o banco de dados.
            </p>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="font-display text-3xl text-charcoal text-center mb-2">Escolha seu número</h2>
        <p className="font-body text-charcoal-soft text-center mb-8">
          R$ {CONFIG.rifa.precoPorNumero},00 por número · Pix instantâneo
        </p>
        <GradeNumeros numeros={numeros} selecionado={selecionado} onSelecionar={setSelecionado} />
      </main>

      <SecaoDoacao />

      <footer className="text-center py-10 px-6">
        <p className="font-body text-xs text-charcoal-soft">
          Feito com carinho para a chegada da nossa menina · {CONFIG.rifa.dataPrevista}
        </p>
      </footer>

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
