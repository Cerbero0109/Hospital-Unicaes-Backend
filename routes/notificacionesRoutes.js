//MODULO FARMACIA
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { obtenerNotificaciones } = require("../middlewares/notificacionesMiddleware");
const router = express.Router();

// Ruta para obtener notificaciones
router.get("/", authMiddleware, obtenerNotificaciones);

module.exports = router;