const pool = require("../db");

const crearCarrito = async (req, res) => {
  try {
    const { usuario_id } = req.body;

    const result = await pool.query(
      `INSERT INTO ord_carritos (usuario_id) 
       VALUES ($1) 
       RETURNING *`,
      [usuario_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const agregarProducto = async (req, res) => {
  try {
    const { carrito_id, producto_id, cantidad } = req.body;

    // 1️⃣ Verificar producto
    const producto = await pool.query(
      "SELECT * FROM cat_productos WHERE id = $1",
      [producto_id]
    );

    if (producto.rows.length === 0) {
      return res.status(404).json({ error: "Producto no existe" });
    }

    // 2️⃣ Validar stock
    if (producto.rows[0].stock < cantidad) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    // 3️⃣ Ver si ya está en el carrito
    const item = await pool.query(
      `SELECT * FROM ord_items_carrito 
       WHERE carrito_id = $1 AND producto_id = $2`,
      [carrito_id, producto_id]
    );

    let result;

    if (item.rows.length > 0) {
      // 4️⃣ Si ya existe → sumar cantidad
      result = await pool.query(
        `UPDATE ord_items_carrito 
         SET cantidad = cantidad + $1
         WHERE carrito_id = $2 AND producto_id = $3
         RETURNING *`,
        [cantidad, carrito_id, producto_id]
      );
    } else {
      // 5️⃣ Si no existe → insertar
      result = await pool.query(
        `INSERT INTO ord_items_carrito 
        (carrito_id, producto_id, cantidad, precio_unitario)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [
          carrito_id,
          producto_id,
          cantidad,
          producto.rows[0].precio
        ]
      );
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const obtenerCarrito = async (req, res) => {
  try {
    const { carrito_id } = req.params;

    const result = await pool.query(
      `SELECT 
        c.id AS carrito_id,
        p.nombre,
        i.cantidad,
        i.precio_unitario,
        (i.cantidad * i.precio_unitario) AS subtotal
       FROM ord_items_carrito i
       JOIN cat_productos p ON i.producto_id = p.id
       JOIN ord_carritos c ON i.carrito_id = c.id
       WHERE c.id = $1`,
      [carrito_id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const obtenerTotalCarrito = async (req, res) => {
  try {
    const { carrito_id } = req.params;

    const result = await pool.query(
      `SELECT 
        SUM(i.cantidad * i.precio_unitario) AS total
       FROM ord_items_carrito i
       WHERE i.carrito_id = $1`,
      [carrito_id]
    );

    res.json({
      carrito_id,
      total: result.rows[0].total || 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const checkout = async (req, res) => {
  const client = await pool.connect(); // 🔐 transacción
  try {
    const { carrito_id, usuario_id } = req.body;

    await client.query("BEGIN");

    // 1️⃣ obtener items del carrito
    const items = await client.query(
      `SELECT * FROM ord_items_carrito WHERE carrito_id = $1`,
      [carrito_id]
    );

    if (items.rows.length === 0) {
      throw new Error("El carrito está vacío");
    }

    // 2️⃣ calcular total
    let total = 0;
    items.rows.forEach(item => {
      total += item.cantidad * item.precio_unitario;
    });

    // 3️⃣ crear orden
    const orden = await client.query(
      `INSERT INTO ord_ordenes (usuario_id, total)
       VALUES ($1, $2)
       RETURNING *`,
      [usuario_id, total]
    );

    const orden_id = orden.rows[0].id;

    // 4️⃣ guardar items de la orden
    for (let item of items.rows) {
      await client.query(
        `INSERT INTO ord_items_orden 
        (orden_id, producto_id, cantidad, precio_unitario)
        VALUES ($1, $2, $3, $4)`,
        [orden_id, item.producto_id, item.cantidad, item.precio_unitario]
      );

      // 5️⃣ descontar stock
      await client.query(
        `UPDATE cat_productos
         SET stock = stock - $1
         WHERE id = $2`,
        [item.cantidad, item.producto_id]
      );
    }

    // 6️⃣ limpiar carrito
    await client.query(
      "DELETE FROM ord_items_carrito WHERE carrito_id = $1",
      [carrito_id]
    );

    await client.query("COMMIT");

    res.json({
      message: "Compra realizada",
      orden: orden.rows[0]
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};



module.exports = { crearCarrito,agregarProducto, obtenerCarrito, obtenerTotalCarrito, checkout };