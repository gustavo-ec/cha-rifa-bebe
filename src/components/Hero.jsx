import { CONFIG } from '../config'

export default function Hero({ vendidos, total }) {
  const progresso = total > 0 ? Math.round((vendidos / total) * 100) : 0
  const arrecadado = vendidos * CONFIG.rifa.precoPorNumero

  return (
    <header className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f9e8ec 0%, #fdf0e8 60%, #f3e8f0 100%)' }}>

      {/* Bolinhas decorativas de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full opacity-20" style={{ background: '#E8B4BC' }} />
        <div className="absolute top-20 -right-16 w-80 h-80 rounded-full opacity-15" style={{ background: '#C97C5D' }} />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full opacity-10" style={{ background: '#9CAF88' }} />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 pt-14 pb-6">

        {/* Ilustração SVG central */}
        <div className="flex justify-center mb-6">
          <IlustracaoBebe />
        </div>

        {/* Vem aí */}
        <div className="text-center mb-2">
          <span className="inline-block font-body text-xs tracking-[0.25em] uppercase text-charcoal/50">
            ✦ {CONFIG.rifa.dataPrevista} ✦
          </span>
        </div>

        {/* Nome da bebê */}
        <h1 className="font-display text-center leading-none mb-1" style={{ fontSize: 'clamp(3rem, 10vw, 5.5rem)', color: '#C97C5D' }}>
          Maria Idália
        </h1>
        <p className="font-display italic text-center text-2xl text-charcoal/60 mb-3">
          está chegando
        </p>

        {/* Subtítulo */}
        <p className="font-body text-center text-charcoal-soft leading-relaxed max-w-md mx-auto mb-2 text-sm sm:text-base">
          {CONFIG.rifa.descricao}
        </p>
      </div>

      {/* Card de stats */}
      <div className="relative max-w-3xl mx-auto px-6 pb-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm px-6 py-5 grid grid-cols-3 divide-x divide-charcoal/10">
          <Stat label="Valor do número" valor={`R$ ${CONFIG.rifa.precoPorNumero}`} />
          <Stat label="Números vendidos" valor={`${vendidos} / ${total}`} />
          <Stat label="Arrecadado" valor={`R$ ${arrecadado}`} destaque />
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="relative max-w-3xl mx-auto px-6 pb-6">
        <div className="flex justify-between items-baseline mb-1.5 font-body text-xs text-charcoal-soft">
          <span>{progresso}% dos números já reservados</span>
          <span>{total - vendidos} disponíveis</span>
        </div>
        <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: '#E8B4BC' }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progresso}%`, background: '#C97C5D' }}
          />
        </div>

        {/* Botão WhatsApp */}
        <div className="flex justify-center mt-5">
          <BotaoCompartilhar />
        </div>
      </div>

      {/* Divisor ondulado */}
      <svg className="block w-full" style={{ height: '48px', display: 'block' }} viewBox="0 0 1200 48" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,24 C200,48 400,0 600,24 C800,48 1000,0 1200,24 L1200,48 L0,48 Z" fill="#FBF5EE" />
      </svg>
    </header>
  )
}

function Stat({ label, valor, destaque }) {
  return (
    <div className="text-center px-2">
      <p className={`font-display text-xl sm:text-2xl ${destaque ? 'text-terracotta' : 'text-charcoal'}`}>
        {valor}
      </p>
      <p className="font-body text-[10px] sm:text-xs text-charcoal-soft mt-0.5 leading-snug">{label}</p>
    </div>
  )
}

function BotaoCompartilhar() {
  const mensagem = `🌸 Chá Rifa da Maria Idália 🌸\n\nNossa filha está chegando em setembro e estamos organizando um chá rifa para ajudar nos preparativos! Cada número custa R$ ${CONFIG.rifa.precoPorNumero},00 e o pagamento é via Pix na hora.\n\n🎁 Prêmio: ${CONFIG.premio.descricao}\n\nEscolhe seu número aqui 👉 ${typeof window !== 'undefined' ? window.location.href : ''}`

  const link = `https://wa.me/?text=${encodeURIComponent(mensagem)}`

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-white font-body font-semibold text-sm px-5 py-2.5 rounded-full shadow-sm hover:brightness-95 transition-all focus-ring"
      style={{ background: '#25D366' }}
    >
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
        <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4a8.96 8.96 0 0 0-7.76 13.4L3 21l3.7-1.27a8.94 8.94 0 0 0 4.36 1.11h.01a8.96 8.96 0 0 0 8.94-8.97 8.9 8.9 0 0 0-2.41-5.55ZM12.06 19.4a7.4 7.4 0 0 1-3.77-1.03l-.27-.16-2.55.87.87-2.49-.18-.27a7.43 7.43 0 0 1 11.61-9.2 7.36 7.36 0 0 1 2.18 5.24 7.43 7.43 0 0 1-7.4 7.42Zm4.08-5.56c-.22-.11-1.32-.65-1.52-.73-.2-.07-.35-.11-.5.11-.15.22-.58.73-.71.88-.13.15-.26.16-.48.05-.22-.11-.94-.35-1.78-1.1-.66-.59-1.1-1.31-1.23-1.53-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.4.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.4-.07-.11-.5-1.21-.69-1.66-.18-.43-.36-.37-.5-.38-.13-.01-.28-.01-.43-.01-.15 0-.4.06-.6.28-.21.22-.79.77-.79 1.87 0 1.1.81 2.17.92 2.32.11.15 1.59 2.43 3.86 3.4.54.23.96.37 1.28.48.54.17 1.03.15 1.42.09.43-.06 1.32-.54 1.51-1.06.19-.52.19-.97.13-1.06-.05-.1-.2-.15-.42-.26Z" />
      </svg>
      Compartilhar no WhatsApp
    </a>
  )
}

function IlustracaoBebe() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Ilustração de bebê" role="img">
      {/* Fundo circular suave */}
      <circle cx="80" cy="80" r="75" fill="#F9E8EC" />
      <circle cx="80" cy="80" r="65" fill="#FAEEF5" stroke="#E8B4BC" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Ursinho sentado */}
      {/* corpo */}
      <ellipse cx="80" cy="102" rx="28" ry="26" fill="#D9B99B" />
      {/* cabeça */}
      <circle cx="80" cy="72" r="24" fill="#D9B99B" />
      {/* orelhas */}
      <circle cx="58" cy="52" r="9" fill="#D9B99B" />
      <circle cx="58" cy="52" r="5.5" fill="#C49A7A" />
      <circle cx="102" cy="52" r="9" fill="#D9B99B" />
      <circle cx="102" cy="52" r="5.5" fill="#C49A7A" />
      {/* focinho */}
      <ellipse cx="80" cy="78" rx="10" ry="7" fill="#C49A7A" />
      {/* nariz */}
      <ellipse cx="80" cy="73" rx="3.5" ry="2.5" fill="#8B5E3C" />
      {/* boca sorridente */}
      <path d="M74 80 Q80 86 86 80" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* olhos */}
      <circle cx="71" cy="68" r="4" fill="white" />
      <circle cx="89" cy="68" r="4" fill="white" />
      <circle cx="72" cy="68" r="2.2" fill="#3A3530" />
      <circle cx="90" cy="68" r="2.2" fill="#3A3530" />
      {/* brilho nos olhos */}
      <circle cx="73.2" cy="66.8" r="0.9" fill="white" />
      <circle cx="91.2" cy="66.8" r="0.9" fill="white" />
      {/* braços */}
      <ellipse cx="52" cy="100" rx="10" ry="14" fill="#D9B99B" transform="rotate(-15 52 100)" />
      <ellipse cx="108" cy="100" rx="10" ry="14" fill="#D9B99B" transform="rotate(15 108 100)" />
      {/* patinhas */}
      <ellipse cx="65" cy="126" rx="10" ry="7" fill="#C49A7A" />
      <ellipse cx="95" cy="126" rx="10" ry="7" fill="#C49A7A" />
      {/* dedos pés */}
      <circle cx="59" cy="122" r="2.5" fill="#B8896A" />
      <circle cx="65" cy="120" r="2.5" fill="#B8896A" />
      <circle cx="71" cy="122" r="2.5" fill="#B8896A" />
      <circle cx="89" cy="122" r="2.5" fill="#B8896A" />
      <circle cx="95" cy="120" r="2.5" fill="#B8896A" />
      <circle cx="101" cy="122" r="2.5" fill="#B8896A" />
      {/* laço rosa no topo */}
      <path d="M68 50 Q74 44 80 50 Q86 44 92 50 Q86 56 80 50 Q74 56 68 50Z" fill="#E8B4BC" />
      <circle cx="80" cy="50" r="3.5" fill="#C97C5D" />

      {/* Estrelinhas decorativas */}
      <text x="20" y="38" fontSize="12" fill="#E8B4BC" opacity="0.9">✦</text>
      <text x="130" y="45" fontSize="10" fill="#9CAF88" opacity="0.8">✦</text>
      <text x="26" y="128" fontSize="8" fill="#C97C5D" opacity="0.6">✦</text>
      <text x="134" y="125" fontSize="9" fill="#E8B4BC" opacity="0.7">✦</text>
    </svg>
  )
}
