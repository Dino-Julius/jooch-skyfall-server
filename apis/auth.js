const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');

module.exports = (db) => {
    const router = express.Router();
    
    // Ruta para verificar si un correo ya existe
    router.post('/check-email', async (req, res) => {
        const { email } = req.body;

        // Verificamos si el correo ya existe en la base de datos
        const emailQuery = 'SELECT * FROM Jugadores WHERE email = ?';
        const emailResult = await db.query(mysql.format(emailQuery, [email]));

        if (emailResult.length > 0) {
            // Si el correo ya existe, respondemos con un mensaje de error
            return res.status(409).json({ message: 'Este correo ya está registrado.' });
        }

        // Si el correo no existe, respondemos con un mensaje de éxito
        res.status(200).json({ message: 'Correo disponible.' });
    });

    // Ruta para manejar el registro
    router.post('/signup', async (req, res) => {
        let { nombre, apellido, email, password, telefono, tipo_usuario, sexo, pais, estado, fecha_nacimiento } = req.body;
        
        // Si el estado es "Selecciona un estado", lo hacemos nulo
        if (estado === 'Selecciona un estado') {
            estado = null;
        }

        // Hasheamos la contraseña con SHA256
        const hash = crypto.createHash('sha256');
        hash.update(password);
        password = hash.digest('hex');

        // Verificamos si el correo ya existe en la base de datos
        const emailQuery = 'SELECT * FROM Jugadores WHERE email = ?';
        const emailResult = await db.query(mysql.format(emailQuery, [email]));

        if (emailResult.length > 0) {
            // Si el correo ya existe, respondemos con un mensaje de error
            return res.status(409).json({ message: 'Este correo ya está registrado.' });
        }

        // Obtenemos el número de usuarios existentes
        const countQuery = 'SELECT COUNT(*) AS count FROM Jugadores';
        const countResult = await db.query(countQuery);
        const count = countResult[0].count;

        // Generamos el id_jugador
        const generacion = 'X'; // Deberías calcular la generación de alguna manera
        const identificadorNumerico = String(count + 1).padStart(3, '0');
        const inicialNombre = nombre.charAt(0).toUpperCase();
        const inicialApellido = apellido.charAt(0).toUpperCase();
        const id_jugador = `${generacion}${identificadorNumerico}${inicialNombre}${inicialApellido}`;

        // Si el correo no existe, creamos el nuevo usuario
        const insertQuery = 'INSERT INTO Jugadores (id_jugador, nombre, apellido, email, password, telefono, tipo_usuario, sexo, pais, estado, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await db.query(mysql.format(insertQuery, [id_jugador, nombre, apellido, email, password, telefono, tipo_usuario, sexo, pais, estado, fecha_nacimiento]));

        // Guardamos el id_jugador en la sesión
        req.session.id_jugador = id_jugador;

        // Respondemos con un mensaje de éxito
        res.status(200).json({ message: 'Usuario registrado con éxito.' });
    });

    // Ruta para manejar la actualización del usuario
    router.post('/update', async (req, res) => {
        const { nombre, apellido, email, password, telefono, tipo_usuario, sexo, pais, estado, fecha_nacimiento } = req.body;

        // Actualizamos el usuario en la base de datos
        const updateQuery = 'UPDATE Jugadores SET nombre = ?, apellido = ?, password = ?, telefono = ?, tipo_usuario = ?, sexo = ?, pais = ?, estado = ?, fecha_nacimiento = ? WHERE email = ?';
        await db.query(mysql.format(updateQuery, [nombre, apellido, password, telefono, tipo_usuario, sexo, pais, estado, fecha_nacimiento, email]));

        // Obtenemos el id_jugador del usuario actualizado
        const idQuery = 'SELECT id_jugador FROM Jugadores WHERE email = ?';
        const idResult = await db.query(mysql.format(idQuery, [email]));
        const id_jugador = idResult[0].id_jugador;

        // Guardamos el id_jugador en la sesión
        req.session.id_jugador = id_jugador;

        // Respondemos con un mensaje de éxito
        res.status(200).json({ message: 'Usuario actualizado con éxito.' });
    });

    // Ruta para manejar el inicio de sesión
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;

        // Generamos el hash SHA256 de la contraseña
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');

        // Verificamos si el correo existe en la base de datos
        const emailQuery = 'SELECT * FROM Jugadores WHERE email = ?';
        const emailResult = await db.query(mysql.format(emailQuery, [email]));

        if (emailResult.length === 0) {
            // Si el correo no existe, respondemos con un mensaje de error
            return res.status(404).json({ message: 'Correo no encontrado' });
        }

        // Verificamos si la contraseña coincide
        const passwordQuery = 'SELECT * FROM Jugadores WHERE email = ? AND password = ?';
        const loginResult = await db.query(mysql.format(passwordQuery, [email, hashedPassword]));

        if (loginResult.length === 0) {
            // Si la contraseña no coincide, respondemos con un mensaje de error
            return res.status(401).json({ message: 'Contraseña incorrecta', status: 0 });
        }

        // Guardamos el id_jugador en la sesión
        req.session.id_jugador = loginResult[0].id_jugador;

        // Si el correo existe y la contraseña coincide, respondemos con los datos del usuario
        res.json({ mensaje: "Ingreso exitoso", status: 1, id_jugador: loginResult[0].id_jugador });
    });

    return router;
};