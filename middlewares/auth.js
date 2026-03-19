import jwt from "jsonwebtoken";
import Juego from "../models/Juego.js";

export const autenticarJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Error al verificar el token:", err);
        return res.status(401).json({ mensaje: "Token inválido" });
      }
      req.usuario = decoded;
      next();
    });
  } else {
    res.status(401).json({ mensaje: "Acceso no autorizado" });
  }
};

export const autorizarRol = (rolPermitido) => {
  return (req, res, next) => {
    if (req.usuario?.role === rolPermitido) {
      next();
    } else {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para realizar esta acción" });
    }
  };
};

export const autorizarJuego = async (req, res, next) => {
  try {
    const user = req.usuario;
    const { id } = req.params;

    const juego = await Juego.findById(id);

    if (!juego) {
      return res.status(404).json({ mensaje: "Juego no encontrado" });
    }

    if (user.role === "admin" || juego.creador.toString() === user.id) {
      req.juego = juego;
      return next();
    }

    return res.status(403).json({
      mensaje: "No tienes permiso para modificar este juego",
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error en la autorización",
      error: error.message,
    });
  }
};
