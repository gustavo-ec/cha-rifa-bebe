import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { gerarPayloadPix } from '../lib/pix'
import { CONFIG } from '../config'

export default function ModalCompra({ numero, onClose, onConfirmarReserva }) {
  const [etapa, setEtapa] = useState('dados') // 'dados' | 'pagamento' | 'enviando' | 'erro'
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erro, setErro] = useState('')

  const numeroFormatado = String(numero).padStart(3, '0')

  function avancarParaPagamento(e) {
    e.preventDefault()
    if (nome.trim().length < 2) {
      setErro('Digite seu nome completo.')
      return
    }
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
    // em caso de sucesso, o componente pai fecha o modal
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
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal/40 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-cream w-full sm:max-w-sm sm:rounded-3xl rounded-t-3xl shadow-xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-cream flex items-center justify-between px-6 pt-6 pb-3 border-b border-charcoal/5">
          <div>
            <p className="font-body text-xs uppercase tracking-wide text-charcoal-soft">Número</p>
            <h2 id="modal-titulo" className="font-display text-3xl text-charcoal">
              {numeroFormatado}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal-soft hover:bg-charcoal/5 focus-ring"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6">
          {etapa === 'dados' && (
            <form onSubmit={avancarParaPagamento} className="space-y-4">
              <p className="font-body text-sm text-charcoal-soft">
                Preencha seus dados para reservar este número por R$ {CONFIG.rifa.precoPorNumero},00.
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
                  className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 font-body text-charcoal focus-ring"
                  placeholder="Como devemos te chamar"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="telefone" className="block font-body text-sm font-medium text-charcoal mb-1.5">
                  WhatsApp <span className="text-charcoal-soft font-normal">(opcional)</span>
                </label>
                <input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 font-body text-charcoal focus-ring"
                  placeholder="(00) 00000-0000"
                />
              </div>
              {erro && <p className="text-sm text-terracotta font-body">{erro}</p>}
              <button
                type="submit"
                className="w-full bg-terracotta text-cream font-body font-semibold py-3 rounded-xl hover:bg-terracotta/90 transition-colors focus-ring"
              >
                Continuar para pagamento
              </button>
            </form>
          )}

          {etapa === 'pagamento' && (
            <div className="space-y-5">
              <p className="font-body text-sm text-charcoal-soft text-center">
                Escaneie o QR Code ou copie o código Pix abaixo para pagar{' '}
                <strong className="text-charcoal">R$ {CONFIG.rifa.precoPorNumero},00</strong>.
              </p>

              <div className="flex justify-center bg-white rounded-2xl p-5 border border-charcoal/10">
                <QRCodeSVG value={payload} size={200} marginSize={0} />
              </div>

              <button
                onClick={copiarCodigo}
                className="w-full bg-white border border-charcoal/15 text-charcoal font-body text-sm py-3 rounded-xl hover:bg-charcoal/5 transition-colors focus-ring break-all"
              >
                📋 Copiar código Pix (copia e cola)
              </button>

              <div className="bg-sage/10 border border-sage/30 rounded-xl px-4 py-3">
                <p className="font-body text-xs text-charcoal-soft leading-relaxed">
                  Depois de pagar, clique em "Já paguei" para reservar seu número.
                  Ele ficará marcado como <strong>reservado</strong> até a confirmação manual do pagamento.
                </p>
              </div>

              {erro && <p className="text-sm text-terracotta font-body text-center">{erro}</p>}

              <button
                onClick={confirmarReserva}
                className="w-full bg-sage-deep text-cream font-body font-semibold py-3 rounded-xl hover:bg-sage-deep/90 transition-colors focus-ring"
              >
                Já paguei, reservar número
              </button>
              <button
                onClick={() => setEtapa('dados')}
                className="w-full font-body text-sm text-charcoal-soft hover:text-charcoal transition-colors"
              >
                ← Voltar
              </button>
            </div>
          )}

          {etapa === 'enviando' && (
            <div className="py-10 text-center">
              <p className="font-body text-charcoal-soft">Reservando seu número...</p>
            </div>
          )}

          {etapa === 'erro' && (
            <div className="space-y-4 text-center py-4">
              <p className="font-body text-charcoal">{erro}</p>
              <button
                onClick={onClose}
                className="w-full bg-terracotta text-cream font-body font-semibold py-3 rounded-xl hover:bg-terracotta/90 transition-colors focus-ring"
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
