const User = require("../models/User");
const jwt = require("jsonwebtoken");

const tokenForUser = user => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.signin = (req, res, next) => {
  // passport미들웨어를 통과하였으므로, req.user
  res.send({ success: true, token: tokenForUser(req.user) });
};

exports.signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res
        .status(422)
        .json({ success: false, msg: "이메일, 패스워드를 확인해주세요" });
    }

    // See if a user with the given email exists
    const existingUser = await User.findOne({ email: email });

    // If a user with email does exist, return an error
    if (existingUser) {
      res
        .status(422)
        .json({ success: false, msg: "해당 이메일은 사용중입니다" });
    }

    // If a user with email does NOT exist, create and save user record
    const newUser = new User({
      email,
      password
    });

    const user = await newUser.save();

    // Repond to request indicating the user was created
    res.status(201).json({ success: true, token: tokenForUser(user) });
  } catch (err) {
    console.error(err);
  }
};
