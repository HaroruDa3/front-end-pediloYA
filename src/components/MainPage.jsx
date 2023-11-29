import React from 'react';
import {Navbar} from './Navbar';
import '../components/css/Mainpage.css'
import IconMeals from './img/icono-comida.png'
import IconRestaurante from './img/icono-restaurante.png'
import IconRepartidor from './img/icono-repartidor.png'
import IconLista from './img/icono-listas.png'
import { ListaProductos } from './ListaProductos';

export const MainPage = () => {
  return (
    <>
    <Navbar/>
    <section className='w-100 h-100'>
        <div id='div-opciones'>
            <div id='op1' className='opciones'>
                <span>RESTAURANTES</span>
                <img src={IconRestaurante} alt="" />
            </div>
            <div id='op2' className='opciones'>
                <span>COMIDAS</span>
                <img src={IconMeals} alt="" />
            </div>
            <div id='op3' className='opciones'>
                <span>PEDIDOS</span>
                <img src={IconRepartidor} alt="" />
            </div>
            <div id='op4' className='opciones'>
                <span>HISTORIAL</span>
                <img src={IconLista} alt="" />
            </div>
        </div>
    </section>
    <section className='mt-5'>
        <ListaProductos/>
    </section>
    </>
  )
}
