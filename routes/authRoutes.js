const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); 
const { login, logout, getUser } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/user', authMiddleware, getUser); 


module.exports = router;