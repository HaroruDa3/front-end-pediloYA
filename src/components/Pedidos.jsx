import { useState, useEffect } from 'react'
import './css/areaInfo.css'
import axios from 'axios';
const Swal = window.Swal;
export const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [pedidoSelect, setPedidoSelect] = useState('');
  const [pedidoAsignado, setPedidoAsignado] = useState([]);

  const obtenerPedidosAsignados = async () => {
    try {
      const pedidosAsignados = await axios.get('http://localhost:8080/api/v1/pedidos-asignados');
      const uniquePedidosAsignados = {};
      pedidosAsignados.data.forEach((pedido) => {
        const { pedido_asignado_id, producto_nombre, total, ...rest } = pedido;
        if (uniquePedidosAsignados[pedido_asignado_id]) {
          uniquePedidosAsignados[pedido_asignado_id].producto_nombre += `, ${producto_nombre}`;
        } else {
          uniquePedidosAsignados[pedido_asignado_id] = { ...rest, pedido_asignado_id, producto_nombre, total: parseFloat(total).toFixed(2) };
        }
      });
      const pedidosAsignadosUnicos = Object.values(uniquePedidosAsignados);
  
      setPedidoAsignado(pedidosAsignadosUnicos);
    } catch (error) {
      console.error('Error al obtener pedidos asignados:', error);
    }
  };
  

  useEffect(() => {
    obtenerPedidosAsignados();
  }, [pedidoSelect]);

  const seleccionarPedido = (id) => {
    setPedidoSelect(id);
  };

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/detalle-pedido');
        const pedidosAsignadosIds = pedidoAsignado.map((pedido) => pedido.pedido_id);
        const pedidosSinAsignar = response.data.filter((pedido) => !pedidosAsignadosIds.includes(pedido.pedido_id));
        const groupedPedidos = groupByPedidoId(pedidosSinAsignar);
        setPedidos(groupedPedidos);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    };

    obtenerPedidos();
  }, [pedidoAsignado, pedidoSelect]);

  useEffect(() => {
    obtenerRepartidores();
  }, []);

  const obtenerRepartidores = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/usuarios');
      const repartidoresFiltrados = response.data.filter((usuario) => usuario.rol === 'Repartidor');
      const repartidorConDetalles = await Promise.all(
        repartidoresFiltrados.map(async (repartidor) => {
          const coloniaId = repartidor.direccion;
          const coloniaResponse = await axios.get(`http://localhost:8080/api/v1/colonias/${coloniaId}`);
          return { ...repartidor, direccion: coloniaResponse.data.colonia_nombre + ', ' + coloniaResponse.data.referencia };
        })
      );
      setRepartidores(repartidorConDetalles);
    } catch (error) {
      console.error('Error al obtener repartidores:', error);
    }
  };

  const groupByPedidoId = (data) => {
    const grouped = {};
    data.forEach((pedido) => {
      if (!grouped[pedido.pedido_id]) {
        grouped[pedido.pedido_id] = [pedido];
      } else {
        grouped[pedido.pedido_id].push(pedido);
      }
    });
    return grouped;
  };

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
        setPedidos((prevPedidos) => {
          const updatedPedidos = { ...prevPedidos };
          delete updatedPedidos[id];
          return updatedPedidos;
        });
        Swal.fire({
          title: 'Pedido eliminado',
          showConfirmButton: true,
        });
      } else if (result.isDenied) {
        Swal.fire('Operación cancelada', '', 'info');
      }
    } catch (error) {
      console.error('Error al borrar el pedido:', error);
    }
  };

  const asignarPedido = async (id) => {
    console.log(pedidoSelect);
    console.log(id);

    const data = {
      pedido_id: parseInt(pedidoSelect),
      repartidor_id: id,
      entregado: 0,
    };
    console.log(data);

    try {
      const url = 'http://localhost:8080/api/v1/pedidos_asignados';
      await axios.post(url, data);
      Swal.fire({
        title: 'Pedido asignado exitosamente',
        showDenyButton: true,
        confirmButtonText: 'OK',
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log('Nice');
          obtenerPedidosAsignados();
          setPedidoSelect('');
        }
      });
    } catch (error) {
      console.error({ error: 'Error al asignar el repartidor' });
    }
  };

  return (
    <>
      <section className="contenedor">
        <div className="w-100 h-100">
          <div className="encabezado">
            <h2 className="text-center fw-bold">Pedidos en espera</h2>
            <div>
              <button type="button" className="w-100 h-100 btn fw-bold" data-bs-toggle="modal" data-bs-target="#registroModal">
                Eliminar pedidos
              </button>
            </div>
          </div>

          <div id="contenedor-pedidos">
            <div id="pedidosSinAsignar" className="p-2">
              <h3 className="text-center mb-4">Pedidos sin repartidor</h3>
              <div>
                {Object.keys(pedidos).map((pedido_id) => (
                  <div key={pedido_id} className="cuerpo-card d-flex flex-column p-3">
                    <div className="w-100 d-flex justify-content-between">
                      <div className="w-auto">
                        <h4>Pedido No. {pedido_id}</h4>
                      </div>
                      <div className="w-auto">
                        <button
                          className="btn btn-success"
                          onClick={() => seleccionarPedido(pedido_id)}
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#asignarRepartidor"
                        >
                          Asignar Repartidor
                        </button>
                      </div>
                    </div>
                    {pedidos[pedido_id].map((detalle) => (
                      <div className="w-100 d-flex" key={detalle.pedidoxproducto}>
                        <div className="w-75">
                          <div>id: {detalle.pedidoxproducto}</div>
                          <div>Restaurante: {detalle.restaurante_nombre}</div>
                          <div>Producto: {detalle.producto_nombre}</div>
                          <div>Cantidad: {detalle.cantidad}</div>
                        </div>
                        <div className="w-25">
                          <img
                            className="img-fluid"
                            src={`http://localhost:8080/uploads/productos/${detalle.ruta_carpeta_imagenes}`}
                            alt="imagen"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div id="pedidos-asignados" className="p2">
              <h3 className="text-center mb-4">Pedidos Asignados</h3>
              <div>
                {pedidoAsignado.map((pedido) => (
                  <div key={pedido.pedido_asignado_id} className="cuerpo-card d-flex flex-column p-3">
                    <div className="w-100 d-flex justify-content-between">
                      <div className="w-auto">
                        <h4>Pedido No. {pedido.pedido_id}</h4>
                      </div>
                      <div className="w-auto">
                        <span className="badge bg-success">Asignado</span>
                      </div>
                    </div>
                    <div className="w-100 d-flex">
                      <div className="w-75">
                        <div>Repartidor: {pedido.repartidor_nombre}</div>
                        <div>Producto: {pedido.producto_nombre}</div>
                        <div>Total: {pedido.total} USD</div>
                        <div>Cliente: {pedido.cliente}</div>
                        <div>Dirección: {pedido.direccion}</div>
                        <div>Fecha de Emisión: {pedido.fecha_emision || 'No disponible'}</div>
                      </div>
                      <div className="w-25">
                        <img
                          className="img-fluid"
                          src={`http://localhost:8080/uploads/productos/${pedido.ruta_carpeta_imagenes}`}
                          alt="imagen"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



    <div className="modal fade" id="registroModal" tabIndex="-1" aria-labelledby="registroModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="registroModalLabel">
                Eliminar Pedidos
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <table className="table table-borderless">
              <thead >
              {Object.keys(pedidos).map(pedido => (
                <tr key={pedidos[pedido][0].pedido_id} className='d-flex justify-content-between border-bottom'>
                  <th scope="col">Pedido no. {pedido}</th>
                  <td>
                    <button
                      className='btn btn-danger'
                      onClick={() => borrarPedido(pedidos[pedido][0].pedido_id)}
                      type="button"
                      data-bs-dismiss="modal">
                      Eliminar Pedido
                    </button>
                  </td>
                </tr>
              ))}
              </thead>
              <tbody>
              </tbody>
            </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="asignarRepartidor" tabIndex="-1" aria-labelledby="asignarRepartidorLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="asignarRepartidorLabel">
                Seleccionar Repartidor
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <table className="table table-borderless">
              <thead >
              {repartidores.map(repartidor => (
                <tr key={repartidor.id} className='d-flex justify-content-between border-bottom'>
                  <th>{repartidor.nombre_completo}, {repartidor.correoElectronico}</th>
                  <td>
                  <button type="button" className='btn btn-success' onClick={()=>asignarPedido(repartidor.id)}data-bs-dismiss="modal">Asginar</button> 
                  </td>
                </tr>
              ))}
              </thead>
              <tbody>
              </tbody>
            </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
