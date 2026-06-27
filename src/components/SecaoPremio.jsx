import { CONFIG } from '../config'

export default function SecaoPremio() {
  return (
    <section className="max-w-3xl mx-auto px-6 pb-4">
      <div
        className="relative overflow-hidden rounded-3xl px-8 py-8 text-center"
        style={{ background: 'linear-gradient(135deg, #C97C5D 0%, #d4926f 50%, #C97C5D 100%)' }}
      >
        {/* bolinhas decorativas */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2" style={{ background: 'white' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 translate-y-1/2 -translate-x-1/2" style={{ background: 'white' }} />

        <div className="relative">
          <span className="text-3xl" aria-hidden="true">🎁</span>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-white/70 mt-2 mb-1">Prêmio do sorteio</p>
          <p className="font-display text-white leading-tight" style={{ fontSize: 'clamp(2.2rem, 8vw, 3.5rem)' }}>
            R$ {CONFIG.premio.valor},00
          </p>
          <p className="font-body text-white/80 text-sm mt-1 mb-4">em dinheiro</p>

          <div className="bg-white/15 rounded-xl px-4 py-3 inline-block">
            <p className="font-body text-white/90 text-xs leading-relaxed max-w-xs">
              {CONFIG.premio.detalhe}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
