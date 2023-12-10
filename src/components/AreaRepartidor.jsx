import { useState, useEffect } from "react";
import axios from "axios"
import { Navbar } from "./Navbar"
import '../components/css/areaInfo.css';

export const AreaRepartidor = () => {
const [pedidosAsignados, setPedidos]=useState({})

const idCliente = parseInt(localStorage.getItem('id'));

  useEffect(() => {
    const pedidosTodos = async () => {
      try {
        const url = "http://localhost:8080/api/v1/pedidos";
        const response = await axios.get(url);
        let pedidosCliente = response.data.filter(
          (pedido) => pedido.cliente_id === idCliente
        );
        setPedidos(pedidosCliente);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      }
    };

    pedidosTodos();
  }, []);

const getPedidos = async () =>{
    const url=`http://localhost:8080/api/v1/pedidos-asignados`
    const response = await axios.get(url);
    let data=response.data.find(pedido=>pedido.repartidor_id==localStorage.getItem('id'))
    let producto=
    setPedidos(data)
}

useEffect(()=>{
    getPedidos();
},[])

  return (
    <>
    <Navbar></Navbar>
    <section className="mt-5 w-100 d-flex flex-row"> 
        <div className="w-50">
            <h4 className="mb-5 text-center">Pedidos pendientes de entrega</h4>
            <div className="w-100 d-flex justify-content-center">
                <div className="w-75">
                    dsdfsfds
                </div>
            </div>
        </div>
        <div className="w-50">
           <h4 className="mb-5 text-center"> Pedidos Entregados</h4>
           <div className="w-100 d-flex justify-content-center">
           {pedidosAsignados.map((pedido) => (
              <div className="cuerpo-card d-flex flex-column w-75" key={pedido.pedido_id}>
                <h5 className="mb-1">Pedido no. {pedido.pedido_id}</h5>
                <p className="mb-4">Detalle de pedido: {pedido.detalle}</p>
                <p className="mb-4">Nombre repartidor: {pedido.repartidor}</p>
                <p>Total: {pedido.total}lps</p>
              </div>
            ))}
            </div>
        </div>
    </section>
    </>
  )
}
