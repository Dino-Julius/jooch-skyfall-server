// Seleccionamos los formularios
const signupForm = document.querySelector('.signup form');
const loginForm = document.querySelector('.login form');

// Función para manejar el registro
signupForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitamos que el formulario se envíe de la manera predeterminada

    const nombre = this.elements['nombre'].value;
    const apellido = this.elements['apellido'].value;
    const email = this.elements['email'].value;
    const password = this.elements['pswd'].value;

    // Hacemos una petición a tu servidor para verificar si el correo ya existe
    const response = await fetch('/auth/check-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    if (response.ok) {
        // Si el correo no existe, guardamos los datos en localStorage y redirigimos a la otra página
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('apellido', apellido);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        window.location.href = 'forms.html';
    } else {
        // Si el correo ya existe, pedimos al usuario que inicie sesión
        const errorData = await response.json();
        alert('Este correo ya está registrado. Por favor, inicia sesión.');
    }

    return false;
});

// Función para manejar el inicio de sesión
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitamos que el formulario se envíe de la manera predeterminada

    const email = this.elements['email'].value;
    const password = this.elements['pswd'].value;

    // Hacemos una petición a tu servidor para autenticar al usuario
    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        // Si las credenciales son correctas, redirigimos a la otra página
        window.location.href = '/game/index.html';
    } else {
        // Si las credenciales son incorrectas, mostramos un mensaje de error
        const errorData = await response.json();
        alert('Las credenciales son incorrectas: ' + errorData.message);
    }
});