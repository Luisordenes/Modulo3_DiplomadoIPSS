import express from "express";
import consolasRouter from "./routes/consolas.routes.js";
import usuariosRouter from "./routes/users.routes.js";
import juegosRouter from "./routes/juegos.routes.js";
import conectarDB from "./config/database.js";

const app = express();
app.use(express.json());

await conectarDB();

app.use("/api/consolas", consolasRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/juegos", juegosRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
});
