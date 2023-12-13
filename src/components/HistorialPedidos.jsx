import { useState, useEffect } from "react";
import axios from "axios";
import { Carrito } from "./carrito";

export const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosEntregados, setPedidosEntregados] = useState([]);
  const id_usr = localStorage.getItem('id')


  useEffect(() => {
    const allPedidos = async () => {
      const url = 'http://localhost:8080/api/v1/pedidos';
      const response = (await axios.get(url)).data;
      const data = response.filter((ped) => ped.cliente_id == id_usr);
      console.log(data)
      setPedidos(data);
    };
    allPedidos();
  }, [id_usr]);

  useEffect(() => {
    const historialPedidos = async () => {
      try {
        const url = 'http://localhost:8080/api/v1/pedidos-repartidor';
        const response = (await axios.get(url)).data;
        const pedidosAsig = response.filter((pedido) => pedido.cliente_id == id_usr);
        let pedidosEntregados = [];

        pedidos.forEach((pedido) => {
          let data = {
            pedido_id: 0,
            cliente_id: '',
            detalle: '',
            direccion: '',
            entregado: false,
            nombre_completo: '',
            referencia: '',

            total: 0.0,
          };

          const x = pedidosAsig.filter((pedi) => pedi.pedido_id === pedido.pedido_id);
          console.log("valor de x"+x)
          x.forEach((x) => {
            data.pedido_id = x.pedido_id;
            data.cliente_id = x.cliente_id;
            data.detalle += x.detalle + ', ';
            data.direccion = x.direccion;
            data.entregado = x.entregado;
            data.nombre_completo = x.nombre_completo;
            data.referencia = x.referencia;
            data.total = parseFloat(x.total).toFixed(2);
          });

          if (data.entregado === true) {
            pedidosEntregados.push(data);
          }
        });
        console.log(pedidosEntregados)
        setPedidosEntregados(pedidosEntregados);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      }
    };
    historialPedidos();
  }, [id_usr, pedidos]);

  return (
    <>
      <section>
        <h3 className="text-center fw-bold mb-5">Historial de Pedidos</h3>
        <div className="container">
          <div className="row">

          <div className="w-100 d-flex justify-content-center">
            <div className="w-75">
              {pedidosEntregados.map((pedido) => (
                <div className="cuerpo-card d-flex flex-column w-100" key={pedido.pedido_id}>
                  <h5 className="mb-1">Pedido no. {pedido.pedido_id}</h5>
                  <p className="mb-1">Detalle de pedido: {pedido.detalle}</p>
                  <p className="mb-1">Cliente:{pedido.nombre_completo}</p>
                  <p className="mb-1">Direccion: {pedido.direccion}</p>
                  <p className="mb-4">Referencia: {pedido.referencia}</p>
                  <p>Total: {pedido.total}lps</p>
                </div>
              ))}
            </div>
          </div>

          </div>
        </div>
      </section>
      <Carrito />
    </>
  );
};