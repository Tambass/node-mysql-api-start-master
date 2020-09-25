const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.header("token");
    jwt.verify(token, process.env.SECRET_TOKEN, (err, verify) => {
      if (err) {
        return res.status(401).send("Accès refusé");
      }
      next();
    });
  } catch (err) {
    res.status(400).send("Le Token est invalide");
  }
};
