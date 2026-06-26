import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { gerarPayloadPix } from '../lib/pix'
import { CONFIG } from '../config'
import { supabase } from '../lib/supabaseClient'

const VALORES_SUGERIDOS = [20, 50, 100]

export default function SecaoDoacao() {
  const [valor, setValor] = useState(50)
  const [valorCustom, setValorCustom] = useState('')
  const [mostrarQr, setMostrarQr] = useState(false)
  const [nomeDoador, setNomeDoador] = useState('')
  const [registrado, setRegistrado] = useState(false)

  const valorFinal = valorCustom ? parseFloat(valorCustom) : valor
  const valorValido = valorFinal > 0

  const payload = valorValido
    ? gerarPayloadPix({
        chave: CONFIG.pix.chave,
        nome: CONFIG.pix.nomeRecebedor,
        cidade: CONFIG.pix.cidade,
        valor: valorFinal,
        txid: 'DOACAORIFA',
      })
    : ''

  function copiarCodigo() {
    navigator.clipboard.writeText(payload)
  }

  async function registrarDoacao() {
    if (!supabase) return
    await supabase.from('doacoes').insert({
      nome_doador: nomeDoador.trim() || 'Anônimo',
      valor: valorFinal,
    })
    setRegistrado(true)
  }

  return (
    <section className="max-w-md mx-auto px-6 py-16">
      <div className="bg-sage/10 border border-sage/25 rounded-3xl p-7">
        <h2 className="font-display text-2xl text-charcoal mb-2 text-center">
          Quer contribuir além da rifa?
        </h2>
        <p className="font-body text-sm text-charcoal-soft text-center mb-6 leading-relaxed">
          Toda ajuda é bem-vinda, com qualquer valor. Essa contribuição é separada da rifa, sem número
          associado — é só carinho.
        </p>

        {!mostrarQr ? (
          <div className="space-y-4">
            <div className="flex gap-2 justify-center">
              {VALORES_SUGERIDOS.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setValor(v)
                    setValorCustom('')
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-body font-medium text-sm border-2 transition-colors focus-ring ${
                    valor === v && !valorCustom
                      ? 'bg-sage-deep border-sage-deep text-cream'
                      : 'bg-white border-sage/30 text-charcoal hover:border-sage'
                  }`}
                >
                  R$ {v}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="valor-custom" className="block font-body text-sm text-charcoal-soft mb-1.5">
                Ou digite outro valor
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-charcoal-soft">
                  R$
                </span>
                <input
                  id="valor-custom"
                  type="number"
                  min="1"
                  step="1"
                  value={valorCustom}
                  onChange={(e) => setValorCustom(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-charcoal/15 bg-white pl-10 pr-4 py-2.5 font-body text-charcoal focus-ring"
                />
              </div>
            </div>

            <button
              onClick={() => setMostrarQr(true)}
              disabled={!valorValido}
              className="w-full bg-sage-deep text-cream font-body font-semibold py-3 rounded-xl hover:bg-sage-deep/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-ring"
            >
              Gerar Pix de R$ {valorValido ? valorFinal.toFixed(2) : '0,00'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center bg-white rounded-2xl p-5 border border-charcoal/10">
              <QRCodeSVG value={payload} size={180} marginSize={0} />
            </div>

            <button
              onClick={copiarCodigo}
              className="w-full bg-white border border-charcoal/15 text-charcoal font-body text-sm py-3 rounded-xl hover:bg-charcoal/5 transition-colors focus-ring"
            >
              📋 Copiar código Pix
            </button>

            {!registrado ? (
              <div className="space-y-2 pt-2 border-t border-sage/20">
                <label htmlFor="nome-doador" className="block font-body text-xs text-charcoal-soft">
                  Quer deixar seu nome? (opcional)
                </label>
                <div className="flex gap-2">
                  <input
                    id="nome-doador"
                    type="text"
                    value={nomeDoador}
                    onChange={(e) => setNomeDoador(e.target.value)}
                    placeholder="Seu nome"
                    className="flex-1 rounded-xl border border-charcoal/15 bg-white px-3 py-2 font-body text-sm text-charcoal focus-ring"
                  />
                  <button
                    onClick={registrarDoacao}
                    className="bg-terracotta text-cream font-body text-sm font-medium px-4 rounded-xl hover:bg-terracotta/90 transition-colors focus-ring"
                  >
                    Já paguei
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center font-body text-sm text-sage-deep font-medium pt-2">
                Muito obrigado pelo carinho! 💚
              </p>
            )}

            <button
              onClick={() => {
                setMostrarQr(false)
                setRegistrado(false)
              }}
              className="w-full font-body text-sm text-charcoal-soft hover:text-charcoal transition-colors"
            >
              ← Escolher outro valor
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
