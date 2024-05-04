// Animación nubes fondo
const cloud1 = document.getElementById('cloud1');
const cloud2 = document.getElementById('cloud2');
const cloud3 = document.getElementById('cloud3');
const cloud4 = document.getElementById('cloud4');

let position1 = 50;
let position2 = 50;
let position3 = -50;
let position4 = -50;

let speed = window.innerWidth / 30000;

export function moveClouds() {
    position1 += speed;
    position2 += speed;
    position3 += speed;
    position4 += speed;

    if (position1 > 100) {
        position1 = -100;
    }
    if (position2 > 100) {
        position2 = -100;
    }
    if (position3 > 100) {
        position3 = -100;
    }
    if (position4 > 100) {
        position4 = -100;
    }

    // Calcula la opacidad basándote en la posición de las nubes
    let opacity1 = 1 - Math.max(0, Math.abs(position1) - 50) / 50;
    let opacity2 = 1 - Math.max(0, Math.abs(position2) - 50) / 50;
    let opacity3 = 1 - Math.max(0, Math.abs(position3) - 50) / 50;
    let opacity4 = 1 - Math.max(0, Math.abs(position4) - 50) / 50;

    cloud1.style.transform = `translateX(${position1}%)`;
    cloud1.style.opacity = opacity1;
    cloud2.style.transform = `translateX(${position2}%)`;
    cloud2.style.opacity = opacity2;
    cloud3.style.transform = `translateX(${position3}%)`;
    cloud3.style.opacity = opacity3;
    cloud4.style.transform = `translateX(${position4}%)`;
    cloud4.style.opacity = opacity4;

    requestAnimationFrame(moveClouds);
}

window.addEventListener('resize', function () {
    speed = window.innerWidth / 10000;
});

moveClouds();
