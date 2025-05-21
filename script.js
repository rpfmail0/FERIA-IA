const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Establecer dimensiones del canvas (debe coincidir con el CSS)
canvas.width = 800;
canvas.height = 600;

// Array para almacenar los objetivos (fotos de amigos)
const targets = [];

// Array para almacenar los objetivos (fotos de amigos)

// Array para almacenar las URLs de las imágenes de amigos (rutas locales)
const friendImageUrls = [
    'friend1.bmp', // Asumiendo que friend1.bmp está en la raíz del espacio de trabajo
    'friend2.bmp', // Asumiendo que friend2.bmp está en la raíz del espacio de trabajo
    // Añadir más rutas de imágenes de amigos aquí
];

// Array para almacenar las URLs de las imágenes de marco graciosas (URLs de ejemplo)
const frameImageUrls = [
    'https://via.placeholder.com/60x60?text=Pirata', // URL de ejemplo para marco de pirata
    'https://via.placeholder.com/60x60?text=Dino',   // URL de ejemplo para marco de dinosaurio
    // Añadir más URLs de imágenes de marco aquí
];


// Array para almacenar los objetos Image precargados de amigos y marcos
const friendImages = [];
const frameImages = [];
let loadedImagesCount = 0;
let totalImagesToLoad = friendImageUrls.length + frameImageUrls.length;


// Objeto para almacenar la puntuación por amigo (clave: URL de la imagen, valor: puntuación)
const friendScores = {};


// Clase o estructura para un objetivo
class Target {
    constructor(image, imageUrl, frameImage, x, y, speedX, speedY) {
        this.image = image; // Usar el objeto Image precargado del amigo
        this.imageUrl = imageUrl; // Guardar la URL para identificar al amigo
        this.frameImage = frameImage; // Usar el objeto Image precargado del marco
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.width = 60; // Tamaño del objetivo (ajustado para el marco)
        this.height = 60; // Tamaño del objetivo (ajustado para el marco)

        // Propiedades para el cambio de dirección aleatorio
        this.changeDirectionInterval = Math.random() * 100 + 50; // Cambiar dirección cada 50-150 frames
        this.timeSinceLastDirectionChange = 0;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Incrementar temporizador de cambio de dirección
        this.timeSinceLastDirectionChange++;

        // Cambiar de dirección si ha pasado el intervalo o si choca con los bordes
        if (this.timeSinceLastDirectionChange >= this.changeDirectionInterval ||
            this.x <= 0 || this.x + this.width >= canvas.width ||
            this.y <= 0 || this.y + this.height >= canvas.height) {

            // Rebotar en los bordes
            if (this.x <= 0 || this.x + this.width >= canvas.width) {
                this.speedX *= -1;
            }
            if (this.y <= 0 || this.y + this.height >= canvas.height) {
                this.speedY *= -1;
            }

            // Cambiar dirección aleatoriamente (con un poco de impulso en la dirección rebotada)
            this.speedX = (Math.random() - 0.5) * 4 + (this.speedX > 0 ? 1 : -1) * Math.random() * 2;
            this.speedY = (Math.random() - 0.5) * 4 + (this.speedY > 0 ? 1 : -1) * Math.random() * 2;

            // Asegurar una velocidad mínima para evitar que se queden quietos
            const minSpeed = 1;
            if (Math.abs(this.speedX) < minSpeed) this.speedX = Math.sign(this.speedX) * minSpeed || minSpeed;
            if (Math.abs(this.speedY) < minSpeed) this.speedY = Math.sign(this.speedY) * minSpeed || minSpeed;


            // Resetear temporizador
            this.timeSinceLastDirectionChange = 0;
            this.changeDirectionInterval = Math.random() * 100 + 50; // Nuevo intervalo aleatorio
        }
    }

    draw() {
        // Dibujar la imagen del amigo
        ctx.drawImage(this.image, this.x + 5, this.y + 5, this.width - 10, this.height - 10); // Dibujar la imagen un poco más pequeña dentro del marco

        // Dibujar la imagen del marco encima
        if (this.frameImage && this.frameImage.complete && this.frameImage.naturalWidth > 0) {
             ctx.drawImage(this.frameImage, this.x, this.y, this.width, this.height);
        } else {
             console.warn("Imagen de marco no cargada o inválida para dibujar.");
        }
    }
}

// Función para crear un nuevo objetivo
function createTarget() {
    // Usar una imagen de amigo aleatoria de las precargadas
    if (friendImages.length === 0) {
        console.error("No hay imágenes de amigos precargadas.");
        return;
    }
    const randomFriendIndex = Math.floor(Math.random() * friendImages.length);
    const randomFriendImage = friendImages[randomFriendIndex];
    const imageUrl = friendImageUrls[randomFriendIndex]; // Obtener la URL correspondiente

    // Usar una imagen de marco aleatoria de las precargadas
    const randomFrameImage = frameImages.length > 0 ?
                             frameImages[Math.floor(Math.random() * frameImages.length)] :
                             null; // No usar marco si no hay imágenes de marco cargadas


    // Posición inicial aleatoria en la parte inferior de la pantalla
    const x = Math.random() * (canvas.width - 60); // Ajustar para el nuevo tamaño
    const y = canvas.height;
    // Velocidad aleatoria hacia arriba y horizontalmente
    const speedX = (Math.random() - 0.5) * 2; // Entre -1 y 1
    const speedY = -2 - Math.random() * 3; // Entre -2 y -5 (hacia arriba)

    targets.push(new Target(randomFriendImage, imageUrl, randomFrameImage, x, y, speedX, speedY));
}

// Función para dibujar el marcador dinámico
function drawDynamicScoreboard() {
    console.log("Dibujando marcador dinámico..."); // Depuración
    let startX = 10;
    const startY = 10; // Ajustar posición Y para que no se superponga con el título
    const itemSpacing = 100; // Espacio entre cada amigo en el marcador (aumentado un poco)
    const imageSize = 40; // Tamaño de la imagen del amigo en el marcador
    const frameSize = 50; // Tamaño del marco en el marcador (un poco más grande que la imagen del amigo)


    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';

    friendImages.forEach((friendImage, index) => {
        const imageUrl = friendImageUrls[index];
        const score = friendScores[imageUrl] || 0; // Obtener puntuación o 0 si no existe

        console.log(`Marcador para ${imageUrl}: x=${startX}, y=${startY}, score=${score}`); // Depuración

        // Encontrar el objeto Image del marco asociado a esta imagen de amigo (si aplica)
        // En esta implementación simple, no hay una asociación directa entre amigo y marco en el marcador.
        // Solo dibujaremos la imagen del amigo y la puntuación.
        // Si quisiéramos mostrar el marco específico asignado a ese amigo, necesitaríamos otra estructura de datos.
        // Por ahora, solo dibujaremos la imagen del amigo y la puntuación.

        // Dibujar la imagen del amigo en el marcador
        if (friendImage.complete && friendImage.naturalWidth > 0) {
             ctx.drawImage(friendImage, startX + (frameSize - imageSize) / 2, startY + (frameSize - imageSize) / 2, imageSize, imageSize); // Centrar imagen dentro del espacio del marco
             console.log(`Imagen de amigo dibujada en marcador para ${imageUrl}`); // Depuración
        } else {
             console.log(`Imagen de amigo NO dibujada en marcador para ${imageUrl} (complete: ${friendImage.complete}, naturalWidth: ${friendImage.naturalWidth})`); // Depuración
        }

        // Opcional: Dibujar un fondo o borde para el espacio del marcador si no usamos el marco aquí
        // ctx.strokeStyle = '#ccc';
        // ctx.strokeRect(startX, startY, frameSize, frameSize);


        // Dibujar la puntuación del amigo
        const scoreText = `${score}`;
        const textX = startX + frameSize + 5; // Posicionar texto después del espacio del marco
        const textY = startY + frameSize / 2 + 5; // Ajustar posición del texto
        ctx.fillText(scoreText, textX, textY);
        console.log(`Puntuación dibujada para ${imageUrl}: ${scoreText} en (${textX}, ${textY})`); // Depuración


        // Mover la posición inicial para el siguiente amigo
        startX += frameSize + 5 + ctx.measureText(scoreText).width + itemSpacing;
    });
}


// Bucle principal del juego
function gameLoop() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Actualizar y dibujar objetivos
    for (let i = 0; i < targets.length; i++) {
        targets[i].update();
        targets[i].draw();
    }

    // Eliminar objetivos que salieron de la pantalla (para evitar que el array crezca indefinidamente)
    for (let i = targets.length - 1; i >= 0; i--) {
        if (targets[i].y + targets[i].height < 0 || targets[i].x + targets[i].width < 0 || targets[i].x > canvas.width) {
            targets.splice(i, 1);
        }
    }

    // Dibujar el marcador dinámico
    drawDynamicScoreboard();

    // Solicitar el siguiente frame
    requestAnimationFrame(gameLoop);
}

// Función para precargar imágenes
function preloadImages(friendUrls, frameUrls) {
    // Precargar imágenes de amigos
    friendUrls.forEach(url => {
        const img = new Image();
        img.onload = () => {
            loadedImagesCount++;
            if (loadedImagesCount === totalImagesToLoad) {
                // Todas las imágenes cargadas, iniciar el juego
                startGame();
            }
        };
        img.onerror = () => {
            console.error(`Error al cargar la imagen de amigo: ${url}`);
            loadedImagesCount++; // Contar incluso si hay error para no bloquear el inicio
            if (loadedImagesCount === totalImagesToLoad) {
                 // Intentar iniciar el juego incluso si algunas imágenes fallaron
                startGame();
            }
        };
        img.src = url;
        friendImages.push(img);
    });

    // Precargar imágenes de marco
    frameUrls.forEach(url => {
        const img = new Image();
        img.onload = () => {
            loadedImagesCount++;
            if (loadedImagesCount === totalImagesToLoad) {
                // Todas las imágenes cargadas, iniciar el juego
                startGame();
            }
        };
        img.onerror = () => {
            console.error(`Error al cargar la imagen de marco: ${url}`);
            loadedImagesCount++; // Contar incluso si hay error para no bloquear el inicio
            if (loadedImagesCount === totalImagesToLoad) {
                 // Intentar iniciar el juego incluso si algunas imágenes fallaron
                startGame();
            }
        };
        img.src = url;
        frameImages.push(img);
    });
}

// Función para iniciar el juego
function startGame() {
    console.log("Todas las imágenes cargadas. Iniciando juego...");

    // Inicializar puntuaciones por amigo
    friendImageUrls.forEach(url => {
        friendScores[url] = 0;
    });

    // Crear objetivos iniciales (uno por cada imagen cargada)
    friendImages.forEach((image, index) => {
         // Crear objetivos iniciales en posiciones aleatorias dentro del canvas
        const x = Math.random() * (canvas.width - 60); // Ajustar para el nuevo tamaño
        const y = Math.random() * (canvas.height - 60); // Posición inicial dentro del canvas (ajustado)
        // Velocidad aleatoria (puede ser hacia cualquier dirección inicialmente)
        const speedX = (Math.random() - 0.5) * 2;
        const speedY = (Math.random() - 0.5) * 2;

        // Asignar un marco aleatorio al objetivo inicial
        const randomFrameImage = frameImages.length > 0 ?
                                 frameImages[Math.floor(Math.random() * frameImages.length)] :
                                 null;

        targets.push(new Target(image, friendImageUrls[index], randomFrameImage, x, y, speedX, speedY));
    });


    // Crear nuevos objetivos a intervalos regulares (ejemplo: cada 1 segundo)
    setInterval(createTarget, 1000);

    // Iniciar el bucle principal del juego si no está ya corriendo
    // (gameLoop ya se llama una vez al final del script)
}


// Añadir event listener para el clic del ratón
canvas.addEventListener('click', (event) => {
    // Obtener las coordenadas del clic relativas al canvas
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    console.log(`Click en: (${clickX}, ${clickY})`); // Depuración

    // Comprobar si el clic intersecta con algún objetivo
    for (let i = targets.length - 1; i >= 0; i--) {
        const target = targets[i];
         console.log(`Objetivo ${i}: x=${target.x}, y=${target.y}, width=${target.width}, height=${target.height}`); // Depuración
        if (clickX > target.x && clickX < target.x + target.width &&
            clickY > target.y && clickY < target.y + target.height) {
            // Se hizo clic en un objetivo, eliminarlo
            targets.splice(i, 1);
            // Incrementar puntuación del amigo golpeado
            if (friendScores[target.imageUrl] !== undefined) {
                 friendScores[target.imageUrl]++;
                 console.log(`¡Objetivo golpeado! Puntuación de ${target.imageUrl}: ${friendScores[target.imageUrl]}`); // Mensaje de prueba y puntuación por amigo
            } else {
                 console.log('¡Objetivo golpeado! URL de imagen no encontrada en friendScores.');
            }

            break; // Salir del bucle después de golpear un objetivo
        }
    }
});

// Iniciar la precarga de imágenes
preloadImages(friendImageUrls, frameImageUrls);

// Iniciar el bucle del juego (se ejecutará y esperará a que startGame establezca los objetivos)
gameLoop();