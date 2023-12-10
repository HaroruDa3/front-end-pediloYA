import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {Login} from './components/Login'
import {SignIn} from './components/SignIn'
import { MainPage } from './components/MainPage'
import { Admin } from './components/Admin'
import { AreaRepartidor } from './components/AreaRepartidor'

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Login/> } />
          <Route path='/signIn' element={ <SignIn/> } />
          <Route path='/pediloYa' element={ <MainPage/> } />
          <Route path='/repartidor' element={ <AreaRepartidor/> } />
          <Route path='/admin/*' element={ <Admin/> } />
          
        </Routes>
      </BrowserRouter>
    </>
  )
}
