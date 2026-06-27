const STATUS_STYLES = {
  livre:
    'bg-white border-blush/60 text-charcoal hover:border-terracotta hover:bg-blush/10 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer',
  reservado:
    'bg-blush/30 border-blush-deep/60 text-blush-deep cursor-not-allowed',
  pago:
    'bg-sage/20 border-sage-deep/60 text-sage-deep cursor-not-allowed',
  selecionado:
    'border-terracotta text-white shadow-lg -translate-y-0.5 cursor-pointer',
}

const STATUS_LABEL = {
  livre: 'disponível',
  reservado: 'reservado',
  pago: 'vendido',
}

export default function GradeNumeros({ numeros, selecionado, onSelecionar }) {
  return (
    <div>
      {/* Legenda */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mb-7 font-body text-xs text-charcoal-soft">
        <LegendItem cor="bg-white border border-blush/60" label="Disponível" />
        <LegendItem cor="bg-blush/30 border border-blush-deep/60" label="Reservado" />
        <LegendItem cor="bg-sage/20 border border-sage-deep/60" label="Vendido" />
        <LegendItem cor="border-2 border-terracotta" style={{ background: 'linear-gradient(135deg, #C97C5D, #d4926f)' }} label="Selecionado" textCor="text-terracotta" />
      </div>

      {/* Grade */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-2.5">
        {numeros.map((item) => {
          const isSelecionado = selecionado === item.numero
          const styleKey = isSelecionado ? 'selecionado' : item.status
          const clicavel = item.status === 'livre'

          return (
            <button
              key={item.numero}
              type="button"
              disabled={!clicavel}
              onClick={() => onSelecionar(item.numero)}
              aria-label={`Número ${String(item.numero).padStart(3, '0')}, ${STATUS_LABEL[item.status]}`}
              aria-pressed={isSelecionado}
              style={isSelecionado ? { background: 'linear-gradient(135deg, #C97C5D, #d4926f)' } : {}}
              className={`
                relative aspect-square rounded-full border-2 font-body font-semibold text-xs sm:text-sm
                flex items-center justify-center transition-all duration-150 focus-ring
                ${STATUS_STYLES[styleKey]}
              `}
            >
              {String(item.numero).padStart(3, '0')}
              {/* furinho decorativo de botão */}
              {(clicavel || isSelecionado) && (
                <span
                  className={`absolute w-1 h-1 rounded-full top-1.5 left-1/2 -translate-x-1/2 ${
                    isSelecionado ? 'bg-white/40' : 'bg-charcoal/10'
                  }`}
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Dica de toque */}
      <p className="font-body text-xs text-charcoal/40 text-center mt-6 italic">
        Toque em um número disponível para reservá-lo 🌸
      </p>
    </div>
  )
}

function LegendItem({ cor, label, style, textCor }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`w-3.5 h-3.5 rounded-full ${cor}`}
        style={style}
        aria-hidden="true"
      />
      <span className={textCor || ''}>{label}</span>
    </span>
  )
}
