import mongoose from "mongoose";

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.log("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

export default conectarDB;
