// rutas/jugadorRoutes.js
const express = require("express");
const mysql = require("mysql");
const crypto = require("crypto");

module.exports = (db) => {
  const router = express.Router();

  // Ruta para obtener la lista de jugadores
  router.get("/players", async (req, res) => {
    db.query("SELECT * FROM Jugadores", (err, rows) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "Ocurrió un error al obtener la lista de jugadores" });
      } else {
        res.json(rows);
      }
    });
  });

  // Ruta para buscar un jugador por ID
  router.get("/players/:id", async (req, res) => {
    const id = mysql.escape(req.params.id);
    db.query(
      `SELECT * FROM Jugadores WHERE id_jugador = ${id}`,
      (err, rows) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({ error: "Ocurrió un error al buscar el jugador" });
        } else {
          res.json(rows[0]);
        }
      }
    );
  });

  // Ruta para obtener los datos de las partidas de un jugador
  router.get("/players/:id/partidas", async (req, res) => {
    const id = mysql.escape(req.params.id);
    db.query(
      `SELECT * FROM Partidas WHERE id_jugador_fk = ${id}`,
      (err, rows) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({
              error:
                "Ocurrió un error al obtener los datos de las partidas del jugador",
            });
        } else {
          res.json(rows);
        }
      }
    );
  });

  // Ruta para verificar las credenciales del usuario y comprobar si es un administrador
  router.post("/login", async (req, res) => {
    const { correo, contrasena } = req.body;
    const escapedCorreo = mysql.escape(correo);

    // Genera el hash SHA256 de la contraseña
    const hash = crypto.createHash('sha256');
    hash.update(contrasena);
    const hashedContrasena = hash.digest('hex');

    db.query(
      `SELECT * FROM Jugadores WHERE correo = ${escapedCorreo} AND contrasena = ${hashedContrasena}`,
      (err, rows) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({
              error:
                "Ocurrió un error al verificar las credenciales del usuario",
            });
        } else if (rows.length === 0) {
          res
            .status(401)
            .json({ error: "Correo electrónico o contraseña incorrectos" });
        } else if (rows[0].admin !== 1) {
          res.status(403).json({ error: "El usuario no es un administrador" });
        } else {
          res.json({ message: "Inicio de sesión exitoso" });
        }
      }
    );
  });

  return router;
};