import React from 'react'
import './css/Navbar.css'
import Logo from '/public/icono-pedidosYA!.jpg'


export const Navbar =() => {
  return (
   <>
   <nav class="navbar navbar-expand-lg bg-body-tertiary p-0">
  <div class="container-fluid">
    <div className='d-flex' >
      <img src={Logo} alt="" />
      <div id='info-entrega'>
        <span>Enviar a: </span>
        <span>Col. Trapiche, Una cuadra adelante de Coperativa Sagrada Familia</span>
      </div>
    </div>
    <div id='opciones-navbar'>
      <div className='div-op-nav'>
        <p>Inicio</p>
      </div>
      <div  className="nav-item dropdown">
        <p className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Usuario
        </p>
        <ul className="dropdown-menu">
            <li><p className="dropdown-item" >Opciones</p></li>
            <li><p className="dropdown-item" >Cerrar Sesion</p></li>
        </ul>
      </div>
    </div>
  </div>
</nav>

   </>
  )
}
