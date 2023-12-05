import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const RestaurantesAdmin = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [registro, setRegistro] = useState({
    restaurante_nombre: '',
    rtn: '',
    correo_electronico: '',
    contrasenia: '',
    colonia_nombre: '',
    ciudad_id: '',
    referencia: '',
  });

  const [, forceUpdate] = useState();

  useEffect(() => {
    const obtenerRestaurantes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/restaurantes');
        const restaurantesConDetalles = await Promise.all(
          response.data.map(async (restaurante) => {
            const coloniaId = restaurante.direccion;
            const coloniaResponse = await axios.get(`http://localhost:8080/api/v1/colonias/${coloniaId}`);
            return { ...restaurante, direccion: ( coloniaResponse.data.colonia_nombre +', '+ coloniaResponse.data.referencia )};
          })
        );

        setRestaurantes(restaurantesConDetalles);
      } catch (error) {
        console.error('Error al obtener restaurantes:', error);
      }
    };

    obtenerRestaurantes();
  }, [forceUpdate]); 

  const handleEliminarRestaurante = async (id) => {
    try {
      Swal.fire({
        title: 'Quiere borrar el restaurante?',
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: `No eliminar`
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`http://localhost:8080/api/v1/restaurantes/${id}`);
          const nuevosRestaurantes = restaurantes.filter(restaurante => restaurante.restaurante_id !== id);
          setRestaurantes(nuevosRestaurantes);

          Swal.fire({
            title: 'Restaurante eliminado',
            showConfirmButton: true
          });
        } else if (result.isDenied) {
          Swal.fire('Operacion cancelada', '', 'info');
        }
      });
    } catch (error) {
      console.error(`Error al eliminar el restaurante con ID ${id}:`, error);
    }
  };

  useEffect(() => {
    const obtenerDepartamentos = async () => {
      try {
        const responseDepartamentos = await axios.get('http://localhost:8080/api/v1/departamentos');
        setDepartamentos(responseDepartamentos.data);

        setCiudades([]);
      } catch (error) {
        console.error('Error al obtener departamentos:', error);
      }
    };

    obtenerDepartamentos();
  }, []);

  const handleDepartamentoChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedDepartamento(selectedValue);

    if (selectedValue) {
      try {
        const responseCiudades = (await axios.get(`http://localhost:8080/api/v1/ciudades`)).data;
        let ciudadesFiltradas = responseCiudades.filter(ciudad => ciudad.departamento_id == selectedValue);
        setCiudades(ciudadesFiltradas);
      } catch (error) {
        console.error('Error al obtener ciudades:', error);
      }
    } else {
      setCiudades([]);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRegistro({
      ...registro,
      [name]: value,
    });
  };

  const handleRegistro = async () => {
    try {
      const contrasenia = registro.contrasenia;
      const confirmaContrasenia = document.getElementById('confirmaContrasenia').value;

      if (contrasenia !== confirmaContrasenia) {
        Swal.fire({
          title: 'Las contraseñas no coinciden',
          icon: 'error',
          showConfirmButton: true,
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registro.correo_electronico)) {
        Swal.fire({
          title: 'Formato de correo electrónico no válido',
          icon: 'error',
          showConfirmButton: true,
        });
        return;
      }

      const dataColonia = {
        "colonia_nombre": registro.colonia_nombre,
        "referencia": registro.referencia,
        "ciudad_id": registro.ciudad_id
      };

      const response1 = await axios.post('http://localhost:8080/api/v1/colonias', dataColonia);

      const data = {
        "restaurante_nombre": registro.restaurante_nombre,
        "correo_electronico": registro.correo_electronico,
        "contrasenia": registro.contrasenia,
        "rtn": registro.rtn,
        "direccion": response1.data.colonia_id
      };
      console.log(data);

      const response = await axios.post('http://localhost:8080/api/v1/restaurantes', data);

      if (response.status === 200) {
        const nuevosRestaurantes = [...restaurantes, response.data];
        setRestaurantes(nuevosRestaurantes);
        
        Swal.fire({
          title: 'REGISTRO EXITOSO',
          showConfirmButton: true
        });
      } else {
        Swal.fire({
          title: 'Error al registrar el usuario, inténtelo de nuevo',
          showConfirmButton: true
        });
      }
    } catch (error) {
      console.error('Error al realizar el registro:', error);
    }
  };

  return (
    <>
      <section className='contenedor'>
        <div className='w-100 h-100'>
          <div className='encabezado'>
            <h2 className='text-center fw-bold'>Restaurantes </h2>
            <div>
              <button type="button" className='w-100 h-100 btn fw-bold' data-bs-toggle="modal" data-bs-target="#registroModal">Registrar Restaurante</button>
            </div>
          </div>
          <div id='div-cards'>
            {restaurantes.map(restaurante => (
              <div className='mb-5 d-flex' key={restaurante.restaurante_id}>
                <div className='w-75 h-100'>
                  <div id='cuerpo-card' className='w-100 h-100'>
                    <h4 className='text-center mt-2 mb-4'>{restaurante.restaurante_nombre}</h4>
                    <p>Dirección: {restaurante.direccion}</p>
                    <p>Correo Electrónico: {restaurante.correo_electronico}</p>
                  </div>
                </div>
                <div className='w-25 h-100 d-flex justify-content-center align-items-center'>
                  <button className='w-50 h-25 btn btn-success' onClick={() => handleEliminarRestaurante(restaurante.restaurante_id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="modal fade" id="registroModal" tabIndex="-1" aria-labelledby="registroModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="registroModalLabel">Registro</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Nombre Restaurante</label>
                  <input type="text" className="form-control" name="restaurante_nombre" onChange={handleInputChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">RTN</label>
                  <input type="text" className="form-control" name="rtn" onChange={handleInputChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo Electrónico</label>
                  <input type="email" className="form-control" name="correo_electronico" onChange={handleInputChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input type="password" className="form-control" name="contrasenia" onChange={handleInputChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirme su Contraseña</label>
                  <input type="password" className="form-control" id="confirmaContrasenia" placeholder="Confirme su Contraseña" required />
                </div>

                <div className='mb-3'>
                  <select
                    className='form-control'
                    name="departamento"
                    id="departamento"
                    onChange={handleDepartamentoChange}
                    value={selectedDepartamento}
                  >
                    <option value="" disabled>Departamento</option>
                    {departamentos.map(departamento => (
                      <option key={departamento.departamento_id} value={departamento.departamento_id}>
                        {departamento.departamento_nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='mb-3'>
                  <select
                    className='form-control'
                    name="ciudad_id"
                    id="ciudad"
                    onChange={handleInputChange}
                    value={registro.ciudad_id}
                  >
                    <option value="" disabled>Seleccione una ciudad</option>
                    {ciudades.map(ciudad => (
                      <option key={ciudad.ciudad_id} value={ciudad.ciudad_id}>
                        {ciudad.ciudad_nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='mb-3'>
                  <input
                    className='form-control'
                    name='colonia_nombre'
                    placeholder='Nombre Colonia'
                    type="text"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <textarea
                    className='form-control'
                    name="referencia"
                    id="referencia"
                    cols="30"
                    rows="5"
                    placeholder='Escriba su direccion'
                    onChange={handleInputChange}
                    value={registro.direccion}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button onClick={handleRegistro} type="submit" className="btn btn-primary" data-bs-dismiss="modal">Registrar</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
