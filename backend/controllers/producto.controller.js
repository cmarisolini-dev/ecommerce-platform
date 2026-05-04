const pool = require("../db");

const getProductos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cat_productos");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};


const createProducto = async (req, res) => {
  try {
    const { categoria_id, sku, nombre, descripcion, precio, stock } = req.body;

    const result = await pool.query(
      `INSERT INTO cat_productos 
      (categoria_id, sku, nombre, descripcion, precio, stock) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [categoria_id, sku, nombre, descripcion, precio, stock]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
        console.error("ERROR REAL:", error);
        res.status(500).json({ error: error.message });
    }
};

const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, stock } = req.body;

    const result = await pool.query(
      `UPDATE cat_productos 
       SET nombre = $1, precio = $2, stock = $3
       WHERE id = $4
       RETURNING *`,
      [nombre, precio, stock, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM cat_productos WHERE id = $1",
      [id]
    );

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



module.exports = { getProductos,createProducto, updateProducto, deleteProducto };