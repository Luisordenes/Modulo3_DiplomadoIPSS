import mongoose from "mongoose";

const juegoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título del juego es obligatorio"],
      trim: true,
    },
    genero: {
      type: String,
      required: [true, "El género es obligatorio"],
      trim: true,
    },
    precioEstimado: {
      type: Number,
      min: [0, "El precio no puede ser negativo"],
    },
    consola: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consola",
      required: [true, "La consola es obligatoria"],
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El creador es obligatorio"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Juego = mongoose.model("Juego", juegoSchema);

export default Juego;
