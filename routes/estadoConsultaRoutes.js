const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); 
const estadoConsultaController = require('../controllers/estadoConsultaController');
const router = express.Router();



router.get('/listar', authMiddleware, estadoConsultaController.listarEstadoConsulta);



module.exports = router;