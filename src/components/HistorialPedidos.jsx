import { useState, useEffect } from "react";
import axios from "axios";
import { Carrito } from "./carrito";

export const HistorialPedidos = () => {
  const [pedidosEntregados, setPedidosEntregados] = useState([]);
  const nombreUsuario = localStorage.getItem('nombre_usr');

  useEffect(() => {
    const fetchPedidosEntregados = async () => {
      try {
        const url = "http://localhost:8080/api/v1/pedidos-entregados";
        const response = await axios.get(url);
        setPedidosEntregados(response.data);
      } catch (error) {
        console.error("Error al obtener pedidos entregados:", error);
      }
    };

    fetchPedidosEntregados();
  }, []);



  const historialPedidos = pedidosEntregados.filter(pedido => pedido.cliente === nombreUsuario);

  return (
    <>
      <section>
        <h3 className="text-center fw-bold mb-5">Historial de Pedidos</h3>
        <div className="container">
          {historialPedidos.length > 0 ? (
            historialPedidos.map((pedido) => (
              <div className="cuerpo-card d-flex flex-column w-75" key={pedido.pedido_id}>
                <h5 className="mb-1">Pedido no. {pedido.pedido_id}</h5>
                <p className="mb-4">Detalle de pedido: {pedido.producto_nombre}</p>
                <p>Total: {pedido.total}lps</p>
                <p>Fecha de emisión: {pedido.fecha_emision}</p>
              </div>
            ))
          ) : (
            <p className="text-center">Usted no tiene pedidos en su historial de compra.</p>
          )}
        </div>
      </section>
      <Carrito />
    </>
  );
};