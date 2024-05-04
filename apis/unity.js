// rutas/unityRoutes.js
const express = require('express');
const mysql = require('mysql');

module.exports = (db) => {
    const router = express.Router();

    // Ruta para obtener el id_jugador de la sesión
    router.get('/player', (req, res) => {
        if (req.session.id_jugador) {
            // Si el id_jugador está en la sesión, lo devolvemos
            res.json({ id_jugador: req.session.id_jugador });
        } else {
            // Si el id_jugador no está en la sesión, devolvemos un error
            res.status(401).json({ message: 'No has iniciado sesión' });
        }
    });

    router.post('/updatePlayer', async (req, res) => {
        const { 
            id_jugador, 
            ciclo: { no_ciclo, deuda, dinero, interes }, 
            cosechas: { aguacate, cafe, chile, maiz, tomate, total_cosechas }, 
            trivia: { id_pregunta, resultado }, 
            seleccion: { id_carta, tipo } 
        } = req.body;

        // Obtén el id_cosecha máximo actual
        const selectMaxIdCosecha = 'SELECT MAX(id_cosecha) as maxIdCosecha FROM Cosechas';
        const resultCosecha = await db.query(selectMaxIdCosecha);
        const newIdCosecha = (resultCosecha[0].maxIdCosecha || 0) + 1;

        // Obtén el id_seleccion máximo actual
        const selectMaxIdSeleccion = 'SELECT MAX(id_seleccion) as maxIdSeleccion FROM Selecciones';
        const resultSeleccion = await db.query(selectMaxIdSeleccion);
        const newIdSeleccion = (resultSeleccion[0].maxIdSeleccion || 0) + 1;

        // Obtén el id_trivia máximo actual
        const selectMaxIdTrivia = 'SELECT MAX(id_trivia) as maxIdTrivia FROM Trivias';
        const resultTrivia = await db.query(selectMaxIdTrivia);
        const newIdTrivia = (resultTrivia[0].maxIdTrivia || 0) + 1;

        // Generamos tabla Cosechas
        const cosechas = 'INSERT INTO Cosechas (id_cosecha, aguacate, cafe, chile, maiz, tomate, total_cosechas) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await db.query(mysql.format(cosechas, [newIdCosecha, aguacate, cafe, chile, maiz, tomate, total_cosechas]));
        
        // Generamos tabla seleccion
        const seleccion = 'INSERT INTO Selecciones (id_seleccion, id_carta, tipo) VALUES (?, ?, ?)';
        await db.query(mysql.format(seleccion, [newIdSeleccion, id_carta, tipo]));

        // Obtén el id_partida más grande para el id_jugador dado
        const Select_id_partida = 'SELECT MAX(id_partida) as maxIdPartida FROM Partidas WHERE id_jugador_fk = ?';
        const result = await db.query(mysql.format(Select_id_partida, [id_jugador]));

        let id_partida;
        if (result[0].maxIdPartida) {
            // Si existe un id_partida, incrementa en 1
            id_partida = result[0].maxIdPartida;
        } else {
            // Si no existe un id_partida, usa 1
            id_partida = 1;
        }

        // Generamos tabla trivia (como inicialmente solo iba a ser una trivia solo guarda una respuesta)
        for (let i = 0; i < resultado.length; i++) {
            if (resultado[i] === 0) {
                const insertQuery = 'INSERT INTO Trivias (id_trivia, id_pregunta, resultado) VALUES (?, ?, ?)';
                await db.query(mysql.format(insertQuery, [newIdTrivia, id_pregunta[i], 0]));
                break;
            } else {
                const insertQuery = 'INSERT INTO Trivias (id_trivia, id_pregunta, resultado) VALUES (?, ?, ?)';
                await db.query(mysql.format(insertQuery, [newIdTrivia, 1, 1]));
                break;
            }
        }

        // Generamos tabla Ciclo
        const ciclo = 'INSERT INTO Ciclos (id_jugador_fk_p, id_partida_fk, no_ciclo, deuda, dinero, interes, id_cosecha_fk, id_trivia_fk, id_seleccion_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await db.query(mysql.format(ciclo, [id_jugador, id_partida, no_ciclo, deuda, dinero, interes, no_ciclo, no_ciclo, no_ciclo]));

        // Envía el JSON recibido como respuesta
        res.json({mensaje : "Base de Datos actualizada"});
    });

    router.post('/updatePlayer/Partida', async (req, res) => {
        const {
            id_jugador,
            partida: { id_partida, tipo_financiamiento, puntos, dinero_total, tiempo_total },
            ciclo: { no_ciclo, deuda, dinero, interes },
            cosechas: { aguacate, cafe, chile, maiz, tomate, total_cosechas },
            trivia: { id_pregunta, resultado },
            seleccion: { id_carta, tipo }
        } = req.body;

        // const timeInSeconds = tiempo_total; // Tu tiempo en segundos

        // const hours = Math.floor(timeInSeconds / 3600);
        // const minutes = Math.floor((timeInSeconds % 3600) / 60);
        // const seconds = Math.floor(timeInSeconds % 60);

        // const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const partida = 'UPDATE Partidas SET tipo_financiamiento = ?, puntos = ?, dinero_total = ?, tiempo_total = ? WHERE id_jugador_fk = ? AND id_partida = ?';
        await db.query(mysql.format(partida, [tipo_financiamiento, puntos, dinero_total, tiempo_total, id_jugador, id_partida,]));

        // Envía el JSON recibido como respuesta
        res.json(req.body);
    });

    router.post('/updatePlayer/GeneratePartida', async (req, res) => {
        const {
            id_jugador,
            partida: { id_partida, tipo_financiamiento, puntos, dinero_total, tiempo_total },
            ciclo: { no_ciclo, deuda, dinero, interes },
            cosechas: { aguacate, cafe, chile, maiz, tomate, total_cosechas },
            trivia: { id_pregunta, resultado },
            seleccion: { id_carta, tipo }
        } = req.body;

        const Partida = 'INSERT INTO Partidas (id_jugador_fk, tipo_financiamiento) VALUES (?, ?)';
        const result = await db.query(mysql.format(Partida, [id_jugador, tipo_financiamiento]));

        // Obtén el ID de la partida recién creada
        const id_partida_db = result.insertId;

        // Envía el JSON recibido como respuesta
        res.json({ mensaje: "Partida Creada", id_partida: id_partida_db });
    });


    return router;
};