const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); 
const historialMedicoController = require('../controllers/historialMedicoController');
const router = express.Router();


router.post('/registrar', authMiddleware, historialMedicoController.insertarHistorialMedico);
router.get('/listar', authMiddleware, historialMedicoController.listarHistorialMedico);
router.patch('/cambiar-estado', historialMedicoController.cambiarEstadoHistorialMedico); 
router.put('/actualizar/:id', authMiddleware, historialMedicoController.actualizarHistorialMedico);


module.exports = router;