import express from "express";
import Juego from "../models/Juego.js";
import { autenticarJWT, autorizarJuego } from "../middlewares/auth.js";
// import { catchAsync } from '../utils/catchAsync.js';
// import { AppError } from '../utils/AppError.js';

const router = express.Router();

router.post("/", autenticarJWT, async (req, res) => {
  const nuevoJuego = req.body;
  console.log("Nuevo juego recibido:", nuevoJuego);
  try {
    console.log("Usuario autenticado:", req.usuario);

    const creadorId = req.usuario.id;
    nuevoJuego.creador = creadorId;

    const nuevoJuegoDoc = new Juego(nuevoJuego);
    const juegoGuardado = await nuevoJuegoDoc.save();
    res.status(201).json(juegoGuardado);
  } catch (error) {
    console.error("Error al guardar el juego:", error);
    return res
      .status(500)
      .json({ mensaje: "Error al guardar el juego", error: error.message });
  }
});

router.patch("/:id", autenticarJWT, autorizarJuego, async (req, res) => {
  const datosActualizados = req.body;

  try {
    const juego = req.juego;

    Object.assign(juego, datosActualizados);
    await juego.save();

    res.json(juego);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar el juego",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const juegos = await Juego.find({ isDeleted: false })
      .populate("consola", "nombre")
      .populate("creador", "username");
    res.json(juegos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener juegos", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const juego = await Juego.find({ _id: id, isDeleted: false })
      .populate("consola", "nombre")
      .populate("creador", "username");
    if (juego) {
      res.json(juego);
    } else {
      res.status(404).json({ mensaje: "Juego no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el juego", error: error.message });
  }
});

router.delete("/:id", autenticarJWT, autorizarJuego, async (req, res) => {
  try {
    const juego = req.juego;

    juego.isDeleted = true;
    await juego.save();

    res.json({ mensaje: "Juego eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar el juego", error: error.message });
  }
});

export default router;
