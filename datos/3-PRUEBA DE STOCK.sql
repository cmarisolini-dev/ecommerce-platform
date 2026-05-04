CREATE OR REPLACE FUNCTION disminuir_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE cat_productos
    SET stock = stock - NEW.cantidad
    WHERE id = NEW.producto_id;

    INSERT INTO inv_movimientos_inventario (producto_id, tipo, cantidad, motivo)
    VALUES (NEW.producto_id, 'salida', NEW.cantidad, 'Venta por orden');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_descuento_stock
AFTER INSERT ON ord_items_orden
FOR EACH ROW
EXECUTE FUNCTION disminuir_stock();