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

exports.UserLogin = async (req, res) => {
  const { email, password } = req.body;

  // Si l'email n'existe pas
  const findEmail = await querysql(
    "SELECT COUNT(*) AS cnt FROM user WHERE email = ?",
    email
  );
  if (!findEmail[0].cnt > 0)
    return res
      .status(400)
      .json({ message: "Il n'y a pas d'utilisateur avec cet email" });

  // Vérifier le mot de passe
  const user = await querysql(
    "SELECT id, email, password FROM user WHERE email = ?",
    email
  );
  const passwordCheck = await bcrypt.compare(password, user[0].password);
  if (!passwordCheck)
    return res.status(400).json({ message: "Mot de passe incorrect" });

  try {
    // Créer le token
    const token = jwt.sign(
      { _id: user[0].id },
      process.env.SECRET_TOKEN,
      (err, token) => res.header("authorization", token).json({ token })
    );
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
