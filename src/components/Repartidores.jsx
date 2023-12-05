import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Repartidores = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [registro, setRegistro] = useState({
    nombre_completo: '',
    dni: '',
    correoElectronico: '',
    contrasenia: '',
    rol: 'Repartidor',
    colonia_nombre: '',
    ciudad_id: '',
    referencia: '',
  });

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

  const handleEliminarRepartidor = (id) => {
    try {
      Swal.fire({
        title: 'Quiere borrar el repartidor',
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: 'No eliminar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`http://localhost:8080/api/v1/usuarios/${id}`);
          Swal.fire({
            title: 'Repartidor eliminado',
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              obtenerRepartidores();
            }
          });
        } else if (result.isDenied) {
          Swal.fire('Operación cancelada', '', 'info');
        }
      });
    } catch (error) {
      console.error(`Error al eliminar el repartidor con ID ${id}:`, error);
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
        let ciudadesFiltradas = responseCiudades.filter((ciudad) => ciudad.departamento_id == selectedValue);
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
    event.preventDefault();
    const dataColonia = {
      colonia_nombre: registro.colonia_nombre,
      referencia: registro.referencia,
      ciudad_id: registro.ciudad_id,
    };

    const response1 = await axios.post('http://localhost:8080/api/v1/colonias', dataColonia);
    const dataUser = {
      nombre_completo: registro.nombre_completo,
      dni: registro.dni,
      correoElectronico: registro.correoElectronico,
      contrasenia: registro.contrasenia,
      rol: registro.rol,
      direccion: response1.data.colonia_id,
    };

    console.log(dataUser);
    const response = await axios.post('http://localhost:8080/api/v1/usuarios', dataUser);
    if (response.status === 200) {
      Swal.fire({
        title: 'REGISTRO EXITOSO',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          obtenerRepartidores();
        }
      });
    } else {
      Swal.fire({
        title: 'Error al registrar el usuario, inténtelo de nuevo',
        showConfirmButton: true,
      });
    }
  };

  return (
    <>
      <section className="contenedor">
        <div className="w-100 h-100">
          <div className="encabezado">
            <h2 className="text-center fw-bold">Repartidores </h2>
            <div>
              <button type="button" className="w-100 h-100 btn fw-bold" data-bs-toggle="modal" data-bs-target="#registroModal">
                Registrar Repartidor
              </button>
            </div>
          </div>
          <div id="div-cards">
            {repartidores.map((repartidor) => (
              <div className="mb-5 d-flex" key={repartidor.id}>
                <div className="w-75 h-100">
                  <div id="cuerpo-card" className="w-100 h-100">
                    <h4 className="text-center mt-2 mb-4">{repartidor.nombre_completo}</h4>
                    <p>Dirección: {repartidor.direccion}</p>
                    <p>Correo Electrónico: {repartidor.correoElectronico}</p>
                  </div>
                </div>
                <div className="w-25 h-100 d-flex justify-content-center">
                  <button className="w-50 h-25 btn btn-success" onClick={() => handleEliminarRepartidor(repartidor.id)}>
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
              <h5 className="modal-title" id="registroModalLabel">
                Registro
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <form>
          <div class="mb-3">
            <label for="nombreCompleto" class="form-label">Nombre Repartidor</label>
            <input type="text" class="form-control" name="nombre_completo" onChange={handleInputChange} required/>
          </div>

          <div class="mb-3">
            <label for="dni" class="form-label">DNI</label>
            <input type="text" class="form-control" name="dni" onChange={handleInputChange} required/>
          </div>

          <div class="mb-3">
            <label for="correoElectronico" class="form-label">Correo Electrónico</label>
            <input type="email" class="form-control" name="correoElectronico" onChange={handleInputChange} required/>
          </div>

          <div class="mb-3">
            <label for="contrasenia" class="form-label">Contraseña</label>
            <input type="password" class="form-control"  name="contrasenia" onChange={handleInputChange} required/>
          </div>

          <div class="mb-3">
            <label for="confirmaContrasenia" class="form-label">Confirme su Contraseña</label>
            <input type="password" class="form-control" id="confirmaContrasenia" placeholder="Confirme su Contraseña" required/>
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
              <button onClick={handleRegistro} type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                Registrar
              </button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
