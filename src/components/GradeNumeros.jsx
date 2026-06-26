const STATUS_STYLES = {
  livre:
    'bg-cream border-sage/40 text-charcoal hover:border-sage hover:bg-sage/10 hover:-translate-y-0.5 cursor-pointer',
  reservado:
    'bg-blush/40 border-blush-deep text-charcoal-soft cursor-not-allowed',
  pago:
    'bg-sage/25 border-sage-deep text-sage-deep cursor-not-allowed',
  selecionado:
    'bg-terracotta border-terracotta text-cream shadow-md -translate-y-0.5 cursor-pointer',
}

const STATUS_LABEL = {
  livre: 'disponível',
  reservado: 'reservado',
  pago: 'vendido',
}

export default function GradeNumeros({ numeros, selecionado, onSelecionar }) {
  return (
    <div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center mb-6 font-body text-xs text-charcoal-soft">
        <LegendItem cor="bg-cream border border-sage/40" label="Disponível" />
        <LegendItem cor="bg-blush/40 border border-blush-deep" label="Reservado" />
        <LegendItem cor="bg-sage/25 border border-sage-deep" label="Vendido" />
      </div>

      <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2.5 sm:gap-3">
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
              className={`
                relative aspect-square rounded-full border-2 font-body font-semibold text-sm
                flex items-center justify-center transition-all duration-150 focus-ring
                ${STATUS_STYLES[styleKey]}
              `}
            >
              {String(item.numero).padStart(3, '0')}
              {/* furinho de botão, sutil, só nos disponíveis/selecionados */}
              {(clicavel || isSelecionado) && (
                <span
                  className={`absolute w-1 h-1 rounded-full top-2 left-1/2 -translate-x-1/2 ${
                    isSelecionado ? 'bg-cream/50' : 'bg-charcoal/15'
                  }`}
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LegendItem({ cor, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-3 h-3 rounded-full ${cor}`} aria-hidden="true" />
      {label}
    </span>
  )
}
