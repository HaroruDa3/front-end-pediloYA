import React, { useState } from 'react';
import './css/Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const url = 'http://localhost:8080/api/v1/usuarios/login';

export const Login = () => {

  const [dataLogin, setDataLogin] = useState({
    correoElectronico: "",
    contrasenia: "",
  });

  const navegar = useNavigate();

  const singIn = () => {
    navegar('/signIn');
  };

  const inicio = async () => {
    // Validar que los campos no estén vacíos
    if (!dataLogin.correoElectronico || !dataLogin.contrasenia) {
        Swal.fire({
            title: 'Debe de completar los campos',
            showConfirmButton: true
        });
    }else{
        try {
            // Realizar una solicitud POST con Axios
            const response = await axios.post(url, dataLogin);
            console.log(response.data);
            if(response.data.rol=='Cliente'){
              localStorage.setItem('profile', response.data.rutaCarpetaImagenes)
              localStorage.setItem('id', response.data.id)
              navegar('/pediloYa');
            } else if(response.data.rol=='admin'){
              localStorage.setItem('profile', response.data.rutaCarpetaImagenes)
              localStorage.setItem('id', response.data.id)
              navegar('/admin');
            }
           
        } catch (error) {
            Swal.fire({
                title: error.response.data.message,
                showConfirmButton: true
            });
        }
    }
   
};

  // Función para manejar cambios en los input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataLogin({
      ...dataLogin,
      [name]: value,
    });
  };

  return (
    <>
      <section id='bk'>
        <div id='div-login'>
          <div id='form-login'>
            <h3 className='text-center fw-bold mt-4'>Iniciar Sesion</h3>
            <p className='mt-5 mb-3 f'>Ingresa tus datos:</p>
            <div className='form-control mt-3'>
              <div className='div-input mb-3'>
                <input className='input-login' type="email" placeholder='Correo Electronico' name="correoElectronico" value={dataLogin.correoElectronico} onChange={handleInputChange} required/>
              </div>
              <div className='div-input mb-3'>
                <input
                  className='input-login'
                  type="password"
                  placeholder='Contraseña'
                  name="contrasenia"
                  value={dataLogin.contrasenia}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='w-100 mt-5'>
              <button className='btn btn-danger w-100' onClick={inicio} type='button'>Acceder</button>
            </div>
            <p id='enlace' onClick={singIn} className='text-center mt-4'>Registrarme</p>
          </div>
        </div>
      </section>
    </>
  );
};
