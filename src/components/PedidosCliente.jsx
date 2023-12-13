import { useState, useEffect } from "react";
import { Carrito } from "./carrito";
import axios from "axios";
const Swal = window.Swal;

export const PedidosCliente = () => {
  const [pedidoAsignado, setPedidoAsignado] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [pedidosProducto, setpeProducto] = useState([]);
  const [reloadPedidos, setReloadPedidos] = useState(false);
  const [pedidosEntregados,setEntregados]= useState([])

  const idCliente = parseInt(localStorage.getItem('id'));

useEffect(()=>{
  const pedidosEntregados = async () =>{
    const url=`http://localhost:8080/api/v1/pedidos-entregados`;
    const response = (await axios.get(url)).data;
    const data= response.filter((pedido) => pedido.cliente==localStorage.getItem('nombre_usr'));
    setEntregados(data)
  }
  pedidosEntregados()
},[])

  useEffect(() => {
    const getPedidos = async () => {
      try {
        const url = "http://localhost:8080/api/v1/pedidos";
        const response = await axios.get(url);
        let pedidosCliente = response.data.filter(
          (pedido) => pedido.cliente_id === idCliente
        );

       const pedidosNoEntregados = pedidosCliente.filter(
            (pedidoCliente) => !pedidosEntregados.some((pedidoEntregado) => pedidoEntregado.pedido_id === pedidoCliente.pedido_id)
);  

        setPedidos(pedidosNoEntregados);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      }
    };

    getPedidos();
  }, [idCliente, reloadPedidos,pedidosEntregados]); // Agregamos reloadPedidos a las dependencias

  const borrarPedido = async (id) => {
    try {
      const url = `http://localhost:8080/api/v1/pedidos/${id}`;

      const result = await Swal.fire({
        title: `Seguro quiere borrar el pedido no. ${id}`,
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: 'No eliminar',
      });

      if (result.isConfirmed) {
        await axios.delete(url);
        Swal.fire({
          title: 'Pedido eliminado',
          showConfirmButton: true,
        });
        
        setReloadPedidos(!reloadPedidos);
      } else if (result.isDenied) {
        Swal.fire('Operación cancelada', '', 'info');
      }
    } catch (error) {
      console.error('Error al borrar el pedido:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url1 = "http://localhost:8080/api/v1/pedidos-asignados";
        const response1 = await axios.get(url1);
        const pedidoAsig = response1.data.filter((pedido) => pedido.cliente === localStorage.getItem('nombre_usr'));
        const url = "http://localhost:8080/api/v1/detalle-pedido";
        const response = await axios.get(url);
        let products = [];
        let productsAsig = [];
        console.log(pedidos)
        for (const pedido of pedidos) {
          let data = response.data.filter((producto) => producto.pedido_id === pedido.pedido_id);
          let detalle = {
            pedido_id: pedido.pedido_id,
            detalle: '',
            total: '',
            asignado: false,
            repartidor: ''
          };
          data.forEach((ped) => {
            pedidoAsig.forEach(pedAsig => {
              if (pedAsig.pedido_id === ped.pedido_id) {
                detalle.asignado = true;
                detalle.repartidor = pedAsig.repartidor_nombre;
              }
            });
            detalle.detalle += ped.cantidad + ' ' + ped.producto_nombre + ', ';
            detalle.total = Number.parseFloat(ped.total).toFixed(2);
          });
          if (detalle.asignado === true) {
            productsAsig.push(detalle);
          } else {
            products.push(detalle);
          }
        }
        console.log(productsAsig)
        setpeProducto(products);
        setPedidoAsignado(productsAsig);
      } catch (error) {
        console.error("Error al obtener detalles del pedido:", error);
      }
    };

    fetchData();
  }, [pedidos, reloadPedidos]);

  return (
    <>
      <section>
        <h3 className="text-center fw-bold mb-5">Pedidos</h3>
        <div className="container d-flex">
          <div className="w-50">
            <h4 className="mb-3 fw-bold ">Pedidos en preparación</h4>
            {pedidosProducto.map((pedido) => (
              <div className="cuerpo-card d-flex flex-column w-75" key={pedido.pedido_id}>
                <h5 className="mb-1">Pedido no. {pedido.pedido_id}</h5>
                <p className="mb-4">Detalle de pedido: {pedido.detalle}</p>
                <p>Total: {pedido.total}lps</p>
                <div className="d-flex justify-content-center">
                  <div className="w-75">
                    <button className="btn btn-danger" onClick={() => { borrarPedido(pedido.pedido_id) }} type="button">Cancelar Pedido</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-50">
            <h4 className="mb-3 fw-bold ">Pedidos en camino</h4>
            {pedidoAsignado.map((pedido) => (
              <div className="cuerpo-card d-flex flex-column w-75" key={pedido.pedido_id}>
                <h5 className="mb-1">Pedido no. {pedido.pedido_id}</h5>
                <p className="mb-4">Detalle de pedido: {pedido.detalle}</p>
                <p className="mb-4">Nombre repartidor: {pedido.repartidor}</p>
                <p>Total: {pedido.total}lps</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Carrito />
    </>
  );
};
