import React from 'react'
import carIcon from './img/car-wb.png'
import './css/ListaProductos.css'
export const ListaProductos = () => {
  return (
   <>
   <div className='container'>
    <h4 className='fw-bold text-center'>PRODUCTOS</h4>
        <div className='row'>
            <div className='col-xl-3 col-lg-3 col-sm-4 mb-3'>
                <div className="card">
                    <img src="..." className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <h5 className="card-title text-center">Card title</h5>
                        <p className="card-text" name='descripcion'>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <p name='precio' className='fw-bold'>Precio: 150lps</p>
                        <div className='w-100 d-flex h-5 mb-3'>
                            <div className='w-25 p-1'>
                                <button type="button" className='btn btn-danger w-100 h-100 d-flex justify-content-center'>
                                    <i class=" fas fa-plus"></i>
                                </button>
                            </div>
                            <div className='w-50 p-1'>
                                <input className='w-100 h-100 form-control text-center' type="number" />
                            </div>
                            <div className='w-25 p-1'>
                                <button type="button" className='btn btn-danger w-100 h-100 d-flex justify-content-center'>
                                    <i class="fas fa-minus"></i>
                                </button>
                            </div>
                        </div>
                        <div className='w-100 d-flex justify-content-center'>
                            <button type="button" className='btn btn-success'>Agregar al carrito</button>
                        </div>
                    </div>
                </div>    
            </div>

           
        </div>
    </div>
   </>
  )
}
