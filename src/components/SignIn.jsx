import React, { useState, useEffect } from 'react';
import './css/SignIn.css';
import { useNavigate } from 'react-router-dom';
import ArrowBack from '../assets/arrow-back.png';
import axios from 'axios';

export const SignIn = () => {
  const navegar = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    const obtenerDepartamentos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/departamentos');
        setDepartamentos(await response.data);
      } catch (error) {
        console.error('Error al obtener departamentos:', error);
      }
    };

    obtenerDepartamentos();
  }, []);

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
              <input className='input-login' placeholder='Ingresa tu nombre' type="text" name="nombre" id="nombre" required/>
            </div>
            <div className='div-input'>
              <input className='input-login' placeholder='Correo Electronico' type="email" name="email" id="email" required/>
            </div>
            <div className='div-input'>
              <input className='input-login' placeholder='Contraseña' type="password" name="pass" id="pass" required/>
            </div>
            <div className='div-input'>
              <input className='input-login' placeholder='Confirmar Contraseña' type="password" name="passConfirm" id="passConfirm" required/>
            </div>
            <div className='div-input'>
              <select className='input-login w-100' name="rol" id="rol">
                <option value="" selected disabled>Quien eres?</option>
                <option value="Cliente">Cliente</option>
                <option value="Transportista">Transportista</option>
                <option value="Restaurante">Restaurante</option>
              </select>
            </div>
            <div className='div-input'>
              <select className='input-login w-100' name="departamento" id="departamento">
                <option value="" selected disabled>Departamento</option>
                {departamentos.map(departamento => (
                  <option key={departamento.departamento_id} value={departamento.departamento_nombre}>
                    {departamento.departamento_nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className='div-input'>
              <select className='input-login w-100' name="ciudad" id="ciudad">
                <option value="" selected disabled>Ciudad</option>
                <option value="opcion1">Opción 1</option>
                <option value="opcion2">Opción 2</option>
              </select>
            </div>
            <div className='div-input'>
              <textarea className='input-login' name="direccion" id="direccion" cols="30" rows="5" placeholder='Escriba su direccion'></textarea>
            </div>

            <div className='w-100 mt-5'>
              <button onClick={LogIn} className='btn btn-danger w-100' type='button'>Registrarme</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
