import React from 'react';
import './css/SignIn.css';
import { useNavigate } from 'react-router-dom';

export const SignIn = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/');
  };

  return (
    <>
      <section id='bk'>
        <div id='div-login'>
          <div id='form-signup'>
            <h3 className='text-center fw-bold mt-4'>Registrarme</h3>
            <p className='mt-5 mb-3 f'>Ingresa tus datos:</p>
            <form>
              <div className='mb-3'>
                <label htmlFor='nombre' className='form-label'>Nombre</label>
                <input type='text' className='form-control' id='nombre' required />
              </div>
              <div className='mb-3'>
                <label htmlFor='correo' className='form-label'>Correo Electrónico</label>
                <input type='email' className='form-control' id='correo' required />
              </div>
              <div className='mb-3'>
                <label htmlFor='rol' className='form-label'>Rol</label>
                <select className='form-select' id='rol' required>
                  <option value='' disabled defaultValue>Seleccione un Rol</option>
                  <option value='cliente'>Cliente</option>
                  <option value='repartidor'>Repartidor</option>
                  <option value='restaurante'>Restaurante</option>
                  <option value='administrador'>Administrador</option>
                </select>
              </div>
              <div className='mb-3'>
                <label htmlFor='contrasena' className='form-label'>Contraseña</label>
                <input type='password' className='form-control' id='contrasena' required />
              </div>
              <div className='mb-3'>
                <label htmlFor='departamento' className='form-label'>Departamento</label>
                <input type='text' className='form-control' id='departamento' />
              </div>
              <div className='mb-3'>
                <label htmlFor='ciudad' className='form-label'>Ciudad</label>
                <input type='text' className='form-control' id='ciudad' />
              </div>
              <div className='mb-3'>
                <label htmlFor='colonia' className='form-label'>Colonia</label>
                <input type='text' className='form-control' id='colonia' />
              </div>
              <div className='mb-3'>
                <label htmlFor='referencia' className='form-label'>Referencia</label>
                <input type='text' className='form-control' id='referencia' />
              </div>
              <button type='button' className='btn btn-danger w-100' onClick={handleSignUp}>Registrarme</button>
            </form>
            <p id='enlace' onClick={() => navigate('/')} className='text-center mt-4'>Iniciar Sesión</p>
          </div>
        </div>
      </section>
    </>
  );
};
