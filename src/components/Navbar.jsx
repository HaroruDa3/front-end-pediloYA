import './css/Navbar.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '/public/icono-pedidosYA!.jpg';
import OptionIcon from '/public/option-icon.png'; 
import { useNavigate } from 'react-router-dom';
const Swal = window.Swal;

export const Navbar = () => {
  const [ubicacion, setUbicaion] = useState('');
  const [nameUsuario, setnameUsuario] = useState('');

  useEffect(() => {
    const infoUsuario = async () => {
      try {
        const url = `http://localhost:8080/api/v1/usuarios/${parseInt(localStorage.getItem('id'))}`;
        const response = await axios.get(url);
        
        setUbicaion(response.data.direccion || '');
        setnameUsuario(response.data.nombre_Completo ||'') 
        localStorage.setItem('nombre_usr',nameUsuario)
      } catch (error) {
        console.error('Error al obtener información del usuario:', error);
      }
    };

    infoUsuario();
  }, []);

  const navegar = useNavigate();
  let profile = localStorage.getItem('profile');

  const cerrarSesion = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('carrito');
    navegar('/');
    window.location.reload();
  };

  const cambiarProfile = () => {
    const inputFile = document.getElementById('inputFile');

    const formData = new FormData();
    formData.append('imagen', inputFile.files[0]);

    axios.post(`http://localhost:8080/api/v1/usuarios/${localStorage.getItem('id')}/cargar-imagen`, formData)
      .then(response => {
        Swal.fire({
          title: "Actualizacion exitosa",
          icon: "success"
        });
        profile = response.data;
        window.location.reload()
      })
      .catch(error => {
        console.error('Error al cargar la imagen', error);
      });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary p-0">
        <div className="container-fluid">
          <div className='d-flex' >
            <img src={Logo} alt="" />
            <div id='info-entrega'>
              <span>Dirección: </span>
              <span>{ubicacion}</span>
            </div>
          </div>
          <div id='opciones-navbar'>
            <div>
              <p>{nameUsuario}</p>
            </div>
            <div className='h-75'>
              <img className='h-75' src={OptionIcon} alt="" data-bs-toggle="modal" data-bs-target="#staticBackdrop"/>
            </div>
          </div>
        </div>
      </nav>


      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel">Opciones</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <h5 className='text-center fw-bold mb-3'>{nameUsuario}</h5>
        <div className='img-div'>
            <div>
              <img className='img-modal' src={`http://localhost:8080/uploads/profile/${profile}`} alt="" />
            </div>
        </div>
        <label className='mx-2 mb-1'>Cambiar Imagen de perfil</label>
        <input className='form-control mb-2' type="file" id="inputFile" accept="image/*" />
        <div className='w-100 d-flex justify-content-center mb-5'>
          <button className='btn btn-success' onClick={cambiarProfile}>Cambiar imagen de perfil</button>
        </div>
        <div className='w-100 d-flex justify-content-center'>
            <button className='btn btn-danger' onClick={cerrarSesion} type="button">Cerrar Sesion</button>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
    </>
  );
};
