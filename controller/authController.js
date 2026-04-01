import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ success: true, message: "User created successfully" });

  } catch (error) {
    res.json({ success: false, message: "Error creating user" });
  }
};


export const login = async (req, res) => {
  const {email, password} = req.body;
  const user = User.findOne({email});
  if(!user){
    res.json({
      success: false,
      message: "No user Found"
    });
  }

  const checkPassword = bcrypt.compare(password, user.password);
  const token = jwt.sign(
    {userId: user._id},
    process.env.JWT_SECRET,
    {expiresIn: "1h"}
  );
  res.json({
    success: true,
    message: "Login Successfully",
    token
  }) 
}