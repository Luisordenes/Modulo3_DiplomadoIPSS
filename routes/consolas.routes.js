import express from "express";
import Consola from "../models/Consola.js";
import { autenticarJWT, autorizarRol } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", autenticarJWT, autorizarRol("admin"), async (req, res) => {
  const nuevaConsolaData = req.body;
  try {
    const nuevaConsola = new Consola(nuevaConsolaData);
    const consolaGuardada = await nuevaConsola.save();
    res.status(201).json(consolaGuardada);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al crear la consola", error: error.message });
  }
});

router.patch("/:id", autenticarJWT, autorizarRol("admin"), async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;
  try {
    const consolaActualizada = await Consola.findByIdAndUpdate(
      id,
      datosActualizados,
      { returnDocument: "after" },
    );
    if (consolaActualizada) {
      res.json(consolaActualizada);
    } else {
      res.status(404).json({ mensaje: "Consola no encontrada" });
    }
  } catch (error) {
    res
      .status(400)
      .json({
        mensaje: "Error al actualizar la consola",
        error: error.message,
      });
  }
});

router.get("/", async (req, res) => {
  try {
    const consolas = await Consola.find({ isDeleted: false });
    res.json(consolas);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener consolas", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const consola = await Consola.find({ _id: id, isDeleted: false });
    if (consola) {
      res.json(consola);
    } else {
      res.status(404).json({ mensaje: "Consola no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener la consola", error: error.message });
  }
});

router.delete("/:id", autenticarJWT, autorizarRol("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const consolaEliminada = await Consola.findById(id);
    if (consolaEliminada) {
      consolaEliminada.isDeleted = true;
      await consolaEliminada.save();
      res.json({ mensaje: "Consola eliminada correctamente" });
    } else {
      res.status(404).json({ mensaje: "Consola no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar la consola", error: error.message });
  }
});

export default router;
