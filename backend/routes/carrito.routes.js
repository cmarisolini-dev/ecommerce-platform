const express = require("express");
const router = express.Router();

const { crearCarrito, agregarProducto,obtenerCarrito,obtenerTotalCarrito, checkout } = require("../controllers/carrito.controller");

router.post("/", crearCarrito);
router.post("/items", agregarProducto);
router.get("/:carrito_id", obtenerCarrito);
router.get("/:carrito_id/total", obtenerTotalCarrito);
router.post("/checkout", checkout);

module.exports = router;