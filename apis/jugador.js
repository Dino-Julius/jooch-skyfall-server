// rutas/jugadorRoutes.js
const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    router.get('/jugadores', async (req, res) => {
        try {
            const results = await db.query('SELECT * FROM Jugadores');
            res.json(results);
        } catch (err) {
            console.error('Error al obtener los jugadores:', err);
            res.status(500).send('Error al obtener los jugadores');
        }
    });

    router.get('/jugadores/:id', async (req, res) => {
        try {
            const results = await db.query('SELECT * FROM Jugadores WHERE id_jugador = ?', [req.params.id]);
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).send('Jugador no encontrado');
            }
        } catch (err) {
            console.error('Error al obtener el jugador:', err);
            res.status(500).send('Error al obtener el jugador');
        }
    });

    router.get('/getRanking', async (req, res) => {
    const sql = `
        SELECT Partidas.id_jugador_fk, CONCAT(Jugadores.nombre, ' ', Jugadores.apellido) AS nombre, MAX(Partidas.puntos) AS puntos, Partidas.tipo_financiamiento
        FROM Jugadores 
        JOIN Partidas ON Partidas.id_jugador_fk = Jugadores.id_jugador
        GROUP BY Partidas.id_jugador_fk, Partidas.tipo_financiamiento
        ORDER BY puntos DESC
        LIMIT 5
    `;

    try {
        const results = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener el ranking:', err);
        res.status(500).send('Error al obtener el ranking');
    }
});

    return router;
};