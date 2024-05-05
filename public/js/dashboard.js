document.addEventListener('DOMContentLoaded', (event) => {
    // Funcionalidad de inicio de sesión
    const loginForm = document.getElementById('loginForm');
    const dashboard = document.getElementById('dashboard');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;

            fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                } else {
                    loginForm.style.display = 'none';
                    dashboard.style.display = 'block';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }

    // Obtener la lista de jugadores de la API
    fetch('/dashboard/players')
        .then(response => response.json())
        .then(players => {
            // Insertar solo los primeros 5 jugadores en la lista
            var playerList = document.getElementById('playerList');
            if (playerList) {
                players.slice(0, 5).forEach(function(player) {
                    var listItem = document.createElement('li');
                    listItem.textContent = player.nombre + ' (ID: ' + player.id_jugador + ')';
                    playerList.appendChild(listItem);
                });
            }
        })
        .catch(error => console.error('Error:', error));

    // Funcionalidad de búsqueda por ID
    const searchId = document.getElementById('searchId');
    if (searchId) {
        searchId.addEventListener('input', function(e) {
            var id = e.target.value;
            // Obtener los datos del jugador de la API
            fetch('/dashboard/players/' + id)
                .then(response => response.json())
                .then(result => {
                    var searchResult = document.getElementById('searchResult');
                    if (searchResult) {
                        searchResult.innerHTML = `
                            <p>Nombre y apellido: ${result.nombre} ${result.apellido}</p>
                            <p>Correo: ${result.email}</p>
                            <p>Tipo de usuario: ${result.tipo_usuario}</p>
                            <p>Puntos: ${result.puntos}</p>
                        `;
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }
});