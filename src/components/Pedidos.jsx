import { useState, useEffect } from 'react'
import './css/areaInfo.css'
import axios from 'axios';
export const Pedidos = () => {

  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/detalle-pedido')
      .then(response => {
        // Organizar los datos por ID de pedido
        const groupedPedidos = groupByPedidoId(response.data);
        setPedidos(groupedPedidos);
      })
      .catch(error => {
        console.error('Error al obtener los pedidos:', error);
      });
  }, []);

  const groupByPedidoId = (data) => {
    // Función para agrupar los pedidos por ID de pedido
    const grouped = {};
    data.forEach(pedido => {
      if (!grouped[pedido.pedido_id]) {
        grouped[pedido.pedido_id] = [pedido];
      } else {
        grouped[pedido.pedido_id].push(pedido);
      }
    });
    return grouped;
  };

  const borrarPedido = (id) => {
    try {
      const url =`http://localhost:8080/api/v1/pedidos/${id}`;

      Swal.fire({
        title: `Seguro quiere borrar el pedido no. ${id}`,
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: 'No eliminar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(url);
          const updatedPedidos = { ...pedidos };
          delete updatedPedidos[id];
          setPedidos(updatedPedidos);
          Swal.fire({
            title: 'Repartidor eliminado',
            showConfirmButton: true,
          });
        } else if (result.isDenied) {
          Swal.fire('Operación cancelada', '', 'info');
        }
      });
      

    } catch (error) {
      console.error('Error al borrar el pedido:', error);
    }
  };

return (
    <>
    <section className='contenedor'>
        <div className='w-100 h-100'>
        <div className='encabezado'>
            <h2 className='text-center fw-bold'>Pedidos en espera</h2>
            <div>
                <button type="button" className='w-100 h-100 btn fw-bold' data-bs-toggle="modal" data-bs-target="#registroModal">Eliminar pedidos</button>
            </div> 
        </div>


        <div id='contenedor-pedidos'>


        <div id='pedidos sin asignar' className='p-2'>
          <h3 className='text-center mb-4'>Pedidos sin repartidor</h3>
        <div>
          {Object.keys(pedidos).map(pedido_id => (
            <div key={pedido_id} className="cuerpo-card d-flex flex-column p-3">
              <div className='w-100 d-flex justify-content-between'>
                <div className='w-auto'>
                  <h4>Pedido No. {pedido_id}</h4>
                </div>
                <div className='w-auto'>
                  <button className='btn btn-success' type='button'>Asignar Repartidor</button>
                </div>
              </div>
              {pedidos[pedido_id].map(detalle => (
                <div className='w-100 d-flex' key={detalle.pedidoxproducto} >
                  <div className='w-75'>
                    <div>id: {detalle.pedidoxproducto}</div>
                    <div>Restaurante: {detalle.restaurante_nombre}</div>
                    <div>Producto: {detalle.producto_nombre}</div>
                    <div>Cantidad: {detalle.cantidad}</div>
                  </div>
                 <div className='w-25'>
                  <img src={`http://localhost:8080/uploads/productos/${detalle.ruta_carpeta_imagenes}`} alt="imagen" />
                 </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        </div>

        <div id='pedidos-asignados' className='p2'>
          <h3 className='text-center mb-4'>Pedidos Asignados</h3>
          <div>

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
            <table class="table table-borderless">
              <thead >
              {Object.keys(pedidos).map(pedido => (

                  <tr className='d-flex justify-content-between border-bottom'>
                  <th scope="col">Pedido no. {pedido}</th>
                  <td> <button className='btn btn-danger' onClick={() => borrarPedido(pedidos[pedido][0].pedido_id)} type="button" data-bs-dismiss="modal">
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
    </>
  )
}
