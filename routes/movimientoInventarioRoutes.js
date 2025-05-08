const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const movimientoInventarioController = require("../controllers/movimientoInventarioController");
const router = express.Router();

// Rutas para movimientos de inventario
router.get("/medicamento/:idMedicamento", authMiddleware, movimientoInventarioController.obtenerMovimientosPorMedicamento);
router.get("/lote/:idStock", authMiddleware, movimientoInventarioController.obtenerMovimientosPorLote);

module.exports = router;