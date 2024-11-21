import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

// Registro de usuario
export const register = async (req, res) => {
  try {
    const { username, email, password, direccion, tipo = "normal", telefono } = req.body;

    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({
        message: ["El correo ya está en uso"],
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      direccion,
      tipo,
      fechaRegistro: new Date(),
      estado: "activo",
      telefono, // Aquí se guarda el teléfono sin tilde
    });

    const userSaved = await newUser.save();

    const token = await createAccessToken({
      id: userSaved._id,
      username: userSaved.username,
      tipo: userSaved.tipo,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(201).json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      direccion: userSaved.direccion,
      tipo: userSaved.tipo,
      estado: userSaved.estado,
      telefono: userSaved.telefono, // Aquí también se usa el teléfono sin tilde
      fechaRegistro: userSaved.fechaRegistro,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.status(400).json({
        message: ["El correo no existe"],
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: ["La contraseña es incorrecta"],
      });
    }

    const token = await createAccessToken({
      id: userFound._id,
      username: userFound.username,
      tipo: userFound.tipo,
    });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      tipo: userFound.tipo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Token
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      tipo: userFound.tipo,
      estado: userFound.estado,
    });
  });
};


// Logout User
export const logout = (req, res) => {
  // Borra el token de autenticación del usuario
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });

  // Borra el token de autenticación de la tienda
  res.cookie("tiendaToken", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });

  return res.sendStatus(200);
};
