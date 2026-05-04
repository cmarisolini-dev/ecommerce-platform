-- =========================
-- CATEGORÍAS
-- =========================
CREATE TABLE cat_categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- PRODUCTOS
-- =========================
CREATE TABLE cat_productos (
    id SERIAL PRIMARY KEY,
    categoria_id INT REFERENCES cat_categorias(id),
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);