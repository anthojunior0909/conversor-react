# Conversor de Bases Numéricas

Aplicación web desarrollada con **React** y **Vite** que permite convertir números entre diferentes sistemas de numeración, mostrando el procedimiento paso a paso. Admite números enteros y fraccionarios y permite elegir la precisión decimal del resultado.

## Características

- Conversión entre bases numéricas desde la **base 2 hasta la base 36**.
- Soporte para números enteros y fraccionarios.
- Selección de la base de origen y de la base de destino.
- Configuración de la precisión decimal del resultado.
- Explicación visual del procedimiento de conversión:
  - **Evaluación polinómica de la parte entera** en base 10.
  - **Evaluación polinómica de la parte fraccionaria** en base 10.
  - **Divisiones sucesivas** para obtener la parte entera en la base de destino.
  - **Multiplicaciones sucesivas** para obtener la parte fraccionaria en la base de destino.
- Controles para avanzar, retroceder, reproducir, pausar y reiniciar los pasos.
- Indicador de progreso y presentación del resultado final.
- Interfaz adaptable a diferentes tamaños de pantalla.

## Tecnologías utilizadas

- [React](https://react.dev/) — construcción de la interfaz.
- [Vite](https://vite.dev/) — servidor de desarrollo y herramienta de compilación.
- [JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript) — lógica de la aplicación.
- [Tailwind CSS](https://tailwindcss.com/) — estilos de la interfaz.
- [Lucide React](https://lucide.dev/) — iconos.
- `BigInt` — cálculo de potencias enteras grandes sin depender de la precisión habitual de `Number`.

## Requisitos previos

Antes de ejecutar el proyecto, instala:

- [Node.js](https://nodejs.org/) (incluye npm).
- [Visual Studio Code](https://code.visualstudio.com/) u otro editor de código.

Comprueba la instalación desde una terminal:

```bash
node -v
npm -v
```

## Instalación y ejecución

1. Abre la carpeta del proyecto en Visual Studio Code.
2. Abre una terminal en la carpeta raíz del proyecto.
3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abre en el navegador la dirección local que muestre Vite en la terminal (normalmente `http://localhost:5173`).

Para detener el servidor, presiona `Ctrl + C` en la terminal.

## Uso de la aplicación

1. Escribe el número que deseas convertir.
2. Selecciona la **base de origen** del número.
3. Selecciona la **base de destino**.
4. Elige la cantidad de decimales de precisión.
5. Revisa los pasos que se muestran en pantalla.
6. Usa los controles para avanzar o retroceder, reproducir automáticamente, pausar o reiniciar el procedimiento.
7. Consulta el resultado final al terminar la conversión.

### Ejemplo

Para convertir `110101.1110001` de base 2 a base 10:

- Número de entrada: `110101.1110001`
- Base de origen: `2`
- Base de destino: `10`
- Precisión decimal: `8`

La aplicación mostrará el procedimiento y el resultado calculado. El valor de la parte fraccionaria puede depender de la precisión seleccionada.

## Estructura del proyecto

La estructura puede variar según los archivos que tengas en tu proyecto. Por el código de la aplicación, se utilizan al menos estos archivos:

```text
nombre-del-proyecto/
├── src/
│   ├── App.jsx
│   └── utils/
│       └── converter.js
├── package.json
└── README.md
```

- `App.jsx`: contiene la interfaz, los controles de navegación y la visualización de los pasos.
- `utils/converter.js`: contiene la función `convertirBaseConPasos`, que realiza la conversión y genera los pasos del procedimiento.
- `package.json`: define las dependencias y los comandos del proyecto.
- `README.md`: contiene la documentación del proyecto.

> Si tus archivos están ubicados en otras carpetas o tienen otros nombres, actualiza esta estructura para que coincida con tu proyecto real.

## Compilar para producción

Para generar una versión optimizada de la aplicación, ejecuta:

```bash
npm run build
```

Los archivos compilados se guardarán normalmente en la carpeta `dist/`.

Para probar localmente la versión compilada:

```bash
npm run preview
```

## Notas

- Introduce un número válido para la base seleccionada. Por ejemplo, en base 2 solo se permiten los dígitos `0` y `1`, además del separador fraccionario.
- Para bases superiores a 10, las letras se usan para representar valores de dígitos adicionales; sigue la convención que implementa el conversor.
- La precisión elegida controla la cantidad de dígitos fraccionarios calculados y mostrados; no garantiza que toda fracción tenga una representación finita en la base de destino.

## Autor

Añade aquí tu nombre, curso o institución si necesitas identificar el proyecto para una entrega académica.
