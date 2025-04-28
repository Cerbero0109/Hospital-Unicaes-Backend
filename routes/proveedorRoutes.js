//MODULO FARMACIA
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const proveedorController = require("../controllers/proveedorController");
const router = express.Router();

// Rutas para proveedores
router.get("/listar", authMiddleware, proveedorController.listarProveedores);
router.get("/listar/:id", authMiddleware, proveedorController.obtenerProveedorPorId);
router.post("/crear", authMiddleware, proveedorController.crearProveedor);
router.put("/actualizar/:id", authMiddleware, proveedorController.actualizarProveedor);
router.put("/desactivar/:id", authMiddleware, proveedorController.desactivarProveedor);

module.exports = router;