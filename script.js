const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Establecer dimensiones del canvas (debe coincidir con el CSS)
canvas.width = 800;
canvas.height = 600;

// Array para almacenar los objetivos (fotos de amigos)
const targets = [];

// Array para almacenar las URLs de las imágenes de amigos
const friendImageUrls = [];

// Clase o estructura para un objetivo
class Target {
    constructor(imageSrc, x, y, speedX, speedY) {
        this.image = new Image();
        this.image.src = imageSrc;
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
        // Asegurarse de que la imagen se ha cargado antes de dibujar
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

// Función para crear un nuevo objetivo
function createTarget() {
    // Usar una imagen de amigo si hay alguna cargada, de lo contrario usar placeholder
    const imageUrl = friendImageUrls.length > 0 ?
                     friendImageUrls[Math.floor(Math.random() * friendImageUrls.length)] :
                     'https://via.placeholder.com/50'; // URL de una imagen de placeholder

    // Posición inicial aleatoria en la parte inferior de la pantalla
    const x = Math.random() * (canvas.width - 50);
    const y = canvas.height;
    // Velocidad aleatoria hacia arriba y horizontalmente
    const speedX = (Math.random() - 0.5) * 2; // Entre -1 y 1
    const speedY = -2 - Math.random() * 3; // Entre -2 y -5 (hacia arriba)

    targets.push(new Target(imageUrl, x, y, speedX, speedY));
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

// Iniciar el bucle del juego
gameLoop();

// Crear nuevos objetivos a intervalos regulares (ejemplo: cada 1 segundo)
setInterval(createTarget, 1000);

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

// Manejar la carga de imágenes de amigos
const friendPhotosInput = document.getElementById('friendPhotos');
friendPhotosInput.addEventListener('change', (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                friendImageUrls.push(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }
});