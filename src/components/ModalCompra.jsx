import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { gerarPayloadPix } from '../lib/pix'
import { CONFIG } from '../config'

export default function ModalCompra({ numero, onClose, onConfirmarReserva }) {
  const [etapa, setEtapa] = useState('dados')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erro, setErro] = useState('')
  const [copiado, setCopiado] = useState(false)

  const numeroFormatado = String(numero).padStart(3, '0')

  function avancarParaPagamento(e) {
    e.preventDefault()
    if (nome.trim().length < 2) { setErro('Digite seu nome completo.'); return }
    setErro('')
    setEtapa('pagamento')
  }

  async function confirmarReserva() {
    setEtapa('enviando')
    const resultado = await onConfirmarReserva({ numero, nome: nome.trim(), telefone: telefone.trim() })
    if (!resultado.ok) {
      setErro(resultado.mensagem || 'Não foi possível reservar este número. Tente outro.')
      setEtapa('erro')
    }
  }

  const payload = gerarPayloadPix({
    chave: CONFIG.pix.chave,
    nome: CONFIG.pix.nomeRecebedor,
    cidade: CONFIG.pix.cidade,
    valor: CONFIG.rifa.precoPorNumero,
    txid: `RIFA${numeroFormatado}`,
  })

  function copiarCodigo() {
    navigator.clipboard.writeText(payload)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal/50 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-cream w-full sm:max-w-sm sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[94vh] overflow-y-auto">

        {/* Cabeçalho com gradiente */}
        <div
          className="sticky top-0 rounded-t-3xl px-6 pt-6 pb-4"
          style={{ background: 'linear-gradient(135deg, #f9e8ec 0%, #fdf0e8 100%)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-charcoal/50 mb-0.5">
                🌸 Chá Rifa · Maria Idália
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-body text-xs text-charcoal-soft">Número</span>
                <h2 id="modal-titulo" className="font-display text-4xl text-terracotta leading-none">
                  {numeroFormatado}
                </h2>
              </div>
              <p className="font-body text-sm text-charcoal-soft mt-0.5">
                R$ {CONFIG.rifa.precoPorNumero},00 via Pix
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal-soft hover:bg-charcoal/10 transition-colors focus-ring mt-1"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4">

          {/* ETAPA 1: Dados */}
          {etapa === 'dados' && (
            <form onSubmit={avancarParaPagamento} className="space-y-4">
              <p className="font-body text-sm text-charcoal-soft">
                Preencha seus dados e vamos gerar o Pix pra você na hora.
              </p>
              <div>
                <label htmlFor="nome" className="block font-body text-sm font-medium text-charcoal mb-1.5">
                  Nome completo
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 font-body text-charcoal focus-ring"
                  placeholder="Como devemos te chamar?"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="telefone" className="block font-body text-sm font-medium text-charcoal mb-1.5">
                  WhatsApp{' '}
                  <span className="font-normal text-charcoal-soft">(opcional)</span>
                </label>
                <input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 font-body text-charcoal focus-ring"
                  placeholder="(00) 00000-0000"
                />
              </div>
              {erro && <p className="text-sm text-terracotta font-body">{erro}</p>}
              <button
                type="submit"
                className="w-full text-white font-body font-semibold py-3.5 rounded-xl transition-all hover:brightness-95 focus-ring"
                style={{ background: 'linear-gradient(135deg, #C97C5D, #d4926f)' }}
              >
                Continuar para o Pix →
              </button>
            </form>
          )}

          {/* ETAPA 2: Pagamento */}
          {etapa === 'pagamento' && (
            <div className="space-y-4">
              <p className="font-body text-sm text-charcoal-soft text-center">
                Olá, <strong className="text-charcoal">{nome.split(' ')[0]}</strong>! Escaneie ou copie o código Pix abaixo.
              </p>

              {/* QR Code com borda decorativa */}
              <div className="flex justify-center">
                <div className="bg-white rounded-2xl p-4 border-2 border-blush shadow-sm">
                  <QRCodeSVG
                    value={payload}
                    size={192}
                    marginSize={0}
                    fgColor="#3A3530"
                  />
                </div>
              </div>

              {/* Valor em destaque */}
              <div className="text-center">
                <span className="font-display text-3xl text-terracotta">R$ {CONFIG.rifa.precoPorNumero},00</span>
                <p className="font-body text-xs text-charcoal-soft mt-0.5">
                  para {CONFIG.pix.nomeRecebedor.split(' ')[0]}
                </p>
              </div>

              {/* Botão copiar */}
              <button
                onClick={copiarCodigo}
                className={`w-full border font-body text-sm py-3 rounded-xl transition-all focus-ring ${
                  copiado
                    ? 'bg-sage/20 border-sage-deep text-sage-deep'
                    : 'bg-white border-charcoal/15 text-charcoal hover:bg-charcoal/5'
                }`}
              >
                {copiado ? '✓ Código copiado!' : '📋 Copiar código Pix (copia e cola)'}
              </button>

              {/* Aviso */}
              <div className="flex gap-2.5 bg-blush/20 border border-blush rounded-xl px-4 py-3">
                <span className="text-sm mt-0.5 shrink-0">💡</span>
                <p className="font-body text-xs text-charcoal-soft leading-relaxed">
                  Após pagar, clique em <strong>"Já paguei"</strong> para reservar o número{' '}
                  <strong className="text-terracotta">{numeroFormatado}</strong>. Ele ficará{' '}
                  reservado no seu nome até confirmarmos o pagamento.
                </p>
              </div>

              {erro && <p className="text-sm text-terracotta font-body text-center">{erro}</p>}

              <button
                onClick={confirmarReserva}
                className="w-full text-white font-body font-semibold py-3.5 rounded-xl transition-all hover:brightness-95 focus-ring"
                style={{ background: 'linear-gradient(135deg, #7E9670, #9CAF88)' }}
              >
                ✓ Já paguei — reservar número {numeroFormatado}
              </button>
              <button
                onClick={() => setEtapa('dados')}
                className="w-full font-body text-sm text-charcoal-soft hover:text-charcoal transition-colors py-1"
              >
                ← Voltar
              </button>
            </div>
          )}

          {/* ETAPA: Enviando */}
          {etapa === 'enviando' && (
            <div className="py-12 text-center space-y-3">
              <div className="text-3xl animate-pulse" aria-hidden="true">🌸</div>
              <p className="font-body text-charcoal-soft">Reservando o número {numeroFormatado}...</p>
            </div>
          )}

          {/* ETAPA: Sucesso (já fechado pelo pai, mas por segurança) */}
          {etapa === 'sucesso' && (
            <div className="py-10 text-center space-y-3">
              <div className="text-4xl" aria-hidden="true">🎉</div>
              <p className="font-display text-2xl text-charcoal">Número reservado!</p>
              <p className="font-body text-sm text-charcoal-soft">
                O número <strong>{numeroFormatado}</strong> está reservado no seu nome.
              </p>
            </div>
          )}

          {/* ETAPA: Erro */}
          {etapa === 'erro' && (
            <div className="space-y-4 text-center py-4">
              <div className="text-3xl" aria-hidden="true">😕</div>
              <p className="font-body text-charcoal leading-relaxed">{erro}</p>
              <button
                onClick={onClose}
                className="w-full text-white font-body font-semibold py-3 rounded-xl transition-all hover:brightness-95 focus-ring"
                style={{ background: '#C97C5D' }}
              >
                Fechar e escolher outro número
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
