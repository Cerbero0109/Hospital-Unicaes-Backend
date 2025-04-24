const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); 
const rolController = require('../controllers/rolController');
const router = express.Router();


router.post('/registrar', authMiddleware, rolController.insertarRol);
router.get('/listar', authMiddleware, rolController.listarRoles);
router.patch('/cambiar-estado', rolController.cambiarEstadoRol); 
router.put('/actualizar/:id', authMiddleware, rolController.actualizarRol);


module.exports = router;