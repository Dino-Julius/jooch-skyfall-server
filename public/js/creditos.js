// Datos de los integrantes
const integrantes = [
    {
        nombre: 'Ulises Jaramillo',
        imagen: 'assets/ulises.jpg',
        bio: "I'm a JavaScript full-stack engineer, love working with React and Node.js.",
        redes: {
            
        }
    },

    {
        nombre: 'Julio Vivas',
        imagen: 'assets/julio.jpg',
        bio: "I'm a JavaScript full-stack engineer, love working with React and Node.js.",
        redes: {
            
        }
    },

    {
        nombre: 'Melisa Mireles',
        imagen: 'assets/melisa.jpg',
        bio: "I'm a JavaScript full-stack engineer, love working with React and Node.js.",
        redes: {
            
        }
    },

    {
        nombre: 'Alberto Cebreros',
        imagen: 'assets/alberto.jpg',
        bio: "I'm a JavaScript full-stack engineer, love working with React and Node.js.",
        redes: {
            
        }
    },

    {
        nombre: 'Sebastián Espinoza',
        imagen: 'assets/sebastian.jpg',
        bio: "I'm a JavaScript full-stack engineer, love working with React and Node.js.",
        redes: {
            
        }
    },
    // Agrega más integrantes aquí
];

// Función para generar tarjetas
function generarTarjeta(integrante) {
    // Crear elementos
    const container = document.createElement('div');
    const profileWrapper = document.createElement('div');
    const profile = document.createElement('div');
    // ...crear más elementos según sea necesario

    // Asignar clases
    container.className = 'container';
    profileWrapper.className = 'profile-wrapper';
    profile.className = 'profile';
    // ...asignar más clases según sea necesario

    // Continuación de la función generarTarjeta

    // Asignar contenido
    profile.innerHTML = `
        <div class="profile-image">
            <img src="${integrante.imagen}" alt="Profile">
        </div>
        <div class="profile-name">
            <h2>${integrante.nombre}</h2>
            <div class="profile-bio">${integrante.bio}</div>
        </div>
    `;

    // Generar íconos de redes sociales
    const socialIcons = document.createElement('ul');
    socialIcons.className = 'social-icons';
    for (const red in integrante.redes) {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="${integrante.redes[red]}" title="${red}">
                <img src="assets/${red}.svg" alt="${red} icon">
            </a>
        `;
        socialIcons.appendChild(li);
    }

    // Agregar todo al DOM
    profile.appendChild(socialIcons);
    profileWrapper.appendChild(profile);
    container.appendChild(profileWrapper);

    // Seleccionar el elemento <section> y agregar la tarjeta allí
    const section = document.querySelector('.layout');
    section.appendChild(container);
}

// Generar tarjetas para todos los integrantes
integrantes.forEach(generarTarjeta);