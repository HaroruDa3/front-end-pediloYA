import React, { useState, useEffect } from 'react';
import axios from 'axios';
import hamburguesa from './img/burguer.jpg';
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
    console.log(`Producto ID: ${id}, Cantidad: ${cantidades[id]}`);
    const producto = productos.find(p => p.producto_id == id);
    console.log('Producto seleccionado:', producto);
    // Aquí puedes realizar las acciones necesarias con el producto y la cantidad.
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
      </div>
    </>
  );
};
