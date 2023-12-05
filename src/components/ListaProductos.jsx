import React, { useState, useEffect } from 'react';
import axios from 'axios';
import hamburguesa from './img/burguer.jpg';
import carrito from './img/car-wb.png'
import './css/cards.css';

export const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    const cargarProductos = async () => {
      const url = "http://localhost:8080/api/v1/productos";
      try {
        const response = await axios.get(url);
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

  const aumentarCantidad = (id) => {
    setCantidades(prevCantidades => ({
      ...prevCantidades,
      [id]: prevCantidades[id] + 1,
    }));
  };

  const disminuirCantidad = (id) => {
    if (cantidades[id] > 1) {
      setCantidades(prevCantidades => ({
        ...prevCantidades,
        [id]: prevCantidades[id] - 1,
      }));
    }
  };


  const agregarCarrito = (id) => {
    // Verificar si existe la clave 'carrito' en el Local Storage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Buscar el producto en el carrito por su ID
    const productoEnCarrito = carrito.find(item => item.id === id);

    // Obtener la cantidad actual del producto o establecerla en 0 si no existe
    const cantidadExistente = productoEnCarrito ? productoEnCarrito.cantidad : 0;

    // Buscar el producto en la lista general de productos
    const producto = productos.find(p => p.producto_id === id);

    // Crear el objeto de producto a agregar al carrito
    const nuevoProducto = {
        id: producto.producto_id,
        nombre: producto.producto_nombre,
        precio: producto.precio,
        cantidad: cantidadExistente + cantidades[id] // Sumar la cantidad existente con la nueva cantidad
    };

    if (productoEnCarrito) {
        // Si el producto ya está en el carrito, actualizar su cantidad
        carrito = carrito.map(item => (item.id === id ? nuevoProducto : item));
    } else {
        // Si el producto no está en el carrito, agregarlo
        carrito.push(nuevoProducto);
    }

    // Guardar el carrito actualizado en el Local Storage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    console.log(`Producto ID: ${id}, Cantidad: ${nuevoProducto.cantidad}`);
    console.log('Producto seleccionado:', nuevoProducto);
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
                      <button type="button" className='btn btn-danger w-100 h-100 d-flex align-items-center justify-content-center' onClick={() => aumentarCantidad(producto.producto_id)}>
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <div className='w-50 p-1'>
                      <input className='w-100 h-100 form-control text-center' type="number" value={cantidades[producto.producto_id]} readOnly />
                    </div>
                    <div className='w-25 p-1'>
                      <button type="button" className='btn btn-danger w-100 h-100 d-flex align-items-center justify-content-center' onClick={() => disminuirCantidad(producto.producto_id)}>
                        <i className="fas fa-minus"></i>
                      </button>
                    </div>
                  </div>
                  <div className='w-100 d-flex justify-content-center'>
                    <button type="button" onClick={() => { agregarCarrito(producto.producto_id); }} className='btn btn-success'>
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button aria-label="carrito"  className="btn btn-flotante" data-bs-toggle="modal" data-bs-target="#carritoModal"> 
          <img src={carrito} className="img-btn-flotante" alt=""/>
        </button>
      </div>


      {/*---------------------Modal Carrito---------------*/}

    <div className="modal fade" id="carritoModal" tabIndex="-1" aria-labelledby="exampleModalCenteredScrollable" aria-hidden="true">
        <div className="modal-dialog  modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
                <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalCenteredScrollable">Carrito de compras</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body" id="productosCarrito">
                  <div className='card-carrito'>
                    <div className='w-'></div>
                    <div></div>
                  </div>
                    
                
                </div>
    {/*---------------------Aqui se renderizan la suma y el boton del local Storage---------------*/}
                <div className="modal-footer justify-content-between">
                <div id="totalPagar" className="d-flex align-content-center">
                </div>
                <button  id="btn-pagar" type="button" className="btn btn-primary">Pagar</button>
                </div>

            </div>
        </div>
    </div>
    </>
  );
};
