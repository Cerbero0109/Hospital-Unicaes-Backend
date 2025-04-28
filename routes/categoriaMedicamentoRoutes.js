//MODULO FARMACIA
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const categoriaMedicamentoController = require("../controllers/categoriaMedicamentoController");
const router = express.Router();

// Rutas para categoría de medicamentos
router.get("/listar", authMiddleware, categoriaMedicamentoController.listarCategorias);
router.get("/listar/:id", authMiddleware, categoriaMedicamentoController.obtenerCategoriaPorId);
router.post("/crear", authMiddleware, categoriaMedicamentoController.crearCategoria);
router.put("/actualizar/:id", authMiddleware, categoriaMedicamentoController.actualizarCategoria);
router.put("/desactivar/:id", authMiddleware, categoriaMedicamentoController.desactivarCategoria);

module.exports = router;