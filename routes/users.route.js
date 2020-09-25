const router = require("express").Router();

const { Users, User, UpdateUser } = require("../controllers/users.controller");

router.get("/allusers", Users);
router.get("/:id", User);
router.put("/:id", UpdateUser);

module.exports = router;
