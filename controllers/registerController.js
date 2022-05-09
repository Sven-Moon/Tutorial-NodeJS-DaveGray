const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username & password are required." });
  // check for duplicate usernames in db
  const duplicate = await User.findOne({ username: user }).exec(); // exec goes after findOne with await
  if (duplicate) return res.sendStatus(409); // 409 = conflict
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // create & store the new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });
    // other way
    // const newUser = new User()
    // newUser.username = user
    // const result = await newUser.save()
    // end other ways

    res.status(201).json({ success: `New user ${user} created!` });
  } catch {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
