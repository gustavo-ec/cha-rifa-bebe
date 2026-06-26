import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { CONFIG } from '../config'
import LoginAdmin from '../components/LoginAdmin'

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'livre', label: 'Livres' },
  { id: 'reservado', label: 'Reservados' },
  { id: 'pago', label: 'Pagos' },
]

export default function Admin() {
  const [sessao, setSessao] = useState(null)
  const [carregandoSessao, setCarregandoSessao] = useState(true)
  const [numeros, setNumeros] = useState([])
  const [doacoes, setDoacoes] = useState([])
  const [filtro, setFiltro] = useState('reservado')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session)
      setCarregandoSessao(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const carregarDados = useCallback(async () => {
    const { data: nums } = await supabase
      .from('numeros_rifa')
      .select('*')
      .order('numero', { ascending: true })
    if (nums) setNumeros(nums)

    const { data: dons } = await supabase
      .from('doacoes')
      .select('*')
      .order('criado_em', { ascending: false })
    if (dons) setDoacoes(dons)
  }, [])

  useEffect(() => {
    if (sessao) carregarDados()
  }, [sessao, carregarDados])

  async function atualizarStatus(numero, novoStatus) {
    const updates = { status: novoStatus }
    if (novoStatus === 'pago') updates.pago_em = new Date().toISOString()
    if (novoStatus === 'livre') {
      updates.nome_comprador = null
      updates.telefone_comprador = null
      updates.reservado_em = null
      updates.pago_em = null
    }

    await supabase.from('numeros_rifa').update(updates).eq('numero', numero)
    carregarDados()
  }

  async function sair() {
    await supabase.auth.signOut()
  }

  if (carregandoSessao) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="font-body text-charcoal-soft">Carregando...</p>
      </div>
    )
  }

  if (!sessao) {
    return <LoginAdmin onLogin={setSessao} />
  }

  const totalArrecadado = numeros.filter((n) => n.status === 'pago').length * CONFIG.rifa.precoPorNumero
  const totalDoacoes = doacoes.reduce((acc, d) => acc + Number(d.valor), 0)

  const numerosFiltrados = numeros.filter((n) => {
    const passaFiltro = filtro === 'todos' || n.status === filtro
    const passaBusca =
      !busca ||
      String(n.numero).padStart(3, '0').includes(busca) ||
      (n.nome_comprador || '').toLowerCase().includes(busca.toLowerCase())
    return passaFiltro && passaBusca
  })

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-blush px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl text-charcoal">Painel da rifa</h1>
          <button
            onClick={sair}
            className="font-body text-sm text-charcoal-soft hover:text-charcoal underline"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Resumo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Cartao label="Vendidos" valor={numeros.filter((n) => n.status === 'pago').length} />
          <Cartao label="Reservados" valor={numeros.filter((n) => n.status === 'reservado').length} />
          <Cartao label="Arrecadado (rifa)" valor={`R$ ${totalArrecadado}`} />
          <Cartao label="Doações" valor={`R$ ${totalDoacoes.toFixed(2)}`} />
        </div>

        {/* Filtros e busca */}
        <div className="flex flex-wrap gap-2 mb-4">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`px-3 py-1.5 rounded-full font-body text-sm border transition-colors focus-ring ${
                filtro === f.id
                  ? 'bg-terracotta text-cream border-terracotta'
                  : 'bg-white text-charcoal border-charcoal/15 hover:border-charcoal/30'
              }`}
            >
              {f.label}
            </button>
          ))}
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar número ou nome..."
            className="ml-auto rounded-full border border-charcoal/15 bg-white px-4 py-1.5 font-body text-sm text-charcoal focus-ring min-w-[180px]"
          />
        </div>

        {/* Lista */}
        <div className="space-y-2">
          {numerosFiltrados.length === 0 && (
            <p className="font-body text-sm text-charcoal-soft text-center py-8">Nenhum número encontrado.</p>
          )}
          {numerosFiltrados.map((n) => (
            <div
              key={n.numero}
              className="flex items-center gap-3 bg-white border border-charcoal/10 rounded-xl px-4 py-3"
            >
              <span className="font-display text-lg text-charcoal w-12 shrink-0">
                {String(n.numero).padStart(3, '0')}
              </span>
              <div className="flex-1 min-w-0">
                {n.nome_comprador ? (
                  <>
                    <p className="font-body text-sm text-charcoal truncate">{n.nome_comprador}</p>
                    {n.telefone_comprador && (
                      <p className="font-body text-xs text-charcoal-soft truncate">{n.telefone_comprador}</p>
                    )}
                  </>
                ) : (
                  <p className="font-body text-sm text-charcoal-soft italic">Sem comprador</p>
                )}
              </div>
              <StatusBadge status={n.status} />
              <div className="flex gap-1.5 shrink-0">
                {n.status !== 'pago' && (
                  <BotaoAcao onClick={() => atualizarStatus(n.numero, 'pago')} cor="sage">
                    ✓ Pago
                  </BotaoAcao>
                )}
                {n.status !== 'livre' && (
                  <BotaoAcao onClick={() => atualizarStatus(n.numero, 'livre')} cor="terracotta">
                    Liberar
                  </BotaoAcao>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Doações recentes */}
        {doacoes.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl text-charcoal mb-3">Doações registradas</h2>
            <div className="space-y-2">
              {doacoes.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between bg-white border border-charcoal/10 rounded-xl px-4 py-3"
                >
                  <span className="font-body text-sm text-charcoal">{d.nome_doador}</span>
                  <span className="font-body text-sm font-semibold text-sage-deep">
                    R$ {Number(d.valor).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function Cartao({ label, valor }) {
  return (
    <div className="bg-white border border-charcoal/10 rounded-xl px-4 py-3 text-center">
      <p className="font-display text-2xl text-charcoal">{valor}</p>
      <p className="font-body text-xs text-charcoal-soft">{label}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    livre: 'bg-cream text-charcoal-soft border-charcoal/15',
    reservado: 'bg-blush/40 text-charcoal border-blush-deep',
    pago: 'bg-sage/25 text-sage-deep border-sage-deep',
  }
  const label = { livre: 'Livre', reservado: 'Reservado', pago: 'Pago' }
  return (
    <span className={`shrink-0 font-body text-xs px-2.5 py-1 rounded-full border ${styles[status]}`}>
      {label[status]}
    </span>
  )
}

function BotaoAcao({ children, onClick, cor }) {
  const cores = {
    sage: 'bg-sage-deep hover:bg-sage-deep/90',
    terracotta: 'bg-terracotta hover:bg-terracotta/90',
  }
  return (
    <button
      onClick={onClick}
      className={`font-body text-xs font-medium text-cream px-2.5 py-1.5 rounded-lg transition-colors focus-ring ${cores[cor]}`}
    >
      {children}
    </button>
  )
}
