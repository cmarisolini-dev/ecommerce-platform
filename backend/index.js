const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

//rutas
const productoRoutes = require("./routes/producto.routes");
const carritoRoutes = require("./routes/carrito.routes");

app.use("/productos", productoRoutes);
app.use("/carrito", carritoRoutes);


// ruta de prueba
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de conexión a la BD" });
  }
});



// puerto
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


