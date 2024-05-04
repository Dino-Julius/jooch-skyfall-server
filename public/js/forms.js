// Lista de países del continente americano
const paisesLatinoamerica = [
    { nombre: 'Selecciona un país', codigo: '' },
    { nombre: 'Argentina', codigo: 'AR' },
    { nombre: 'Bolivia', codigo: 'BO' },
    { nombre: 'Brasil', codigo: 'BR' },
    { nombre: 'Chile', codigo: 'CL' },
    { nombre: 'Colombia', codigo: 'CO' },
    { nombre: 'Costa Rica', codigo: 'CR' },
    { nombre: 'Cuba', codigo: 'CU' },
    { nombre: 'Ecuador', codigo: 'EC' },
    { nombre: 'El Salvador', codigo: 'SV' },
    { nombre: 'Guatemala', codigo: 'GT' },
    { nombre: 'Honduras', codigo: 'HN' },
    { nombre: 'México', codigo: 'MX' },
    { nombre: 'Nicaragua', codigo: 'NI' },
    { nombre: 'Panamá', codigo: 'PA' },
    { nombre: 'Paraguay', codigo: 'PY' },
    { nombre: 'Perú', codigo: 'PE' },
    { nombre: 'Puerto Rico', codigo: 'PR' },
    { nombre: 'República Dominicana', codigo: 'DO' },
    { nombre: 'Uruguay', codigo: 'UY' },
    { nombre: 'Venezuela', codigo: 'VE' }
];
const estadosMexico = [
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Coahuila',
    'Colima',
    'Chiapas',
    'Chihuahua',
    'Ciudad de México',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'México',
    'Michoacán',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas'
];

// Encuentra los selectores en tu HTML
const paisSelect = document.querySelector('select[name="pais"]');
const estadoSelect = document.querySelector('select[name="estado"]');

// Llena el selector de países con una opción para cada país
paisesLatinoamerica.forEach((pais) => {
    // Crea una nueva opción
    const option = document.createElement('option');
    option.value = pais.codigo;
    option.text = pais.nombre;

    // Añade la opción al selector
    paisSelect.appendChild(option);
});

// Llena el selector de estados con una opción para cada estado
estadosMexico.forEach((estado) => {
    // Crea una nueva opción
    const option = document.createElement('option');
    option.value = estado;
    option.text = estado;

    // Añade la opción al selector
    estadoSelect.appendChild(option);
});

// Cuando el país cambie, verifica si se seleccionó México
paisSelect.addEventListener('change', function() {
    if (this.value === 'MX') {
        // Si se seleccionó México, habilita el selector de estados
        estadoSelect.disabled = false;
    } else {
        // Si se seleccionó otro país, deshabilita el selector de estados y selecciona la opción inicial
        estadoSelect.disabled = true;
        estadoSelect.value = 'Selecciona un estado';
    }
});

// Seleccionamos el formulario
const form = document.querySelector('form');

// Función para manejar el envío del formulario
form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitamos que el formulario se envíe de la manera predeterminada

    // Recuperamos los datos del formulario de registro de localStorage
    const nombre = localStorage.getItem('nombre');
    const apellido = localStorage.getItem('apellido');
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    // Obtenemos los datos del formulario actual
    const telefono = this.elements['Teléfono'].value;
    const tipoUsuario = this.elements['tipUsuario'].value;
    const sexo = this.elements['gender'].value;
    const pais = this.elements['pais'].value;
    const estado = this.elements['estado'].value;
    const fechaNacimiento = this.elements['cumple'].value;

    // Hacemos una petición a tu servidor para crear el nuevo usuario
    const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, apellido, email, password, telefono, tipoUsuario, sexo, pais, estado, fechaNacimiento })
    });

    if (response.ok) {
        // Si el registro es exitoso, redirigimos a la otra página
        window.location.href = '/game/index.html';
    } else {
        // Si hay un error, mostramos un mensaje de error
        const errorData = await response.json();
        alert('Error al registrarse: ' + errorData.message);
    }

    return false;
});

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

function moveClouds() {
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