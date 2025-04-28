//MODULO FARMACIA
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const presentacionMedicamentoController = require("../controllers/presentacionMedicamentoController");
const router = express.Router();

// Rutas para presentación de medicamentos
router.get("/listar", authMiddleware, presentacionMedicamentoController.listarPresentaciones);
router.get("/listar/:id", authMiddleware, presentacionMedicamentoController.obtenerPresentacionPorId);
router.post("/crear", authMiddleware, presentacionMedicamentoController.crearPresentacion);
router.put("/actualizar/:id", authMiddleware, presentacionMedicamentoController.actualizarPresentacion);
router.put("/desactivar/:id", authMiddleware, presentacionMedicamentoController.desactivarPresentacion);

module.exports = router;