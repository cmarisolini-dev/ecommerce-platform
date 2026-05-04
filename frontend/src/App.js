import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    fetch("https://ecommerce-platform-gw0x.onrender.com/productos")
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);


const agregar = (producto) => {
  const existe = carrito.find(item => item.id === producto.id);

  if (existe) {
    setCarrito(
      carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  } else {
    setCarrito([...carrito, { ...producto, cantidad: 1 }]);
  }
};

  const quitarUno = (id) => {
  setCarrito(
    carrito.map(item =>
      item.id === id
        ? { ...item, cantidad: item.cantidad - 1 }
        : item
    ).filter(item => item.cantidad > 0)
  );
};

const eliminar = (id) => {
  setCarrito(carrito.filter(item => item.id !== id));
};

const total = carrito.reduce(
  (acc, item) => acc + item.precio * item.cantidad,
  0
);


  return (
    <div className="app">

      <header className="navbar">
        <h2 className="logo">ShopPro</h2>

        <div className="search">
          <input placeholder="Buscar productos..." />
        </div>

        <div className="cart">
          🛒 {carrito.length}
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="container">

        {/* PRODUCTOS */}
        <section className="products">
          {productos.map(p => (
            <div key={p.id} className="card">

              <div className="card-title">{p.nombre}</div>

              {/* 🖼️ IMAGEN DESDE BD */}
              <img
                src={`/imagenes/${p.imagen}`}
                alt={p.nombre}
                className="product-img"
              />

              <div className="price">S/ {p.precio}</div>

              <div className="stock">Stock: {p.stock}</div>

              <button onClick={() => agregar(p)}>
                Agregar al carrito
              </button>

            </div>
          ))}
        </section>

        {/* CARRITO LATERAL */}
        <aside className="sidebar">

        <div className="cart-header">
          <h3>🛒 Tu carrito</h3>
          <span className="cart-count">{carrito.length}</span>
        </div>

        {carrito.length === 0 ? (
          <p className="empty">Tu carrito está vacío</p>
        ) : (
          <>
            <div className="cart-items">

              {carrito.map(item => (
                <div key={item.id} className="cart-item">

                  <div className="item-left">

                    <div className="item-name">
                      {item.nombre}
                    </div>

                    <div className="item-meta">
                    <span>S/ {item.precio}</span>
                    <span className="dot">•</span>
                    <span className="qty">Cantidad: {item.cantidad}</span>
                    </div>
                  </div>

                  <div className="item-actions">

                    <button onClick={() => quitarUno(item.id)}>➖</button>
                    <button onClick={() => agregar(item)}>➕</button>
                    <button onClick={() => eliminar(item.id)}>🗑</button>

                  </div>

                </div>
              ))}

            </div>

            <div className="cart-footer">
            <div className="total-box">
              Total:
              <span>S/ {total}</span>
            </div>

            <button className="buy-btn">
              Comprar ahora
            </button>
          </div>
          </>
        )}
      </aside>    


      </div>
    </div>
  );
}

export default App;
