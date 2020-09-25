const bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken");

exports.Register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Si l'email existe
  const findEmail = await querysql(
    "SELECT COUNT(*) AS cnt FROM user WHERE email = ?",
    email
  );

  if (findEmail[0].cnt > 0)
    return res.status(400).json({ message: "l'email existe déjà" });

  try {
    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await querysql(
      "INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)",
      [firstname, lastname, email, hash],
      (err, result) => {
        if (err) {
          res.status(400).json({ message: err });
        } else {
          res.status(201).json({ success: "Utilisateur ajouté avec succes" });
        }
      }
    );
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
