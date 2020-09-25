const router = require("express").Router();
const { Register, UserLogin } = require("../controllers/auth.controller");

// Ajouter un utilisateur
router.post("/register", Register);
router.post("/login", UserLogin);
module.exports = router;
