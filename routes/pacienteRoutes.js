const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); 
const pacienteController = require('../controllers/pacienteController');
const router = express.Router();


router.post('/registrar', authMiddleware, pacienteController.insertarPaciente);
router.get('/listar', authMiddleware, pacienteController.listarPacientesActivos);
router.get('/listar/:id', authMiddleware, pacienteController.listarPacienteById);
router.put('/cambiar-estado/:id', pacienteController.cambiarEstadoPaciente);
router.put('/actualizar/:id', authMiddleware, pacienteController.actualizarPaciente);


module.exports = router;