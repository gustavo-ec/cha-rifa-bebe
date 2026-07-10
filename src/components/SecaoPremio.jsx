import { CONFIG } from '../config'

export default function SecaoPremio() {
  return (
    <section className="max-w-3xl mx-auto px-6 pb-4 space-y-4">

      {/* Card do Prêmio */}
      <div
        className="relative overflow-hidden rounded-3xl px-8 py-8 text-center"
        style={{ background: 'linear-gradient(135deg, #C97C5D 0%, #d4926f 50%, #C97C5D 100%)' }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2" style={{ background: 'white' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 translate-y-1/2 -translate-x-1/2" style={{ background: 'white' }} />

        <div className="relative">
          <span className="text-4xl" aria-hidden="true">🎁</span>
          <p className="font-body text-sm tracking-[0.2em] uppercase text-white/70 mt-3 mb-1">
            Prêmio do sorteio
          </p>
          <p className="font-display text-white leading-tight" style={{ fontSize: 'clamp(2.8rem, 10vw, 4.5rem)' }}>
            R$ {CONFIG.premio.valor},00
          </p>
          <p className="font-body text-white/80 text-base mt-1">
            em dinheiro via Pix
          </p>
        </div>
      </div>

      {/* Card das Regras */}
      <div className="bg-white border border-blush/40 rounded-3xl px-8 py-7">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-2xl" aria-hidden="true">📋</span>
          <h3 className="font-display text-2xl text-charcoal">Regras do sorteio</h3>
        </div>

        <ul className="space-y-4">
          <Regra icone="📅" titulo="Data do sorteio">
            O sorteio será realizado no dia <strong>10 de agosto de 2026</strong>. Caso todos os
            200 números sejam vendidos antes dessa data, o sorteio acontecerá no{' '}
            <strong>dia seguinte</strong> ao da venda do último número.
          </Regra>

          <Regra icone="🎯" titulo="Como será feito">
            O sorteio será realizado pelo site <strong>sorteador.com.br</strong>, que sorteia um
            número aleatório entre <strong>0 e 199</strong>. O resultado será gravado e o link
            compartilhado publicamente para garantir total transparência.
          </Regra>

          <Regra icone="🏆" titulo="Ganhador">
            O participante cujo número coincidir com o resultado do sorteio receberá{' '}
            <strong>R$ 200,00 via Pix</strong> diretamente na chave cadastrada no momento da
            compra. O contato será feito pelo WhatsApp informado na reserva.
          </Regra>

          <Regra icone="✅" titulo="Validade">
            Apenas números com pagamento <strong>confirmado</strong> participam do sorteio.
            Números reservados mas não pagos até a data do sorteio serão desconsiderados.
          </Regra>
        </ul>
      </div>

    </section>
  )
}

function Regra({ icone, titulo, children }) {
  return (
    <li className="flex gap-3">
      <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">{icone}</span>
      <div>
        <p className="font-body font-semibold text-charcoal text-base mb-0.5">{titulo}</p>
        <p className="font-body text-charcoal-soft text-base leading-relaxed">{children}</p>
      </div>
    </li>
  )
}
