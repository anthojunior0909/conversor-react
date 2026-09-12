/**
 * Convierte un número en 'baseOrigen' a 'baseDestino' registrando el procedimiento paso a paso.
 * Soporta números enteros gigantes y fraccionarios mediante BigInt (sin límite de dígitos / Infinity).
 */
export function convertirBaseConPasos(numeroEntrada, baseOrigen, baseDestino, precisionDecimal = 8) {
  const textoLimpio = numeroEntrada.trim().toUpperCase();

  if (!textoLimpio) {
    return { esValido: false, error: 'Ingresa un número para convertir.' };
  }

  // Validar formato (máximo un solo punto decimal)
  const partesInput = textoLimpio.split('.');
  if (partesInput.length > 2) {
    return { esValido: false, error: 'El número no puede tener más de un punto decimal.' };
  }

  const cadenaEntera = partesInput[0] || '0';
  const cadenaFraccionaria = partesInput[1] || '';

  // Validar caracteres permitidos
  const caracteresValidos = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, baseOrigen);
  for (const c of cadenaEntera + cadenaFraccionaria) {
    if (!caracteresValidos.includes(c)) {
      return {
        esValido: false,
        error: `El carácter '${c}' no es válido en Base ${baseOrigen}.`
      };
    }
  }

  const baseOrigenBig = BigInt(baseOrigen);
  const baseDestinoBig = BigInt(baseDestino);

  // ==========================================
  // ETAPA 1A: PARTE ENTERA A BASE 10 (con BigInt)
  // ==========================================
  const digitosEnteros = cadenaEntera.split('');
  const lenEntero = digitosEnteros.length;
  let valorBase10EnteroBig = 0n;
  const pasosPolinomicosEnteros = [];

  for (let i = 0; i < lenEntero; i++) {
    const caracter = digitosEnteros[i];
    const valorDigito = parseInt(caracter, baseOrigen);
    const potencia = lenEntero - 1 - i;

    // Calculamos la potencia exacta en BigInt
    const terminoBig = BigInt(valorDigito) * (baseOrigenBig ** BigInt(potencia));
    valorBase10EnteroBig += terminoBig;

    pasosPolinomicosEnteros.push({
      caracter,
      valorDigito,
      potencia,
      valorTermino: terminoBig.toString(),
      acumulado: valorBase10EnteroBig.toString()
    });
  }

  // ==========================================
  // ETAPA 1B: PARTE FRACCIONARIA A BASE 10
  // ==========================================
  const digitosFraccionarios = cadenaFraccionaria.split('');
  const pasosPolinomicosFraccionarios = [];

  // Convertimos la fracción a Razón Exacta BigInt: numerador / denominador
  let numFracBig = 0n;
  let denFracBig = 1n;

  for (let j = 0; j < digitosFraccionarios.length; j++) {
    const caracter = digitosFraccionarios[j];
    const valorDigito = BigInt(parseInt(caracter, baseOrigen));
    const potencia = -(j + 1);

    numFracBig = numFracBig * baseOrigenBig + valorDigito;
    denFracBig = denFracBig * baseOrigenBig;

    pasosPolinomicosFraccionarios.push({
      caracter,
      valorDigito: Number(valorDigito),
      potencia,
      valorTermino: `(${valorDigito}/${baseOrigen}^${j+1})`,
      acumuladoFraccionario: `(${numFracBig}/${denFracBig})`
    });
  }

  // ==========================================
  // ETAPA 2A: DIVISIONES SUCESIVAS (Parte Entera con BigInt)
  // ==========================================
  const pasosDivision = [];
  let valorEnteroActual = valorBase10EnteroBig;
  let digitosResultadoEntero = [];

  if (valorEnteroActual === 0n) {
    pasosDivision.push({ dividendo: '0', cociente: '0', residuo: 0, caracterResiduo: '0' });
    digitosResultadoEntero.push('0');
  } else {
    while (valorEnteroActual > 0n) {
      const cociente = valorEnteroActual / baseDestinoBig;
      const residuoBig = valorEnteroActual % baseDestinoBig;
      const residuo = Number(residuoBig);
      const caracterResiduo = residuo.toString(baseDestino).toUpperCase();

      pasosDivision.push({
        dividendo: valorEnteroActual.toString(),
        cociente: cociente.toString(),
        residuo,
        caracterResiduo
      });

      digitosResultadoEntero.unshift(caracterResiduo);
      valorEnteroActual = cociente;
    }
  }

  // ==========================================
  // ETAPA 2B: MULTIPLICACIONES SUCESIVAS (Parte Fraccionaria con BigInt)
  // ==========================================
  const pasosMultiplicacion = [];
  const digitosResultadoFraccionario = [];

  if (cadenaFraccionaria.length > 0 && precisionDecimal > 0) {
    let tempNum = numFracBig;
    let tempDen = denFracBig;

    let iteracion = 0;
    while (tempNum > 0n && iteracion < precisionDecimal) {
      const numAntes = tempNum;
      tempNum *= baseDestinoBig;

      const digitoBig = tempNum / tempDen;
      tempNum %= tempDen;

      const digitoObtenido = Number(digitoBig);
      const caracterDigito = digitoObtenido.toString(baseDestino).toUpperCase();
      digitosResultadoFraccionario.push(caracterDigito);

      pasosMultiplicacion.push({
        entradaFraccion: `(${numAntes}/${tempDen})`,
        producto: `(${numAntes * baseDestinoBig}/${tempDen})`,
        digitoObtenido,
        caracterDigito,
        nuevaFraccion: `(${tempNum}/${tempDen})`
      });

      iteracion++;
    }
  }

  // Construir resultado final
  const parteEnteraFinal = digitosResultadoEntero.join('');
  const parteFraccionariaFinal = digitosResultadoFraccionario.length > 0
    ? '.' + digitosResultadoFraccionario.join('')
    : '';

  const resultadoFinal = parteEnteraFinal + parteFraccionariaFinal;

  return {
    esValido: true,
    textoEntrada: textoLimpio,
    tieneDecimal: cadenaFraccionaria.length > 0,
    baseOrigen,
    baseDestino,
    precisionDecimal,
    valorBase10Entero: valorBase10EnteroBig.toString(),
    pasosPolinomicosEnteros,
    pasosPolinomicosFraccionarios,
    pasosDivision,
    pasosMultiplicacion,
    resultadoFinal
  };
}