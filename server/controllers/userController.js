const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports.home = (req, res, next) => {
  res.send("Server HOME");
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    const emailCheck = await User.findOne({ email });
    if (usernameCheck)
      return res.json({ message: 'Username already exists', status: false });
    if (emailCheck)
      return res.json({ message: 'Email already exists', status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });
    console.log(`---> User Registered - ${username}`);
    delete user.password;
    return res.json({ status: true, user });
  }
  catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ message: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ message: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.allUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    const username = req.params.id;
    console.log(`---> User Logout - ${username}`);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
