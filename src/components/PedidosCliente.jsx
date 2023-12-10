import { useState,useEffect } from "react";
import { Carrito } from "./carrito"
import axios from "axios";
export const PedidosCliente = () => {
  const [pedidoAsignado, setPedidoAsignado] = useState([]);
  const [pedidos,setPedidos]=useState([]);
  const [pedidosProducto,setpeProducto] = useState([]);
  
  const idCliente= parseInt(localStorage.getItem('id'))

  const getPedidos = async () => {
    try {
      const url = "http://localhost:8080/api/v1/pedidos";
      const response = await axios.get(url);
      let pedidosCliente = response.data.filter(
        (pedido) => pedido.cliente_id === idCliente
      );
      setPedidos(pedidosCliente);
      console.log(pedidosCliente);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };


  const getPedidosAsignados = async () => {
    try {
      const url = "http://localhost:8080/api/v1/pedidos-asignados";
      const response = await axios.get(url);
      let pedidosCliente = response.data.filter(
        (pedido) => pedido.cliente_id === idCliente
      );
      setPedidos(pedidosCliente);
      console.log(pedidosCliente);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };
  useEffect(() => {
    getPedidos();
  }, []);
 
  

  return (
    <>
    <section>
        <h3 className="text-center fw-bold">Pedidos En camino</h3>
    </section>
    <Carrito/>
    </>
  )
}
