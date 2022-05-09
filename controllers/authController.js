const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username & password are required." });
  // find user
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); // unauthorized
  // eval password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // get codes (not decrypted values) to send
    const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWT
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" } // production would be 5 - 5 min
    );
    // refreshToken doesn't need roles, just there for new accessToken
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // save refresh token to DB -- allows for token inval. on logout
    // will also be used to cross-reference to create a new accessToken
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    // send tokens to user
    // refresh token sent via httpOnly cookie
    res.cookie("jwt", refreshToken, {
      // maxAge & exp don't need to be identical when cookie deleted
      httpOnly: true, // httpOnly cookies are NOT available to JS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "None",
      // secure: true,
    });
    // accessToken may be sent as simple json
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
