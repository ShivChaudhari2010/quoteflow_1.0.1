import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required."
      });
    }

    const user = await User.findOne({ username: username.trim().toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password."
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      role: user.role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out."
  });
};

/*
|--------------------------------------------------------------------------
| Current user (used by frontend to know role without decoding the cookie)
|--------------------------------------------------------------------------
*/

export const me = (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};
