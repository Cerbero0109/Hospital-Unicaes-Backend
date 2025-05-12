//MODULO FARMACIA
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const despachoController = require("../controllers/despachoController");
const router = express.Router();

// Rutas para despacho
router.get("/recetas-pendientes", authMiddleware, despachoController.listarRecetasPendientes);
router.get("/receta/:idReceta", authMiddleware, despachoController.obtenerDetalleReceta);
router.get("/lotes-disponibles/:idMedicamento", authMiddleware, despachoController.obtenerLotesDisponibles);
router.post("/realizar", authMiddleware, despachoController.realizarDespacho);
router.get("/historial", authMiddleware, despachoController.listarHistorialDespachos);
router.get("/detalle/:idDespacho", authMiddleware, despachoController.obtenerDetalleDespacho);
router.post("/cancelar", authMiddleware, despachoController.cancelarDespacho);

module.exports = router;