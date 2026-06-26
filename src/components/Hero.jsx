import { CONFIG } from '../config'

export default function Hero({ vendidos, total }) {
  const progresso = total > 0 ? Math.round((vendidos / total) * 100) : 0

  return (
    <header className="relative overflow-hidden bg-blush">
      {/* textura sutil de fundo */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #3A3530 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <span className="inline-block font-body text-xs tracking-[0.2em] uppercase text-charcoal/60 mb-4">
          {CONFIG.rifa.dataPrevista}
        </span>

        <h1 className="font-display text-5xl sm:text-6xl text-charcoal leading-[1.05] mb-4">
          {CONFIG.rifa.titulo}
        </h1>

        <p className="font-display italic text-xl text-charcoal-soft mb-8">
          {CONFIG.rifa.subtitulo}
        </p>

        <p className="font-body text-charcoal-soft leading-relaxed max-w-xl mx-auto mb-10">
          {CONFIG.rifa.descricao}
        </p>

        {/* barra de progresso */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-baseline mb-2 font-body text-sm text-charcoal">
            <span>
              <strong className="font-semibold">{vendidos}</strong> de {total} números
            </span>
            <span className="text-charcoal-soft">{progresso}%</span>
          </div>
          <div className="h-2.5 w-full bg-cream/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-terracotta rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        <BotaoCompartilhar />
      </div>

      {/* divisor ondulado */}
      <svg
        className="relative block w-full"
        style={{ height: '40px' }}
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,20 C150,40 350,0 600,20 C850,40 1050,0 1200,20 L1200,40 L0,40 Z" fill="#FBF5EE" />
      </svg>
    </header>
  )
}

function BotaoCompartilhar() {
  const mensagem = `${CONFIG.rifa.titulo} 💕\n\nEstamos organizando uma rifa para ajudar nos preparativos da chegada da nossa filha, prevista para ${CONFIG.rifa.dataPrevista}. Cada número custa R$ ${CONFIG.rifa.precoPorNumero},00 e o pagamento é via Pix, na hora.\n\nDá uma olhada e escolhe o seu número:\n${typeof window !== 'undefined' ? window.location.href : ''}`

  const linkWhatsapp = `https://wa.me/?text=${encodeURIComponent(mensagem)}`

  return (
    <div className="mt-6">
      <a
        href={linkWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#25D366] text-white font-body font-semibold text-sm px-5 py-2.5 rounded-full hover:brightness-95 transition-all focus-ring"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4a8.96 8.96 0 0 0-7.76 13.4L3 21l3.7-1.27a8.94 8.94 0 0 0 4.36 1.11h.01a8.96 8.96 0 0 0 8.94-8.97 8.9 8.9 0 0 0-2.41-5.55ZM12.06 19.4a7.4 7.4 0 0 1-3.77-1.03l-.27-.16-2.55.87.87-2.49-.18-.27a7.43 7.43 0 0 1 11.61-9.2 7.36 7.36 0 0 1 2.18 5.24 7.43 7.43 0 0 1-7.4 7.42Zm4.08-5.56c-.22-.11-1.32-.65-1.52-.73-.2-.07-.35-.11-.5.11-.15.22-.58.73-.71.88-.13.15-.26.16-.48.05-.22-.11-.94-.35-1.78-1.1-.66-.59-1.1-1.31-1.23-1.53-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.4.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.4-.07-.11-.5-1.21-.69-1.66-.18-.43-.36-.37-.5-.38-.13-.01-.28-.01-.43-.01-.15 0-.4.06-.6.28-.21.22-.79.77-.79 1.87 0 1.1.81 2.17.92 2.32.11.15 1.59 2.43 3.86 3.4.54.23.96.37 1.28.48.54.17 1.03.15 1.42.09.43-.06 1.32-.54 1.51-1.06.19-.52.19-.97.13-1.06-.05-.1-.2-.15-.42-.26Z" />
        </svg>
        Compartilhar no WhatsApp
      </a>
    </div>
  )
}
