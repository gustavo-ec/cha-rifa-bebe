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
  const [copiado, setCopiado] = useState(false)

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
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2500)
  }

  async function registrarDoacao() {
    await supabase.from('doacoes').insert({
      nome_doador: nomeDoador.trim() || 'Anônimo',
      valor: valorFinal,
    })
    setRegistrado(true)
  }

  return (
    <section className="max-w-xl mx-auto px-6 py-10">
      {/* Divisor decorativo */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-blush/60" />
        <span className="font-display italic text-charcoal/40 text-lg">ou</span>
        <div className="flex-1 h-px bg-blush/60" />
      </div>

      <div
        className="rounded-3xl overflow-hidden border border-sage/20 shadow-sm"
        style={{ background: 'linear-gradient(160deg, #f4f8f2 0%, #fdf5f9 100%)' }}
      >
        {/* Cabeçalho verde */}
        <div className="px-7 pt-7 pb-5 text-center">
          <span className="text-2xl" aria-hidden="true">💚</span>
          <h2 className="font-display text-2xl text-charcoal mt-2 mb-1">
            Quero ajudar de outro jeito
          </h2>
          <p className="font-body text-sm text-charcoal-soft leading-relaxed max-w-xs mx-auto">
            Quer contribuir para os preparativos da{' '}
            <span className="font-medium text-charcoal">{CONFIG.rifa.nomeBebe}</span> sem participar
            da rifa? Qualquer valor é muito bem-vindo.
          </p>
        </div>

        <div className="px-7 pb-7">
          {!mostrarQr ? (
            <div className="space-y-4">
              {/* Valores sugeridos */}
              <div className="flex gap-2">
                {VALORES_SUGERIDOS.map((v) => (
                  <button
                    key={v}
                    onClick={() => { setValor(v); setValorCustom('') }}
                    className={`flex-1 py-3 rounded-xl font-body font-semibold text-sm border-2 transition-all focus-ring ${
                      valor === v && !valorCustom
                        ? 'border-sage-deep text-sage-deep bg-sage/15 shadow-sm'
                        : 'border-sage/30 text-charcoal bg-white hover:border-sage'
                    }`}
                  >
                    R$ {v}
                  </button>
                ))}
              </div>

              {/* Valor personalizado */}
              <div>
                <label htmlFor="valor-custom" className="block font-body text-xs text-charcoal-soft mb-1.5 uppercase tracking-wide">
                  Ou outro valor
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-charcoal-soft text-sm">R$</span>
                  <input
                    id="valor-custom"
                    type="number"
                    min="1"
                    step="1"
                    value={valorCustom}
                    onChange={(e) => setValorCustom(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-charcoal/15 bg-white pl-10 pr-4 py-3 font-body text-charcoal focus-ring"
                  />
                </div>
              </div>

              <button
                onClick={() => setMostrarQr(true)}
                disabled={!valorValido}
                className="w-full text-white font-body font-semibold py-3.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:brightness-95 focus-ring"
                style={{ background: 'linear-gradient(135deg, #7E9670, #9CAF88)' }}
              >
                Gerar Pix de R$ {valorValido ? valorFinal.toFixed(2) : '0,00'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-white rounded-2xl p-4 border-2 border-sage/30 shadow-sm">
                  <QRCodeSVG value={payload} size={176} marginSize={0} fgColor="#3A3530" />
                </div>
              </div>

              {/* Valor */}
              <p className="text-center font-display text-3xl text-sage-deep">
                R$ {valorFinal.toFixed(2)}
              </p>

              {/* Copiar */}
              <button
                onClick={copiarCodigo}
                className={`w-full border font-body text-sm py-3 rounded-xl transition-all focus-ring ${
                  copiado
                    ? 'bg-sage/20 border-sage-deep text-sage-deep'
                    : 'bg-white border-charcoal/15 text-charcoal hover:bg-charcoal/5'
                }`}
              >
                {copiado ? '✓ Código copiado!' : '📋 Copiar código Pix'}
              </button>

              {/* Nome do doador */}
              {!registrado ? (
                <div className="border-t border-sage/20 pt-4 space-y-2">
                  <p className="font-body text-xs text-charcoal-soft text-center">
                    Depois de pagar, deixa seu nome pra guardarmos com carinho 💚
                  </p>
                  <div className="flex gap-2">
                    <input
                      id="nome-doador"
                      type="text"
                      value={nomeDoador}
                      onChange={(e) => setNomeDoador(e.target.value)}
                      placeholder="Seu nome (opcional)"
                      className="flex-1 rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 font-body text-sm text-charcoal focus-ring"
                    />
                    <button
                      onClick={registrarDoacao}
                      className="bg-sage-deep text-cream font-body text-sm font-medium px-4 rounded-xl hover:bg-sage-deep/90 transition-colors focus-ring whitespace-nowrap"
                    >
                      Já paguei
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 border-t border-sage/20">
                  <p className="text-2xl mb-1" aria-hidden="true">🌸</p>
                  <p className="font-display text-lg text-charcoal">Muito obrigado!</p>
                  <p className="font-body text-sm text-charcoal-soft">
                    A {CONFIG.rifa.nomeBebe} vai agradecer 💚
                  </p>
                </div>
              )}

              <button
                onClick={() => { setMostrarQr(false); setRegistrado(false) }}
                className="w-full font-body text-sm text-charcoal-soft hover:text-charcoal transition-colors py-1"
              >
                ← Escolher outro valor
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
