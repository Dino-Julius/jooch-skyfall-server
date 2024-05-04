import { moveClouds } from './clouds.js';

// Obtén una referencia al elemento del DOM donde quieres mostrar los datos
const top5Container = document.getElementById('top5');

// Haz una solicitud GET a tu API
fetch('/getRanking')
    .then(response => response.json())
    .then(data => {
        // Ordena los datos por puntos_maximos en orden descendente
        data.sort((a, b) => b.puntos - a.puntos);

        // Si hay más de 5 jugadores, reduce el array a los primeros 5
        if (data.length > 5) {
            data = data.slice(0, 5);
        }

        // Crea el HTML para cada jugador y añádelo al DOM
        data.forEach((jugador, index) => {
            const jugadorHTML = `
                <div class="list">
                    <div class="content">
                        <h2 class="rank"><small>#</small>${index + 1}</h2>
                        <h3>${jugador.nombre}</h3>
                        <p>${jugador.tipo_financiamiento}</p>
                        <p>${jugador.puntos}</p>
                    </div>
                </div>
            `;

            top5Container.innerHTML += jugadorHTML;
        });
    })
    .catch(error => console.error('Error:', error));

// Animación nubes
moveClouds();