const User = require("../model/User");

const handleLogout = async (req, res) => {
  // on client also delete accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // no content
  const refreshToken = cookies.jwt;
  // find user (w/ refresh token) in DB
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204); // no content
  }
  // Delete Refresh Token in DB
  foundUser.refreshToken = "";
  const result = await foundUser.save();

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    // maxAge not needed
  });
  res.sendStatus(204);
};

module.exports = { handleLogout };
