import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import axios from "axios";
import './css/cards.css';
import hamburguesa from './img/burguer.jpg';
const Swal = window.Swal;

export const AreaRestaurante = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    producto_nombre: '',
    descripcion: '',
    precio: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Si el campo es "precio", asegúrate de que solo contiene números
    if (name === 'precio' && isNaN(Number(value))) {
      return; // Evita la entrada no numérica para el campo de precio
    }

    setNuevoProducto({
      ...nuevoProducto,
      [name]: value,
    });
  };

  const restaurante_data = JSON.parse(localStorage.getItem('restaurante'));

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/productos');
        const data = response.data.filter((producto) => producto.restaurante_id === restaurante_data.restaurante_id);
        setProductos(data);
        console.log(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    cargarProductos();
  }, []);

  const eliminarProducto = async (id) => {
    try {
      await Swal.fire({
        title: "Eliminar Producto",
        text: "Seguro quiere eliminar este producto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const url = `http://localhost:8080/api/v1/productos/${id}`;
          await axios.delete(url);
          await Swal.fire({
            title: "Eliminado!",
            text: "Su producto fue eliminado exitosamente!",
            icon: "success",
          });
        }
      });
      window.location.reload();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const registrarProducto = async () => {
    try {
      const nuevoProductoConRestauranteId = {
        ...nuevoProducto,
        restaurante_id: restaurante_data.restaurante_id,
      };

      await axios.post('http://localhost:8080/api/v1/productos', nuevoProductoConRestauranteId);
      await Swal.fire({
        title: "Producto Registrado",
        text: "Su producto fue registrado exitosamente!",
        icon: "success",
      });
      setNuevoProducto({
        producto_nombre: '',
        descripcion: '',
        precio: '',
      });
      window.location.reload();
    } catch (error) {
      console.error('Error al registrar el producto:', error);
    }
  };

  return (
    <>
      <Navbar />
      <section className="container">
        <div className="text-center mt-5 mb-5 d-flex justify-content-between">
          <h3>Productos</h3>
          <div>
            <button className="btn btn-success" type="button" data-bs-toggle="modal" data-bs-target="#registrarProducto">
              Registrar Producto
            </button>
          </div>
        </div>

        <div className='row'>
          {productos.map(producto => (
            <div className='col-xl-3 col-lg-3 col-sm-4 mb-3' key={producto.producto_id}>
              <div className="card">
                <div className='img-card'>
                  <img src={hamburguesa} alt="..." />
                </div>
                <div className="card-body h-auto">
                  <h5 className="card-title text-center">{producto.producto_nombre}</h5>
                  <div className='h-5'>
                    <p className="card-text" name='descripcion'>{producto.descripcion}</p>
                  </div>
                  <p name='precio' className='fw-bold'>Precio: {producto.precio}lps</p>
                </div>
                <div className=" d-flex justify-content-center mb-3">
                  <button className="btn btn-danger" onClick={() => eliminarProducto(producto.producto_id)} type="button">Eliminar Producto</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="modal fade" id="registrarProducto" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="registrarProductoLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="registrarProductoLabel">Registrar Nuevo Producto</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="mb-1" htmlFor="productoNombre">Nombre del Producto:</label>
                <input className="form-control"
                  type="text"
                  id="productoNombre"
                  name="producto_nombre"
                  placeholder="Ingrese el nombre del producto"
                  value={nuevoProducto.producto_nombre}
                  onChange={handleInputChange}
                />
              </div>
            
              <div className="mb-3">
                <label className="mb-1" htmlFor="descripcion">Descripción:</label>
                <textarea className="form-control"
                  id="descripcion"
                  name="descripcion"
                  rows="3"
                  placeholder="Ingrese la descripción del producto"
                  value={nuevoProducto.descripcion}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="mb-3">
                <label  className="mb-1" htmlFor="precio">Precio:</label>
                <input className="form-control"
                  type="text"
                  id="precio"
                  name="precio"
                  placeholder="Ingrese el precio del producto"
                  value={nuevoProducto.precio}
                  onChange={handleInputChange}
                />
              </div>  
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" className="btn btn-primary" onClick={registrarProducto}>Registrar producto</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};