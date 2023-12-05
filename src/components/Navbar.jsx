import './css/Navbar.css';
import axios from 'axios';
import Logo from '/public/icono-pedidosYA!.jpg';
import { useNavigate } from 'react-router-dom';


export const Navbar =() => {
  const navegar = useNavigate();
  let profile  = localStorage.getItem('profile');
  const cerrarSesion = () => {
    navegar('/');
  };
  const cambiarProfile = () => {
    // Obtener el input file
    const inputFile = document.getElementById('inputFile');

    // Crear un objeto FormData para enviar la imagen
    const formData = new FormData();
    formData.append('imagen', inputFile.files[0]);

    // Realizar la solicitud POST al servidor con Axios
    axios.post(`http://localhost:8080/api/v1/usuarios/${localStorage.getItem('id')}/cargar-imagen`, formData)
      .then(response => {
        console.log('Imagen cargada exitosamente', response.data);
        profile = response.data;
      })
      .catch(error => {
        console.error('Error al cargar la imagen', error);
        // Manejar el error según tus necesidades
      });
  };
  return (
  <>
<nav className="navbar navbar-expand-lg bg-body-tertiary p-0">
  <div className="container-fluid">
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
          <img className='profile' src={`http://localhost:8080/uploads/profile/${profile}`} alt="" />
        </p>
        <ul className="dropdown-menu">
        <input type="file" id="inputFile" accept="image/*" />
          <button onClick={cambiarProfile}>Cambiar Profile</button>
          <li><p className="dropdown-item" onClick={cerrarSesion} >Cerrar Sesion</p></li>
        </ul>
      </div>
    </div>
  </div>
</nav>

  </>
  )
}
