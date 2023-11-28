import React, { useState, useEffect } from 'react';
import './css/SignIn.css';
import { useNavigate } from 'react-router-dom';
import ArrowBack from '../assets/arrow-back.png';
import axios from 'axios';

export const SignIn = () => {
  const navegar = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [registro, setRegistro] = useState({
    nombre_completo: '',
    dni: '',
    correoElectronico: '',
    contrasenia: '',
    rol: '',
    colonia_nombre: '',
    ciudad_id:'',
    referencia: '',
  });

  // Obtener todas los departamentos y ciudades al cargar el componente
  useEffect(() => {
    const obtenerDepartamentos = async () => {
      try {
        const responseDepartamentos = await axios.get('http://localhost:8080/api/v1/departamentos');
        setDepartamentos(responseDepartamentos.data);

        // Las ciudades se mantienen vacías hasta que se seleccione un departamento
        setCiudades([]);
      } catch (error) {
        console.error('Error al obtener departamentos:', error);
      }
    };

    obtenerDepartamentos();
  }, []);

  // Filtrar ciudades al seleccionar un departamento
  const handleDepartamentoChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedDepartamento(selectedValue);

    // Filtrar ciudades solo si se selecciona un departamento
    if (selectedValue) {
      try {
        const responseCiudades = (await axios.get(`http://localhost:8080/api/v1/ciudades`)).data;
        let ciudadesFiltradas = responseCiudades.filter(ciudad => ciudad.departamento_id == selectedValue);
        setCiudades(ciudadesFiltradas);
      } catch (error) {
        console.error('Error al obtener ciudades:', error);
      }
    } else {
      // Si no se selecciona un departamento, las ciudades se mantienen vacías
      setCiudades([]);
    }
  };

  // Manejar cambios en los campos de registro
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRegistro({
      ...registro,
      [name]: value,
    });
  };

  // Función para manejar el registro y mostrar en consola
  const handleRegistro = async () => {
    const dataColonia ={
      "colonia_nombre": registro.colonia_nombre,
     "referencia": registro.referencia,
      "ciudad_id": registro.ciudad_id
    }
    const response1 = await axios.post('http://localhost:8080/api/v1/colonias',dataColonia)
    const dataUser ={
      "nombre_completo": registro.nombre_completo,
      "dni": registro.dni,
      "correoElectronico": registro.correoElectronico,
      "contrasenia": registro.contrasenia,
      "rol": registro.rol,
      "direccion": response1.data.colonia_id
    }
    console.log(dataUser);
    const response= await axios.post('http://localhost:8080/api/v1/usuarios',dataUser);
    if(response.status==200){
      Swal.fire({
        title: 'REGISTRO EXITOSO',
        showConfirmButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          LogIn();
        }
      });
    }else{
      Swal.fire({
        title: 'Error al registrar el usuario, intentelo de nuevo',
        showConfirmButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
        }
      });
    }
  };

  const LogIn = () => {
    navegar('/');
  };

  return (
    <>
      <section id='bk'>
        <div id='div-login'>
          <div id='div-formulario'>
            <div className='d-flex mt-3 mb-3'>
              <div id='div-arrow'>
                <img id='arrow-back' src={ArrowBack} onClick={LogIn} alt="" />
              </div>
              <div className='w-100'>
                <h3 className='text-center'>Registrarme</h3>
              </div>
            </div>
            <div className='div-input'>
              <input
                className='input-login'
                placeholder='Nombre Completo'
                type="text"
                name="nombre_completo"
                id="nombre_completo"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='div-input'>
              <input
                className='input-login'
                placeholder='DNI'
                type="text"
                name="dni"
                id="dni"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='div-input'>
              <input
                className='input-login'
                placeholder='Correo Electrónico'
                type="email"
                name="correoElectronico"
                id="correoElectronico"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='div-input'>
              <input
                className='input-login'
                placeholder='Contraseña'
                type="password"
                name="contrasenia"
                id="contrasenia"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='div-input'>
              <input
                className='input-login'
                placeholder='Confirme su Contraseña'
                type="password"
                required
              />
            </div>
            <div className='div-input'>
              <select
                className='input-login w-100'
                name="rol"
                id="rol"
                onChange={handleInputChange}
                value={registro.rol}
              >
                <option value="" disabled>Quien eres?</option>
                <option value="Cliente">Cliente</option>
                <option value="Transportista">Transportista</option>
                <option value="Restaurante">Restaurante</option>
              </select>
            </div>
            <div className='div-input'>
              <select
                className='input-login w-100'
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
            <div className='div-input'>
              <select
                className='input-login w-100'
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
            <div className='div-input'>
              <input
                className='input-login'
                name='colonia_nombre'
                placeholder='Nombre Colonia'
                type="text"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='div-input'>
              <textarea
                className='input-login'
                name="referencia"
                id="referencia"
                cols="30"
                rows="5"
                placeholder='Escriba su direccion'
                onChange={handleInputChange}
                value={registro.direccion}
              ></textarea>
            </div>

            <div className='w-100 mt-5'>
              <button onClick={handleRegistro} className='btn btn-danger w-100' type='button'>Registrarme</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
