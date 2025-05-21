const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Establecer dimensiones del canvas (debe coincidir con el CSS)
canvas.width = 800;
canvas.height = 600;

// Array para almacenar los objetivos (fotos de amigos)
const targets = [];

// Array para almacenar las URLs de las imágenes de amigos (rutas locales)
const friendImageUrls = [
    'friend1.bmp', // Asumiendo que friend1.bmp está en la raíz del espacio de trabajo
    'friend2.bmp', // Asumiendo que friend2.bmp está en la raíz del espacio de trabajo
    // Añadir más rutas de imágenes de amigos aquí
];

// Array para almacenar los objetos Image precargados
const friendImages = [];
let loadedImagesCount = 0;

// Array para almacenar los objetivos (fotos de amigos)

// Clase o estructura para un objetivo
class Target {
    constructor(image, x, y, speedX, speedY) {
        this.image = image; // Usar el objeto Image precargado
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.width = 50; // Tamaño inicial de la foto
        this.height = 50; // Tamaño inicial de la foto
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw() {
        // No necesitamos comprobar image.complete aquí porque usamos objetos Image precargados
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Función para crear un nuevo objetivo
function createTarget() {
    // Usar una imagen de amigo aleatoria de las precargadas
    if (friendImages.length === 0) {
        console.error("No hay imágenes de amigos precargadas.");
        return;
    }
    const randomImage = friendImages[Math.floor(Math.random() * friendImages.length)];

    // Posición inicial aleatoria en la parte inferior de la pantalla
    const x = Math.random() * (canvas.width - 50);
    const y = canvas.height;
    // Velocidad aleatoria hacia arriba y horizontalmente
    const speedX = (Math.random() - 0.5) * 2; // Entre -1 y 1
    const speedY = -2 - Math.random() * 3; // Entre -2 y -5 (hacia arriba)

    targets.push(new Target(randomImage, x, y, speedX, speedY));
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

    // Solicitar el siguiente frame
    requestAnimationFrame(gameLoop);
}

// Función para precargar imágenes
function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.onload = () => {
            loadedImagesCount++;
            if (loadedImagesCount === urls.length) {
                // Todas las imágenes cargadas, iniciar el juego
                startGame();
            }
        };
        img.onerror = () => {
            console.error(`Error al cargar la imagen: ${url}`);
            loadedImagesCount++; // Contar incluso si hay error para no bloquear el inicio
            if (loadedImagesCount === urls.length) {
                 // Intentar iniciar el juego incluso si algunas imágenes fallaron
                startGame();
            }
        };
        img.src = url;
        friendImages.push(img);
    });
}

// Función para iniciar el juego
function startGame() {
    console.log("Todas las imágenes cargadas. Iniciando juego...");
    // Crear objetivos iniciales (uno por cada imagen cargada)
    friendImages.forEach(image => {
         // Crear objetivos iniciales en posiciones aleatorias dentro del canvas
        const x = Math.random() * (canvas.width - 50);
        const y = Math.random() * (canvas.height - 50); // Posición inicial dentro del canvas
        // Velocidad aleatoria (puede ser hacia cualquier dirección inicialmente)
        const speedX = (Math.random() - 0.5) * 2;
        const speedY = (Math.random() - 0.5) * 2;
        targets.push(new Target(image, x, y, speedX, speedY));
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

    // Comprobar si el clic intersecta con algún objetivo
    for (let i = targets.length - 1; i >= 0; i--) {
        const target = targets[i];
        if (clickX > target.x && clickX < target.x + target.width &&
            clickY > target.y && clickY < target.y + target.height) {
            // Se hizo clic en un objetivo, eliminarlo
            targets.splice(i, 1);
            // Aquí se añadiría la lógica de puntuación y efectos visuales/sonoros
            console.log('¡Objetivo golpeado!'); // Mensaje de prueba
            break; // Salir del bucle después de golpear un objetivo
        }
    }
});

// Iniciar la precarga de imágenes
preloadImages(friendImageUrls);

// Iniciar el bucle del juego (se ejecutará y esperará a que startGame establezca los objetivos)
gameLoop();