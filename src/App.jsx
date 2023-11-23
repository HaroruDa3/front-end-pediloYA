import { React } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {Login} from './components/Login'
import {SignIn} from './components/SignIn'

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Login/> } />
          <Route path='/signIn' element={ <SignIn/> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}
