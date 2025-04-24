const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const especialidadController = require("../controllers/especialidadController");
const router = express.Router();

router.post("/registrar", authMiddleware, especialidadController.insertarEspecialidad);
router.get("/listar", authMiddleware, especialidadController.listarEspecialidad);
router.get("/listar/:id", authMiddleware, especialidadController.ListarEspecialidadById);
router.put("/cambiar-estado/:id", especialidadController.cambiarEstadoEspecialidad);
router.put("/actualizar/:id", authMiddleware, especialidadController.actualizarEspecialidad);

module.exports = router;
