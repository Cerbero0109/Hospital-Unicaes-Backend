//MODULO FARMACIA
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const stockController = require("../controllers/stockController");
const router = express.Router();

// Rutas para stock
router.get("/listar", authMiddleware, stockController.listarStock);
router.get("/listar/:id", authMiddleware, stockController.obtenerStockPorId);
router.get("/medicamento/:idMedicamento", authMiddleware, stockController.obtenerStockPorMedicamento);
router.post("/crear", authMiddleware, stockController.crearStock);
router.put("/actualizar/:id", authMiddleware, stockController.actualizarStock);
router.put("/cambiar-estado/:id", authMiddleware, stockController.cambiarEstadoStock);
router.get("/proximos-vencer", authMiddleware, stockController.verificarStockProximoVencer);
router.get("/lotes-agotados", authMiddleware, stockController.listarLotesAgotados);
router.get("/ingresos", authMiddleware, stockController.listarIngresosMedicamentos);

module.exports = router;