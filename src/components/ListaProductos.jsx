import React, { useState, useEffect } from 'react';
import axios from 'axios';
import hamburguesa from './img/burguer.jpg';
import carrito from './img/car-wb.png';
import carritoVacio from './img/carrito-vacio.png';
import './css/cards.css';

export const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [carritoInfo, setCarritoInfo] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/productos');
        setProductos(response.data);
        const cantidadesInicial = {};
        response.data.forEach(producto => {
          cantidadesInicial[producto.producto_id] = 1;
        });
        setCantidades(cantidadesInicial);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    cargarProductos();
  }, []);

  useEffect(() => {
    const mostrarCarrito = () => {
      const carritoLocalStorage = JSON.parse(localStorage.getItem('carrito')) || [];
      setCarritoInfo(carritoLocalStorage);
    };

    mostrarCarrito();
  }, []);

  const actualizarLocalStorage = (nuevoCarrito) => {
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    setCarritoInfo(nuevoCarrito);
  };

  const ajustarCantidad = (id, cantidad) => {
    const nuevasCantidades = { ...cantidades, [id]: cantidad };
    setCantidades(nuevasCantidades);
  };

  const agregarCarrito = (id) => {
    const carritoLocalStorage = JSON.parse(localStorage.getItem('carrito')) || [];
    const cantidad = cantidades[id];

    const productoEnCarrito = carritoLocalStorage.find(item => item.id === id);
    const cantidadExistente = productoEnCarrito ? productoEnCarrito.cantidad : 0;
    const producto = productos.find(p => p.producto_id === id);

    const nuevoProducto = {
      id: producto.producto_id,
      nombre: producto.producto_nombre,
      precio: producto.precio,
      cantidad: cantidadExistente + cantidad
    };

    const nuevoCarrito = productoEnCarrito
      ? carritoLocalStorage.map(item => (item.id === id ? nuevoProducto : item))
      : [...carritoLocalStorage, nuevoProducto];

    actualizarLocalStorage(nuevoCarrito);

    Swal.fire({
      title: 'Producto agregado al carrito',
      showConfirmButton: true
    });
  };

  const eliminarProductoCarrito = (id) => {
    const carritoLocalStorage = JSON.parse(localStorage.getItem('carrito')) || [];
    const nuevoCarrito = carritoLocalStorage.filter(item => item.id !== id);
    actualizarLocalStorage(nuevoCarrito);
  };

  const generarFactura = async () => {
    const carrito = JSON.parse(localStorage.getItem('carrito'));
    let detalleProductos = "";
    let detalle = 0;
  
    carrito.forEach(producto => {
      detalleProductos += ' ' + producto.cantidad + ' ' + producto.nombre;
      detalle += parseFloat(producto.cantidad * producto.precio);
    });
  
    try {
      const result = await Swal.fire({
        title: `Detalle: ${detalleProductos}, Total:${detalle}, ¿Seguro quiere hacer el pedido?`,
        showDenyButton: true,
        confirmButtonText: 'Hacer Pedido',
        denyButtonText: `No`
      });
  
      if (result.isConfirmed) {
        const dataPedido = {
          cliente_id: parseInt(localStorage.getItem('id')),
          total: detalle
        };
  
        const responsePedido = await axios.post('http://localhost:8080/api/v1/pedidos', dataPedido);
        const pedido_id = responsePedido.data.pedido_id;
  
        const pedidosxproductosData = carrito.map(async (producto) => {
          const pedidoXProductoData = {
            pedido_id: pedido_id,
            producto_id: producto.id,
            cantidad: producto.cantidad
          };
  
          try {
            const response = await axios.post('http://localhost:8080/api/v1/pedidosxproductos', pedidoXProductoData);
            return response.data; 
          } catch (error) {
            console.error(`Error al asociar el producto ID ${producto.id} al pedido:`, error);
            throw error;  
          }
        });
  
        await Promise.all(pedidosxproductosData);
        Swal.fire({
          title: 'Pedido realizado',
          showConfirmButton: true
        }).then((result) => {
          if (result.isConfirmed) {
          localStorage.removeItem('carrito')
          }
        });
      } else if (result.isDenied) {
        Swal.fire('Pedido Cancelado', '', 'info');
      }
    } catch (error) {
      console.error('Error al generar la factura:', error);
      Swal.fire({
        title: 'Error al realizar el pedido, inténtelo de nuevo',
        showConfirmButton: true
      });
    }
  };
  

  return (
    <>
      <div className='container'>
        <h4 className='fw-bold text-center'>PRODUCTOS</h4>
        <div className='row'>
          {productos.map(producto => (
            <div className='col-xl-3 col-lg-3 col-sm-4 mb-3' key={producto.producto_id}>
              <div className="card">
                <div className='img-card'>
                  <img src={hamburguesa} alt="..." />
                </div>
                <div className="card-body">
                  <h5 className="card-title text-center">{producto.producto_nombre}</h5>
                  <div className='h-5'>
                    <p className="card-text" name='descripcion'>{producto.descripcion}</p>
                  </div>
                  <p name='precio' className='fw-bold'>Precio: {producto.precio}lps</p>
                  <div className='w-100 d-flex h-5 mb-3'>
                    <div className='w-25 p-1'>
                      <button type="button" className='btn btn-danger w-100 h-100 d-flex align-items-center justify-content-center' onClick={() => ajustarCantidad(producto.producto_id, cantidades[producto.producto_id] + 1)}>
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <div className='w-50 p-1'>
                      <input className='w-100 h-100 form-control text-center' type="number" value={cantidades[producto.producto_id]} readOnly />
                    </div>
                    <div className='w-25 p-1'>
                      <button type="button" className='btn btn-danger w-100 h-100 d-flex align-items-center justify-content-center' onClick={() => ajustarCantidad(producto.producto_id, cantidades[producto.producto_id] - 1)}>
                        <i className="fas fa-minus"></i>
                      </button>
                    </div>
                  </div>
                  <div className='w-100 d-flex justify-content-center'>
                    <button type="button" onClick={() => agregarCarrito(producto.producto_id)} className='btn btn-success'>
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button aria-label="carrito" className="btn btn-flotante" data-bs-toggle="modal" data-bs-target="#carritoModal">
          <img src={carrito} className="img-btn-flotante" alt="" />
        </button>
      </div>

      {/* Modal del Carrito */}
      <div className="modal fade" id="carritoModal" tabIndex="-1" aria-labelledby="exampleModalCenteredScrollable" aria-hidden="true">
        <div className="modal-dialog  modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalCenteredScrollable">Carrito de compras</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body" id="productosCarrito">
              {carritoInfo.length === 0 ? (
                <div className="text-center">
                  <img src={carritoVacio} alt="Carrito vacío" />
                  <p>¡Tu carrito está vacío!</p>
                </div>
              ) : (
                carritoInfo.map(producto => (
                  <div className='card-carrito' key={producto.id}>
                    <div className='w-100 h-100 d-flex align-items-center'>
                      <img className='img-card-carrito' src={hamburguesa} alt="..." />
                    </div>
                    <div className='mx-3'>
                      <div className='d-flex justify-content-between mb-3'>
                        <div className='text-center fw-bold'>{producto.nombre}</div>
                        <button type="button" className='btn btn-close' onClick={() => eliminarProductoCarrito(producto.id)}></button>
                      </div>
                      <div className='mb-1'>Cantidad: {producto.cantidad}</div>
                      <div className='mb-2'>Precio: {producto.precio}lps</div>
                      <div className='fw-bold text-end'>Monto: {producto.cantidad * producto.precio}lps</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="modal-footer justify-content-between">
              <div id="totalPagar" className="d-flex align-content-center fw-bold">
                Total: {carritoInfo.reduce((total, producto) => total + (producto.cantidad * producto.precio), 0).toFixed(2)}lps
              </div>
              <button type="button" className="btn btn-primary" onClick={generarFactura} data-bs-dismiss="modal" aria-label="Close">Pagar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
