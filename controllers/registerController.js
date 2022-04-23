const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username & password are required." });
  // check for duplicate usernames in db
  const duplicate = usersDB.users.find((person) => person.username === user);
  if (duplicate) return res.sendStatus(409); // 409 = conflict
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(
      pwd,
      10 // salt rounds (prevents a compromised database from allowing
    ); // intruders getting all passwords from a single hash break)
    // store the new user
    const newUser = { username: user, password: hashedPwd };
    usersDB.setUsers([...usersDB.users, newUser]);
    // probably wouldn't write to file like this with real db
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.users);
    res.status(201).json({ success: `New user ${user} created!` });
  } catch {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
