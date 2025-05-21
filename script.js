const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Cambiar el puntero del ratón a una imagen de pistola
canvas.style.cursor = 'url("pistol_cursor.jpg"), auto'; // Asumiendo que tienes una imagen de cursor llamada pistol_cursor.png en la raíz

// Establecer dimensiones del canvas (debe coincidir con el CSS)
canvas.width = 800;
canvas.height = 600;

// Variable para la imagen de fondo
const backgroundImage = new Image();
backgroundImage.src = 'background.jpg'; // Asumiendo que tienes una imagen llamada background.png en la raíz

// Array para almacenar los objetivos (fotos de amigos)
const targets = [];

// Array para almacenar las URLs de las imágenes de amigos (rutas locales)
const friendImageUrls = [
    'friend1.bmp', // Asumiendo que friend1.bmp está en la raíz del espacio de trabajo
    'friend2.bmp', // Asumiendo que friend2.bmp está en la raíz del espacio de trabajo
    // Añadir más rutas de imágenes de amigos aquí
];

// Array para almacenar las URLs de las imágenes de marco graciosas (rutas locales de ejemplo)
const frameImageUrls = [
    'frame1.bmp', // Ruta de ejemplo para marco 1 (reemplazar con ruta real)
    'frame2.bmp',   // Ruta de ejemplo para marco 2 (reemplazar con ruta real)
    // Añadir más rutas de imágenes de marco aquí
];

// Array para almacenar los objetos Image precargados de amigos y marcos
const friendImages = [];
const frameImages = [];
let loadedImagesCount = 0;
let totalImagesToLoad = friendImageUrls.length + frameImageUrls.length + 1; // +1 para la imagen de fondo

// Máximo número de objetivos visibles simultáneamente
const MAX_TARGETS = 12;

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
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebotar en los bordes
        if (this.x <= 0 || this.x + this.width >= canvas.width) {
            this.speedX *= -1;
            // Ajustar posición para evitar que se peguen al borde
            if (this.x <= 0) this.x = 0;
            if (this.x + this.width >= canvas.width) this.x = canvas.width - this.width;
        }
        if (this.y <= 0 || this.y + this.height >= canvas.height) {
            this.speedY *= -1;
             // Ajustar posición para evitar que se peguen al borde
            if (this.y <= 0) this.y = 0;
            if (this.y + this.height >= canvas.height) this.y = canvas.height - this.height;
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
    // Solo crear un objetivo si el número actual es menor que el máximo
    if (targets.length >= MAX_TARGETS) {
        return;
    }

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


    // Posición inicial aleatoria dentro del canvas
    const x = Math.random() * (canvas.width - 60); // Ajustar para el nuevo tamaño
    const y = Math.random() * (canvas.height - 60); // Posición inicial dentro del canvas (ajustado)

    // Velocidad inicial aleatoria (puede ser positiva o negativa)
    const minSpeed = 1;
    const maxSpeed = 3;
    let speedX = (Math.random() - 0.5) * 2 * maxSpeed;
    let speedY = (Math.random() - 0.5) * 2 * maxSpeed;

    // Asegurar una velocidad mínima para evitar que se queden quietos
    if (Math.abs(speedX) < minSpeed) speedX = Math.sign(speedX) * minSpeed || minSpeed;
    if (Math.abs(speedY) < minSpeed) speedY = Math.sign(speedY) * minSpeed || minSpeed;


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

        // En esta implementación simple, no hay una asociación directa entre amigo y marco en el marcador.
        // Solo dibujaremos la imagen del amigo y la puntuación.

        // Dibujar la imagen del amigo en el marcador
        if (friendImage.complete && friendImage.naturalWidth > 0) {
             ctx.drawImage(friendImage, startX + (frameSize - imageSize) / 2, startY + (frameSize - imageSize) / 2, imageSize, imageSize); // Centrar imagen dentro del espacio del marco
             console.log(`Imagen de amigo dibujada en marcador para ${imageUrl}`); // Depuración
        } else {
             console.log(`Imagen de amigo NO dibujada en marcador para ${imageUrl} (complete: ${friendImage.complete}, naturalWidth: ${friendImage.naturalWidth})`); // Depuración
        }

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
    // Dibujar la imagen de fondo
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        // Si la imagen de fondo no está cargada, limpiar el canvas con un color de fondo
        ctx.fillStyle = '#87CEEB'; // Un color de cielo claro como fondo por defecto
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Actualizar y dibujar objetivos
    for (let i = 0; i < targets.length; i++) {
        targets[i].update();
        targets[i].draw();
    }

    // Eliminar objetivos que salieron de la pantalla (para evitar que el array crezca indefinidamente)
    // Esta lógica ya no es necesaria con el límite de MAX_TARGETS y la creación al golpear/salir
    // for (let i = targets.length - 1; i >= 0; i--) {
    //     if (targets[i].y + targets[i].height < 0 || targets[i].x + targets[i].width < 0 || targets[i].x > canvas.width) {
    //         targets.splice(i, 1);
    //     }
    // }

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
                // Todas las imágenes (incluida la de fondo) cargadas, iniciar el juego
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

    // Manejar la carga de la imagen de fondo
    backgroundImage.onload = () => {
        loadedImagesCount++;
        if (loadedImagesCount === totalImagesToLoad) {
            // Todas las imágenes cargadas, iniciar el juego
            startGame();
        }
    };
    backgroundImage.onerror = () => {
        console.error(`Error al cargar la imagen de fondo: ${backgroundImage.src}`);
        loadedImagesCount++; // Contar incluso si hay error para no bloquear el inicio
        if (loadedImagesCount === totalImagesToLoad) {
             // Intentar iniciar el juego incluso si la imagen de fondo falló
            startGame();
        }
    };
    // La fuente de la imagen de fondo ya está establecida al declarar la variable
}

// Función para iniciar el juego
function startGame() {
    console.log("Todas las imágenes cargadas. Iniciando juego...");

    // Inicializar puntuaciones por amigo
    friendImageUrls.forEach(url => {
        friendScores[url] = 0;
    });

    // Crear objetivos iniciales hasta el máximo permitido
    for (let i = 0; i < MAX_TARGETS && i < friendImages.length; i++) {
         // Crear objetivos iniciales en posiciones aleatorias dentro del canvas
        const x = Math.random() * (canvas.width - 60); // Ajustar para el nuevo tamaño
        const y = Math.random() * (canvas.height - 60); // Posición inicial dentro del canvas (ajustado)

        // Velocidad inicial aleatoria (puede ser positiva o negativa)
        const minSpeed = 1;
        const maxSpeed = 3;
        let speedX = (Math.random() - 0.5) * 2 * maxSpeed;
        let speedY = (Math.random() - 0.5) * 2 * maxSpeed;

        // Asegurar una velocidad mínima para evitar que se queden quietos
        if (Math.abs(speedX) < minSpeed) speedX = Math.sign(speedX) * minSpeed || minSpeed;
        if (Math.abs(speedY) < minSpeed) speedY = Math.sign(speedY) * minSpeed || minSpeed;


        // Asignar un marco aleatorio al objetivo inicial
        const randomFrameImage = frameImages.length > 0 ?
                                 frameImages[Math.floor(Math.random() * frameImages.length)] :
                                 null;

        targets.push(new Target(friendImages[i], friendImageUrls[i], randomFrameImage, x, y, speedX, speedY));
    }


    // Ya no necesitamos setInterval para crear objetivos continuamente
    // Los nuevos objetivos se crearán al golpear uno si el total es menor que MAX_TARGETS

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

            // Crear un nuevo objetivo si el número actual es menor que el máximo
            if (targets.length < MAX_TARGETS) {
                createTarget();
            }

            break; // Salir del bucle después de golpear un objetivo
        }
    }
});

// Iniciar la precarga de imágenes
preloadImages(friendImageUrls, frameImageUrls);

// Iniciar el bucle del juego (se ejecutará y esperará a que startGame establezca los objetivos)
gameLoop();

// Función para iniciar el juego
function startGame() {
    console.log("Todas las imágenes cargadas. Iniciando juego...");

    // Inicializar puntuaciones por amigo
    friendImageUrls.forEach(url => {
        friendScores[url] = 0;
    });

    // Crear objetivos iniciales hasta el máximo permitido
    for (let i = 0; i < MAX_TARGETS && i < friendImages.length; i++) {
         // Crear objetivos iniciales en posiciones aleatorias dentro del canvas
        const x = Math.random() * (canvas.width - 60); // Ajustar para el nuevo tamaño
        const y = Math.random() * (canvas.height - 60); // Posición inicial dentro del canvas (ajustado)

        // Velocidad inicial aleatoria (puede ser positiva o negativa)
        const minSpeed = 1;
        const maxSpeed = 3;
        let speedX = (Math.random() - 0.5) * 2 * maxSpeed;
        let speedY = (Math.random() - 0.5) * 2 * maxSpeed;

        // Asegurar una velocidad mínima para evitar que se queden quietos
        if (Math.abs(speedX) < minSpeed) speedX = Math.sign(speedX) * minSpeed || minSpeed;
        if (Math.abs(speedY) < minSpeed) speedY = Math.sign(speedY) * minSpeed || minSpeed;


        // Asignar un marco aleatorio al objetivo inicial
        const randomFrameImage = frameImages.length > 0 ?
                                 frameImages[Math.floor(Math.random() * frameImages.length)] :
                                 null;

        targets.push(new Target(friendImages[i], friendImageUrls[i], randomFrameImage, x, y, speedX, speedY));
    }


    // Ya no necesitamos setInterval para crear objetivos continuamente
    // Los nuevos objetivos se crearán al golpear uno si el total es menor que MAX_TARGETS

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

            // Crear un nuevo objetivo si el número actual es menor que el máximo
            if (targets.length < MAX_TARGETS) {
                createTarget();
            }

            break; // Salir del bucle después de golpear un objetivo
        }
    }
});

// Iniciar la precarga de imágenes
preloadImages(friendImageUrls, frameImageUrls);

// Iniciar el bucle del juego (se ejecutará y esperará a que startGame establezca los objetivos)
gameLoop();