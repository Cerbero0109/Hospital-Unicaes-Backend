//MODULO FARMACIA
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const medicamentoController = require("../controllers/medicamentoController");
const router = express.Router();

// Rutas para medicamentos
router.get("/listar", authMiddleware, medicamentoController.listarMedicamentos);
router.get("/listar/:id", authMiddleware, medicamentoController.obtenerMedicamentoPorId);
router.post("/crear", authMiddleware, medicamentoController.crearMedicamento);
router.put("/actualizar/:id", authMiddleware, medicamentoController.actualizarMedicamento);
router.put("/desactivar/:id", authMiddleware, medicamentoController.desactivarMedicamento);
router.get("/stock-bajo", authMiddleware, medicamentoController.verificarStockBajo);

module.exports = router;