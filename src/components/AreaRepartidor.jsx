import { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";
import '../components/css/areaInfo.css';
const Swal = window.Swal;

export const AreaRepartidor = () => {
  const [pedidosEntregados, setPedidosEntregados] = useState([]);
  const [pedidosAsignados, setPedidosAsig] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [reloadPedidos, setReloadPedidos] = useState(false);
  const id_repartidor = parseInt(localStorage.getItem('id'));

  useEffect(() => {
    const allPedidos = async () => {
      const url = 'http://localhost:8080/api/v1/pedidos_asignados';
      const response = (await axios.get(url)).data;
      const data = response.filter((ped) => ped.repartidor_id === id_repartidor);
      setPedidos(data);
    };
    allPedidos();
  }, [id_repartidor]);

  useEffect(() => {
    const pedidosRepartidor = async () => {
      try {
        const url = 'http://localhost:8080/api/v1/pedidos-repartidor';
        const response = (await axios.get(url)).data;
        const pedidosAsig = response.filter((pedido) => pedido.repartidor_id === id_repartidor);
        let pedidosEntregados = [];
        let pedidosSinEntregar = [];

        pedidos.forEach((pedido) => {
          let data = {
            asignado:pedido.pedido_asignado_id,
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

          if (data.entregado === false) {
            pedidosSinEntregar.push(data);
          } else {
            pedidosEntregados.push(data);
          }
        });
        console.log(pedidosEntregados)
        setPedidosEntregados(pedidosEntregados);
        setPedidosAsig(pedidosSinEntregar);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      }
    };
    pedidosRepartidor();
  }, [id_repartidor, pedidos, reloadPedidos]);

  const marcarPedidoEntregado = async (id, pedido_id) => {
    console.log(id)
    console.log(pedido_id)
    const data={
      pedido_asignado_id: id,
        pedido_id: pedido_id,
        repartidor_id: parseInt(localStorage.getItem('id')),
        entregado: true
    
    }
    const url = `http://localhost:8080/api/v1/pedidos_asignados/${id}`;

    try {
      const result = await Swal.fire({
        title: `¿Seguro que quieres marcar como entregado el pedido no. ${id}?`,
        showDenyButton: true,
        confirmButtonText: 'Sí, marcar como entregado',
        denyButtonText: 'No, cancelar',
      });

      if (result.isConfirmed) {
        await axios.put(url,data); // Actualiza el pedido como entregado en la API

        Swal.fire({
          title: 'Pedido marcado como entregado',
          showConfirmButton: true,
        });

        setReloadPedidos(!reloadPedidos);
      } else if (result.isDenied) {
        Swal.fire('Operación cancelada', '', 'info');
      }
    } catch (error) {
      console.error('Error al marcar pedido como entregado:', error);
    }
  };

  return (
    <>
      <Navbar />
      <section className="mt-5 w-100 d-flex flex-row">
        <div className="w-50">
          <h4 className="mb-5 text-center">Pedidos pendientes de entrega</h4>
          <div className="w-100 d-flex justify-content-center">
            <div className="w-75">
              {pedidosAsignados.map((pedido) => (
                <div className="cuerpo-card d-flex flex-column w-100" key={pedido.pedido_id}>
                  <h5 className="mb-1">Pedido no. {pedido.pedido_id}</h5>
                  <p className="mb-1">Detalle de pedido: {pedido.detalle}</p>
                  <p className="mb-1">Cliente:{pedido.nombre_completo}</p>
                  <p className="mb-1">Direccion: {pedido.direccion}</p>
                  <p className="mb-4">Referencia: {pedido.referencia}</p>
                  <p>Total: {pedido.total}lps</p>
                  <div className="d-flex justify-content-center">
                    <div className="w-75">
                      <button
                        className="btn btn-success"
                        onClick={() => marcarPedidoEntregado(pedido.asignado, pedido.pedido_id)}
                        type="button"
                      >
                        Pedido Entregado
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-50">
          <h4 className="mb-5 text-center"> Pedidos Entregados</h4>
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
                  <div className="d-flex justify-content-center">
                    <div className="w-75">
                      <button className="btn btn-success" type="button">
                        Pedido Entregado
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
