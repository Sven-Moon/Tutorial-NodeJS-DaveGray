const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username & password are required." });
  // find user
  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401); // unauthorized
  // eval password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // *TODO: create JWT
    res.json({ success: `User ${user} is logged in` });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
