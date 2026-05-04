INSERT INTO cat_categorias (nombre, descripcion)
VALUES
('Tecnología', 'Productos electrónicos y gadgets'),
('Ropa', 'Prendas de vestir'),
('Hogar', 'Artículos para el hogar');

INSERT INTO cat_productos (categoria_id, sku, nombre, descripcion, precio, stock)
VALUES
(1, 'TEC-001', 'Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido', 120.00, 10),
(1, 'TEC-002', 'Mouse Gamer', 'Mouse con RGB y alta precisión', 45.00, 25),
(2, 'ROP-001', 'Camiseta Oversize', 'Camiseta algodón 100%', 30.00, 50),
(3, 'HOG-001', 'Lámpara LED', 'Lámpara moderna de escritorio', 25.00, 15);


INSERT INTO seg_usuarios (nombre, email, password, rol)
VALUES
('Admin Principal', 'admin@shop.com', 'admin123', 'admin'),
('Cliente Demo', 'cliente@shop.com', 'cliente123', 'cliente');

INSERT INTO ord_carritos (usuario_id)
VALUES (2);