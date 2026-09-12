import { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { convertirBaseConPasos } from './utils/converter';

const OPCIONES_PRECISION = [5, 8, 10, 12, 16, 20, 30, 50, 100, 200, 500, 1000, 2000];

const ESTILO_FASE = {
  polinomico_entero: { borde: 'border-l-sky-500', texto: 'text-sky-400', etiqueta: 'Parte entera → base 10' },
  polinomico_fraccionario: { borde: 'border-l-indigo-500', texto: 'text-indigo-400', etiqueta: 'Parte fraccionaria → base 10' },
  division: { borde: 'border-l-amber-500', texto: 'text-amber-400', etiqueta: 'Divisiones sucesivas' },
  multiplicacion: { borde: 'border-l-teal-500', texto: 'text-teal-400', etiqueta: 'Multiplicaciones sucesivas' },
};

export default function App() {
  const [numeroEntrada, setNumeroEntrada] = useState('110101.1110001');
  const [baseOrigen, setBaseOrigen] = useState(2);
  const [baseDestino, setBaseDestino] = useState(10);
  const [precisionDecimal, setPrecisionDecimal] = useState(8);
  const [indicePaso, setIndicePaso] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(false);
  const timeoutRef = useRef(null);

  const conversion = convertirBaseConPasos(numeroEntrada, baseOrigen, baseDestino, precisionDecimal);

  const todosLosPasos = [];
  if (conversion.esValido) {
    conversion.pasosPolinomicosEnteros.forEach((p) => todosLosPasos.push({ tipo: 'polinomico_entero', datos: p }));
    conversion.pasosPolinomicosFraccionarios.forEach((p) => todosLosPasos.push({ tipo: 'polinomico_fraccionario', datos: p }));
    conversion.pasosDivision.forEach((p) => todosLosPasos.push({ tipo: 'division', datos: p }));
    conversion.pasosMultiplicacion.forEach((p) => todosLosPasos.push({ tipo: 'multiplicacion', datos: p }));
  }
  const totalPasos = todosLosPasos.length;
  const pasoActual = todosLosPasos[Math.min(indicePaso, totalPasos - 1)];

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (!reproduciendo) return undefined;

    if (indicePaso < totalPasos - 1) {
      timeoutRef.current = setTimeout(() => setIndicePaso((p) => p + 1), 1600);
    } else {
      timeoutRef.current = setTimeout(() => setReproduciendo(false), 0);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [reproduciendo, indicePaso, totalPasos]);

  const reiniciarPasos = () => {
    setIndicePaso(0);
    setReproduciendo(false);
  };

  const progreso = totalPasos > 0 ? ((indicePaso + 1) / totalPasos) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E6EDF3] font-sans">
      <style>{`
        @keyframes pasoEntrada { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .paso-anim { animation: pasoEntrada 0.3s ease-out; }
      `}</style>

      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Conversor de bases numéricas</h1>
          <p className="text-sm text-[#7D8590]">Convierte números enteros y fraccionarios entre bases 2 a 36, paso a paso.</p>
        </div>

        {/* Entrada */}
        <div className="bg-[#11151C] border border-[#232A34] rounded-lg p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs text-[#7D8590] mb-1.5">Número</label>
              <input
                type="text"
                value={numeroEntrada}
                onChange={(e) => { setNumeroEntrada(e.target.value); reiniciarPasos(); }}
                placeholder="110101.111"
                className={`w-full min-w-0 bg-[#0B0E14] border rounded-md px-3 py-2 font-mono text-base uppercase tracking-wide focus:outline-none transition-colors ${conversion.esValido ? 'border-[#2A313C] focus:border-amber-400' : 'border-red-500/70 focus:border-red-400'
                  }`}
              />
            </div>
            <div>
              <label className="block text-xs text-[#7D8590] mb-1.5">Base de origen</label>
              <select
                value={baseOrigen}
                onChange={(e) => { setBaseOrigen(Number(e.target.value)); reiniciarPasos(); }}
                className="w-full bg-[#0B0E14] border border-[#2A313C] rounded-md px-3 py-2 text-base focus:outline-none focus:border-amber-400"
              >
                {Array.from({ length: 35 }, (_, i) => i + 2).map((b) => (
                  <option key={b} value={b}>Base {b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#7D8590] mb-1.5">Base de destino</label>
              <select
                value={baseDestino}
                onChange={(e) => { setBaseDestino(Number(e.target.value)); reiniciarPasos(); }}
                className="w-full bg-[#0B0E14] border border-[#2A313C] rounded-md px-3 py-2 text-base focus:outline-none focus:border-amber-400"
              >
                {Array.from({ length: 35 }, (_, i) => i + 2).map((b) => (
                  <option key={b} value={b}>Base {b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#7D8590] mb-1.5">Precisión (decimales)</label>
              <select
                value={precisionDecimal}
                onChange={(e) => { setPrecisionDecimal(Number(e.target.value)); reiniciarPasos(); }}
                className="w-full bg-[#0B0E14] border border-[#2A313C] rounded-md px-3 py-2 text-base focus:outline-none focus:border-amber-400"
              >
                {OPCIONES_PRECISION.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          {!conversion.esValido && (
            <p className="text-red-400 text-sm break-words">{conversion.error}</p>
          )}
        </div>

        {conversion.esValido && totalPasos > 0 && (
          <>
            {/* Controles */}
            <div className="bg-[#11151C] border border-[#232A34] rounded-lg px-4 py-3.5 space-y-3">
              <div className="flex items-center justify-between gap-3 text-sm text-[#7D8590]">
                <span>Paso {indicePaso + 1} de {totalPasos}</span>
                <div className="flex-1 max-w-[140px] h-1.5 bg-[#232A34] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${progreso}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => { setReproduciendo(false); setIndicePaso((p) => Math.max(0, p - 1)); }}
                  disabled={indicePaso === 0}
                  aria-label="Paso anterior"
                  className="p-2 rounded-md border border-[#2A313C] hover:border-amber-400 disabled:opacity-30 disabled:hover:border-[#2A313C] transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setReproduciendo((r) => !r)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-amber-400 text-[#0B0E14] font-medium hover:bg-amber-300 transition-colors min-w-[128px] justify-center"
                >
                  {reproduciendo ? <><Pause size={16} /> Pausar</> : <><Play size={16} /> Reproducir</>}
                </button>
                <button
                  onClick={() => { setReproduciendo(false); setIndicePaso((p) => Math.min(totalPasos - 1, p + 1)); }}
                  disabled={indicePaso === totalPasos - 1}
                  aria-label="Siguiente paso"
                  className="p-2 rounded-md border border-[#2A313C] hover:border-amber-400 disabled:opacity-30 disabled:hover:border-[#2A313C] transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={reiniciarPasos}
                  aria-label="Reiniciar"
                  className="p-2 rounded-md border border-[#2A313C] hover:border-amber-400 transition-colors"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>

            {/* Visualizador */}
            <div
              key={indicePaso}
              className={`paso-anim bg-[#11151C] border border-[#232A34] border-l-4 ${ESTILO_FASE[pasoActual.tipo].borde} rounded-lg p-5 sm:p-6 min-h-[260px] flex flex-col justify-center overflow-hidden`}
            >
              <span className={`text-xs font-medium ${ESTILO_FASE[pasoActual.tipo].texto} mb-4`}>
                {ESTILO_FASE[pasoActual.tipo].etiqueta}
              </span>

              {pasoActual.tipo === 'polinomico_entero' && (() => {
                const p = pasoActual.datos;
                // Calculamos la potencia exacta con BigInt para evitar que Math.pow devuelva Infinity
                const valorPotenciaExacta = (BigInt(conversion.baseOrigen) ** BigInt(p.potencia)).toString();

                return (
                  <div className="space-y-3 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-lg sm:text-xl break-words">
                      <span className="text-sky-400 font-bold">{p.caracter}</span>
                      <span>× {conversion.baseOrigen}<sup>{p.potencia}</sup></span>
                    </div>

                    <p className="text-sm text-[#8B949E] font-mono break-words">
                      = {p.valorDigito} × {valorPotenciaExacta} =
                      <span className="text-sky-300 font-semibold"> {p.valorTermino}</span>
                    </p>

                    <p className="text-lg sm:text-xl font-semibold font-mono break-words">
                      Suma acumulada: {p.acumulado}
                    </p>
                  </div>
                );
              })()}

              {pasoActual.tipo === 'polinomico_fraccionario' && (() => {
                const p = pasoActual.datos;
                return (
                  <div className="space-y-3 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-lg sm:text-xl break-words">
                      <span className="text-indigo-400 font-bold">{p.caracter}</span>
                      <span>× {conversion.baseOrigen}<sup>{p.potencia}</sup></span>
                    </div>
                    <p className="text-sm text-[#8B949E] font-mono break-words">
                      = {p.valorDigito} × {Math.pow(conversion.baseOrigen, p.potencia).toFixed(6)} =
                      <span className="text-indigo-300 font-semibold"> {p.valorTermino.toFixed(6)}</span>
                    </p>
                    <p className="text-lg sm:text-xl font-semibold font-mono break-words">
                      Acumulado fraccionario: {p.acumuladoFraccionario.toFixed(8)}
                    </p>
                  </div>
                );
              })()}

              {pasoActual.tipo === 'division' && (() => {
                const p = pasoActual.datos;
                return (
                  <div className="space-y-4 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-lg sm:text-xl">
                      <span className="px-3 py-1.5 rounded-md bg-[#0B0E14] border border-[#2A313C]">{p.dividendo}</span>
                      <span className="text-[#7D8590]">÷ {conversion.baseDestino} =</span>
                      <span className="px-3 py-1.5 rounded-md bg-[#0B0E14] border border-[#2A313C]">{p.cociente}</span>
                    </div>
                    <div className="inline-block px-4 py-3 bg-[#0B0E14] border border-[#2A313C] rounded-lg">
                      <p className="text-xs text-[#7D8590] mb-1">Residuo (dígito)</p>
                      <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 break-all">
                        {p.caracterResiduo} ({p.residuo})
                      </span>
                    </div>
                  </div>
                );
              })()}

              {pasoActual.tipo === 'multiplicacion' && (() => {
                const p = pasoActual.datos;
                return (
                  <div className="space-y-4 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-base sm:text-lg break-words">
                      {p.entradaFraccion.toFixed(6)} × {conversion.baseDestino} =
                      <span className="text-teal-300 font-semibold">{p.producto.toFixed(6)}</span>
                    </div>
                    <div className="inline-block px-4 py-3 bg-[#0B0E14] border border-[#2A313C] rounded-lg">
                      <p className="text-xs text-[#7D8590] mb-1">Dígito extraído (parte entera)</p>
                      <span className="text-2xl sm:text-3xl font-bold font-mono text-teal-400 break-all">
                        {p.caracterDigito} ({p.digitoObtenido})
                      </span>
                    </div>
                    <p className="text-sm text-[#8B949E] font-mono break-words">
                      Siguiente fracción: {p.nuevaFraccion.toFixed(6)}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Resultado */}
            <div className="bg-amber-400 text-[#0B0E14] rounded-lg p-6 text-center">
              <p className="text-xs font-medium opacity-70 mb-1">Resultado final en base {conversion.baseDestino}</p>
              <p className="font-mono font-bold break-all leading-tight text-2xl sm:text-3xl md:text-4xl">
                {conversion.resultadoFinal}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}