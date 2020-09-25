const router = require("express").Router();

const { users } = require("../controllers/users.controller");

router.get("/allusers", users);

module.exports = router;
