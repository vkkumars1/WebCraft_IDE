const { User }  = require("../models/userModals.js")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
module.exports.Signup = async (req, res) => {
    const { username, email, password, name } = req.body;

    try {
      // Check if user already exists
      const user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });
  
     
  
      // Hash the password before saving to the database
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with hashed password
      const newUser = new User({ username, name,email, password: hashedPassword });
  
      // Save the user to the database
      await newUser.save();
  
      // Send success response with new user info
      res.status(201).json({
        message: "User registered successfully",
        newUser: {
          id: newUser._id,
          name:name,
          username: newUser.username,
          email: newUser.email
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};



module.exports.Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Send success response with token and user info
    return res.status(200).json({
      message: "User LoggedIn successfully",
      user: {
        id: user._id,
        name:user.name,
        username: user.username,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({ error: error.message });
  }
};


