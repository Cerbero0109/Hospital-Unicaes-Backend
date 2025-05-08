const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const inventarioMovimientosController = require("../controllers/inventarioMovimientosController");
const router = express.Router();

// Rutas para los movimientos de inventario
router.get("/medicamento/:idMedicamento", authMiddleware, inventarioMovimientosController.obtenerMovimientosPorMedicamento);
router.get("/lote/:idStock", authMiddleware, inventarioMovimientosController.obtenerMovimientosPorLote);

module.exports = router;