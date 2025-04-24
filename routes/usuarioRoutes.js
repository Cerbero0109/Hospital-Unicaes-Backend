const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); 
const usuarioController = require('../controllers/usuarioController');
const router = express.Router();


router.post('/registrar', authMiddleware, usuarioController.insertarUsuario);
router.get('/listar', authMiddleware, usuarioController.listarUsuarios);
router.get('/listar/:id', authMiddleware, usuarioController.listarUsuarioById);
router.put('/cambiar-estado/:id', usuarioController.cambiarEstadoUsuario);
router.put('/actualizar/:id', authMiddleware, usuarioController.actualizarUsuario);


module.exports = router;