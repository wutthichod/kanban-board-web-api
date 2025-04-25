import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

export async function register(req, res, next) {
  const { name, email, password } = req.body;

  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailFormat.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  const salt = await bcryptjs.genSalt();
  const hashedPassword = await bcryptjs.hash(password, salt);

  try {
    const exist = await prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      return res.status(401).json({
        success: false,
        message: "Email not available",
      });
    }

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Token created:", token);

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 3600000,
      })
      .json({
        success: true,
        userId: user.id,
      });
      
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration error",
    });
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Token created:", token);

    return res.status(200).cookie("token", token).json({
      success: true,
      token,
      userId: user.id,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login error",
    });
  }
}

export async function logout(req, res, next) {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout error",
    });
  }
}
