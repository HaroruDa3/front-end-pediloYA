import { useState, useEffect } from "react";
import axios from "axios"
import { Navbar } from "./Navbar"
import '../components/css/areaInfo.css';

export const AreaRepartidor = () => {
  const [pedidosEntregados, setPedidos]=useState({})
const [pedidosAsignados, setPedidosAsig]=useState({})

const idCliente = parseInt(localStorage.getItem('id'));

  useEffect(() => {
    const pedidos = async () => {
      try {
        const url = "http://localhost:8080/api/v1/pedidos_asignados";
        const response = (await axios.get(url)).data;
        const response1 =(await axios.get("http://localhost:8080/api/v1/pedidos-asignados")).data;

        let detallesPedidos=[];
        let pedidosAsignados = response.filter(
          (pedido) => pedido.repartidor_id === idCliente
        );

        const response3=(await axios.get("http://localhost:8080/api/v1/pedidosxproductos")).data
        const datos={
          id_pedido:0,
          detalle:"",
          entregado:false,
          cliente:"",
          direccion:""
        }
        pedidosAsignados.array.forEach(pedido => {
         datos.id_pedido=pedido.pedido_id;
         datos.entregado=pedido.entregado;
          const productos=response3.filter((productos)=>productos.pedido_id == pedido.pedido_id)
          let detalle=pedido.pedido_id
          let data= response1.filter((detalle)=>detalle.pedido_id==pedido.pedido_id);
          data.forEach(pedido=>{
            const direccion= ((axios.get(`http://localhost:8080/api/v1/colonias/${pedido.direccion}`))).data
            datos.cliente=detalle.cliente;
            datos.direccion=direccion.colonia_nombre+", "+direccion.referencia;
            let producto =productos.find((producto)=>producto.producto_id==pedido.producto_id)
            detalle+=producto.cantidad+" "+pedido.producto_nombre+" "
          })
          datos.detalle=detalle
          detallesPedidos.push(data)
        });
        setPedidosAsig(datos)
        console.log(pedidosAsignados);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      }
    };

    pedidos();
  }, []);


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
         
            </div>
        </div>
    </section>
    </>
  )
}
