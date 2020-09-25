const router = require('express').Router()
const {Register} = require('../controllers/auth.controller')

// Ajouter un utilisateur
router.post('/register', Register)

module.exports = router;