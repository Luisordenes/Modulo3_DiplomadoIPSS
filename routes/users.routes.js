import express from "express";
import Usuario from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { autenticarJWT, autorizarRol } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const nuevoUsuarioData = req.body;
  try {
    const nuevoUsuario = new Usuario(nuevoUsuarioData);

    const salt = await bcrypt.genSalt(10);
    nuevoUsuario.password = await bcrypt.hash(nuevoUsuario.password, salt);

    console.log({ salt, hashedPassword: nuevoUsuario.password });

    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al crear usuario", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email, isDeleted: false });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      {
        id: usuario._id,
        username: usuario.username,
        email: usuario.email,
        role: usuario.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al iniciar sesión", error: error.message });
  }
});

router.get("/", autenticarJWT, async (req, res) => {
  try {
    const usuarios = await Usuario.find({ isDeleted: false });
    res.json(usuarios);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener usuarios", error: error.message });
  }
});

router.get("/:id", autenticarJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findOne({ _id: id, isDeleted: false });
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el usuario", error: error.message });
  }
});

router.delete(
  "/:id",
  autenticarJWT,
  autorizarRol("admin"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const usuarioEliminado = await Usuario.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { returnDocument: "after" },
      );
      if (usuarioEliminado) {
        res.json({ mensaje: "Usuario eliminado correctamente" });
      } else {
        res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
    } catch (error) {
      res
        .status(500)
        .json({
          mensaje: "Error al eliminar el usuario",
          error: error.message,
        });
    }
  },
);

export default router;
