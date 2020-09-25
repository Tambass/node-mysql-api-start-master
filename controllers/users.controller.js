exports.users = async (req, res) => {
  const users = await querysql(
    "SELECT id, firstname, lastname, email FROM user"
  );
  try {
    res.status(201).json(users);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
