# Dirección visual — Operación Banana

Este documento contiene decisiones **bloqueadas**. No reinterpretarlas sin aprobación de Sofi.

## Objetivo visual

El resultado debe sentirse como un pequeño videojuego ilustrado y pulido, no como una landing page ni como una demo de HTML.

Formato prioritario: **16:9 en computador** para compartir pantalla durante una videollamada.

## Estética

- cartoon 3D / ilustración cinematográfica
- cálida
- bonita
- divertida
- profundidad visual
- escenarios completos
- iluminación ambiental
- vegetación, caminos, árboles, montañas y pequeños detalles
- UI integrada en el arte
- animación ambiental suave

Evitar:

- grids visibles
- cajas web genéricas
- personajes hechos únicamente con círculos y CSS básico
- emojis utilizados como arte principal
- letras S/D sobre muñecos para identificarlos
- rediseñar los personajes entre escenas
- exceso de texto sobre el escenario

## Personajes

Crear **un solo asset maestro por personaje**, idealmente SVG, y reutilizarlo en todas las escenas.

### Sofi

- personaje amarillo pequeño
- cabello corto / recogido
- gafas grandes
- ropa azul
- expresión divertida
- personalidad algo impulsiva

### Daiana

Daiana debe ser un personaje independiente, no “Sofi con otra peluca”.

Reglas obligatorias:

- cabello castaño oscuro
- cabello largo
- cabello suelto
- cabello visible cayendo por ambos lados
- cabello visible por detrás del cuerpo
- diseño algo más delicado
- ropa diferente de Sofi
- expresiones propias
- mismo diseño en todas las escenas

## Flujo

1. Portada: Operación Banana.
2. Robo de la Banana Dorada.
3. Elección: correr / seguir disimuladamente.
4. Persecución jugable.
5. Encuentro con guardia.
6. Elección: bailar / ofrecer otra banana.
7. Recuperación de la banana.
8. Escena final nocturna tranquila.

## Persecución

Sofi se controla con:

- WASD o flechas
- salto con W, flecha arriba o espacio

Daiana corre automáticamente junto a Sofi.

No hay Game Over.

Los choques generan una reacción corta y graciosa, pero el juego continúa.

## Experiencia

Debe poder completarse en unos 5–10 minutos.

Daiana participa verbalmente durante la videollamada eligiendo qué hacer. Sofi maneja el computador.

La intención es que Daiana se ría y se sienta importante, sin obligarla a hacer configuraciones ni aprender controles.

## Final

El mensaje final vive en `js/scenes.js` como `FINAL_MESSAGE`.

No modificar su redacción sin aprobación explícita de Sofi.
