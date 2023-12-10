import { useState } from 'react';
const Swal = window.Swal;
import { useNavigate } from 'react-router-dom';
import { RestaurantesAdmin } from './RestaurantesAdmin';
import { Repartidores } from './Repartidores';
import '../components/css/adminArea.css';
import Logo from '/public/icono-pedidosYA!.jpg';
import IconRestaurante from './img/icono-restaurante.png';
import IconRepartidor from './img/icono-repartidor.png';
import IconLista from './img/icono-listas.png';
import IconPedidos from './img/icono-pedidos.png';
import IconLogOut from './img/icono-cerrar-sesion.png';
import { Pedidos } from './Pedidos';

export const Admin = () => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('restaurantes');
  const navegar = useNavigate();

  const cerrarSesion = () => {
    Swal.fire({
      title: 'Desea Cerrar sesion?',
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navegar('/');
      }
    });
  };

  const renderComponente = () => {
    switch (opcionSeleccionada) {
      case 'restaurantes':
        return <RestaurantesAdmin />;
      case 'repartidores':
        return <Repartidores />;
      case 'pedidos':
        return <Pedidos />;
      default:
        return null;
    }
  };

  return (
    <>
      <section className='d-flex'>
        <div id='barra-Opciones'>
          <div id='info'>
            <div className='w-100 h-100 d-flex flex-column justify-content-center align-items-center'>
              <img src={Logo} alt="" />
              <p>Admin</p>
            </div>
          </div>
          <div id='div-opciones-admin'>
            <div onClick={() => setOpcionSeleccionada('restaurantes')} className='opciones-admin'>
              <span>RESTAURANTES</span>
              <img src={IconRestaurante} alt="" />
            </div>
            <div onClick={() => setOpcionSeleccionada('repartidores')} className='opciones-admin'>
              <span>REPARTIDORES</span>
              <img src={IconRepartidor} alt="" />
            </div>
            <div onClick={() => setOpcionSeleccionada('pedidos')} className='opciones-admin'>
              <span>PEDIDOS</span>
              <img src={IconPedidos} alt="" />
            </div>
            <div onClick={() => setOpcionSeleccionada('historial')} className='opciones-admin'>
              <span>HISTORIAL</span>
              <img src={IconLista} alt="" />
            </div>
            <div onClick={cerrarSesion} id='cerrarSesion' className='opciones-admin'>
              <span>CERRAR SESION</span>
              <img src={IconLogOut} alt="" />
            </div>
          </div>
        </div>
        <div id='renderOpciones'>
          {renderComponente()}
        </div>
      </section>
    </>
  );
};
