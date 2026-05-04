CREATE TABLE seg_usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol VARCHAR(50) DEFAULT 'cliente',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ord_carritos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES seg_usuarios(id),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ord_items_carrito (
    id SERIAL PRIMARY KEY,
    carrito_id INT REFERENCES ord_carritos(id),
    producto_id INT REFERENCES cat_productos(id),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL
);

CREATE TABLE ord_ordenes (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES seg_usuarios(id),
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ord_items_orden (
    id SERIAL PRIMARY KEY,
    orden_id INT REFERENCES ord_ordenes(id),
    producto_id INT REFERENCES cat_productos(id),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL
);

CREATE TABLE inv_movimientos_inventario (
    id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES cat_productos(id),
    tipo VARCHAR(20) NOT NULL, -- 'entrada' | 'salida' | 'ajuste'
    cantidad INT NOT NULL,
    motivo TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);