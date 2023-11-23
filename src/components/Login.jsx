import React from 'react'
import './css/Login.css'
import { useNavigate } from 'react-router-dom';

export const Login= () => {

const navegar = useNavigate();

  const singIn = ()=>{
    navegar('/signIn');
  }
  const inicio = () =>{
    navegar('/pediloYa')
  }
  return (
   <>
    <section id='bk'>
        <div id='div-login'>
            <div id='form-login'>
                <h3 className='text-center fw-bold mt-4'>Iniciar Sesion</h3>
                <p className='mt-5 mb-3 f'>Ingresa tus datos:</p>
                <div className='form-control mt-3'>
                    <div className='div-input mb-3'>
                        <input className='input-login' type="email" placeholder='Correo Electronico' />
                    </div>
                    <div className='div-input mb-3'>
                        <input className='input-login' type="password" placeholder='Contraseña'/>
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
  )
}
