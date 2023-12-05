import { useState, useEffect } from 'react'
import './css/areaInfo.css'
import axios from 'axios';
export const Pedidos = () => {

  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Hacer la solicitud a la API
    axios.get('http://localhost:8080/api/v1/detalle-pedido')
      .then(response => {
        // Organizar los datos por ID de pedido
        console.log(response.data);
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
        <div id='div-cards'>
        <div>
          {Object.keys(pedidos).map(pedido_id => (
            <div key={pedido_id} className="pedido-card">
              <h3>Pedido ID: {pedido_id}</h3>
              {pedidos[pedido_id].map(detalle => (
                <div key={detalle.pedidoxproducto} className="cuerpo-card">
                  <p>id: {detalle.pedidoxproducto}</p>
                  <p>Restaurante: {detalle.restaurante_nombre}</p>
                  <p>Producto: {detalle.producto_nombre}</p>
                  <p>Cantidad: {detalle.cantidad}</p>
                  <img src={`http://localhost:8080/uploads/productos/${detalle.ruta_carpeta_imagenes}`} alt="imagen" />
                </div>
              ))}
            </div>
          ))}
        </div>
        </div>
        </div>
    </section>
    </>
  )
}
