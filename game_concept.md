# Concepto del Juego: "Galería de Tiro al Amigo"

## Título Propuesto:
"Galería de Tiro al Amigo" o "¡Tiro al Clavo!"

## Concepto General:
Un juego de tiro al plato con un giro humorístico para la web. En lugar de platos de arcilla, los objetivos son fotografías de tus amigos que aparecen volando por la pantalla desde diferentes direcciones y velocidades. El tono será ligero, divertido y caricaturesco, evitando cualquier connotación negativa real. La idea es reírse *con* los amigos, no *de* ellos de forma maliciosa.

## Tono Humorístico:
El humor puede venir de las expresiones faciales de las fotos (elegir fotos graciosas), efectos de sonido exagerados al "golpear" un objetivo, animaciones simples y divertidas al acertar, y quizás comentarios ingeniosos en pantalla.

## Plan Detallado:

### 1. Jugabilidad (Web):
*   El jugador usará el ratón para apuntar y hacer clic para "disparar".
*   Las fotos de los amigos aparecerán en la pantalla, moviéndose en trayectorias variadas (rectas, curvas, parabólicas) y a diferentes velocidades.
*   Habrá diferentes "rondas" o niveles, cada uno quizás con un fondo diferente (un campo, un salón, etc.) y patrones de movimiento más complejos.
*   Se podría incluir un medidor de "munición" o un tiempo limitado por ronda para añadir un desafío.
*   Al "golpear" una foto, esta podría hacer una animación cómica (por ejemplo, girar, encogerse, o mostrar un efecto de "explosión" de confeti) y desaparecer.
*   Si una foto sale de la pantalla sin ser "golpeada", se podría perder una "vida" o puntos.

### 2. Mecánicas de Puntuación:
*   **Puntos por Acierto:** Cada foto "golpeada" otorga una cantidad base de puntos.
*   **Multiplicadores:** Acertar varias fotos consecutivas sin fallar podría activar un multiplicador de puntos temporal.
*   **Puntos Extra:** Fotos que se mueven más rápido o en patrones más difíciles podrían valer más puntos.
*   **Penalizaciones:** Perder una "vida" o dejar que una foto escape podría restar puntos.
*   **Puntuación por Amigo:** Se podría llevar un registro de cuántas veces se ha "golpeado" la foto de cada amigo, quizás con una tabla de clasificación interna al final de la partida.
*   **Puntuación Total:** La puntuación final sería la suma de puntos obtenidos a lo largo de las rondas.

### 3. Ideas Adicionales:
*   **Tipos de Objetivos:** Además de las fotos normales, podría haber fotos especiales (por ejemplo, con sombreros graciosos añadidos digitalmente) que otorguen más puntos o activen power-ups.
*   **Power-ups:**
    *   "Disparo Múltiple": Permite disparar varias veces con un solo clic por un corto tiempo.
    *   "Tiempo Lento": Ralentiza el movimiento de las fotos temporalmente.
    *   "Comodín": Un objetivo especial que, al ser "golpeado", otorga una gran cantidad de puntos o limpia la pantalla de objetivos.
*   **Obstáculos:** Objetos que no dan puntos (o incluso restan si se "golpean") que se mueven entre las fotos de los amigos, como pájaros de goma o platillos voladores de juguete.
*   **Personalización:** Una característica clave sería la facilidad para que el usuario suba las fotos de sus amigos para usarlas como objetivos.

## Estructura Técnica (Breve):
Para un juego web, se podría utilizar HTML, CSS y JavaScript. Un framework como Phaser o PixiJS podría facilitar la gestión de gráficos y animaciones. Las fotos se cargarían dinámicamente.