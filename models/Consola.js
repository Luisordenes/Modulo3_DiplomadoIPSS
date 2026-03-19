import mongoose from "mongoose";

const consolaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la consola es obligatorio"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    fabricante: {
      type: String,
      required: [true, "El fabricante es obligatorio"],
      trim: true,
      enum: {
        values: [
          "Nintendo",
          "Sony",
          "Sega",
          "Microsoft",
          "Atari",
          "NEC",
          "Otro",
        ],
        message: "Fabricante no válido",
      },
    },
    año: {
      type: Number,
      required: [true, "El año de lanzamiento es obligatorio"],
      min: [1970, "El año debe ser mayor a 1970"],
      max: [new Date().getFullYear() + 1, "El año no puede ser futuro"],
    },
    generacion: {
      type: Number,
      min: [1, "La generación debe ser al menos 1"],
      max: [10, "La generación no puede ser mayor a 10"],
    },
    descripcion: {
      type: String,
      maxlength: [500, "La descripción no puede exceder 500 caracteres"],
    },
    precioEstimado: {
      type: Number,
      min: [0, "El precio no puede ser negativo"],
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

const Consola = mongoose.model("Consola", consolaSchema);

export default Consola;
