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

router.get("/receta-completa/:idReceta", authMiddleware, despachoController.obtenerInformacionCompletaReceta);

// Rutas para el dashboard
router.get("/estadisticas-dashboard", authMiddleware, despachoController.obtenerEstadisticasDashboard);
router.get("/resumen-despachos", authMiddleware, despachoController.obtenerResumenDespachos);
router.get("/metricas-rendimiento", authMiddleware, despachoController.obtenerMetricasRendimiento);

module.exports = router;