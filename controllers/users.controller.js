const bcrypt = require("bcrypt");

exports.Users = async (req, res) => {
  const users = await querysql(
    "SELECT id, firstname, lastname, email FROM user"
  );
  try {
    res.status(201).json(users);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.User = async (req, res) => {
  const userId = req.params.id;
  const user = await querysql(
    "SELECT id, firstname, lastname, email FROM user WHERE id = ?",
    userId
  );
  if (user.length > 0) {
    try {
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  } else {
    res.status(201).json({ message: "Utilisateur introuvable" });
  }
};

exports.UpdateUser = async (req, res) => {
  const id = req.params.id,
    findId = await querysql("SELECT COUNT(*) AS cnt FROM user WHERE id = ?", [
      id,
    ]);
  if (!findId[0].cnt > 0)
    return res.status(400).send("L'utilisateur n'existe pas");
  const { firstname, lastname, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // Hasher le mot de passe
    await querysql(
      "UPDATE user SET firstname = ?, lastname = ?, email = ?, password = ? WHERE id = ?",
      [firstname, lastname, email, hash, id],
      (err, result) => {
        if (err) {
          res.status(400).json({ message: err });
        }
        res.status(201).json({ message: "Mise à jour avec succès" });
      }
    );
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
