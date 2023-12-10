import { useState } from 'react';
import {Navbar} from './Navbar';
import '../components/css/Mainpage.css'
import IconMeals from './img/icono-comida.png'
import IconRestaurante from './img/icono-restaurante.png'
import IconRepartidor from './img/icono-repartidor.png'
import IconLista from './img/icono-listas.png'
import { ListaProductos } from './ListaProductos';
import { Restaurantes } from './Restaurantes';
import { PedidosCliente } from './PedidosCliente';
import { HistorialPedidos } from './HistorialPedidos';

export const MainPage = () => {
    const [opcionSeleccionada, setOpcionSeleccionada] = useState('restaurantes');


    const renderizarComponente = () => {
      switch (opcionSeleccionada) {
        case 'restaurantes':
          return <Restaurantes />;
        case 'comidas':
          return <ListaProductos />;
          case 'pedidos':
            return <PedidosCliente />;
            case 'historial':
            return <HistorialPedidos />;
        default:
          return null;
      }
    };
  return (
    <>
    <Navbar/>
    <section className='w-100 h-100'>
        <div id='div-opciones'>
            <div id='op1' className='opciones' onClick={() => setOpcionSeleccionada('restaurantes')}>
                <span>RESTAURANTES</span>
                <img src={IconRestaurante} alt="" />
            </div>
            <div id='op2' className='opciones' onClick={() => setOpcionSeleccionada('comidas')}>
                <span>COMIDAS</span>
                <img src={IconMeals} alt="" />
            </div>
            <div id='op3' className='opciones' onClick={() => setOpcionSeleccionada('pedidos')}>
                <span>PEDIDOS</span>
                <img src={IconRepartidor} alt="" />
            </div>
            <div id='op4' className='opciones' onClick={() => setOpcionSeleccionada('historial')}>
                <span>HISTORIAL</span>
                <img src={IconLista} alt="" />
            </div>
        </div>
    </section>
    <section className='mt-5'>
    {renderizarComponente()}
    </section>
    </>
  )
}
