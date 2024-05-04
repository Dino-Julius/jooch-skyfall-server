import { moveClouds } from './clouds.js';

// Lista de países del continente americano
const paisesLatinoamerica = [
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

// Animación nubes
moveClouds();