import { useState } from 'react'
import './App.css'
import { IDE } from './components/IDE/IDE'
import { Prob } from './components/ProbPage/Prob'
import { CreateProblem } from './components/CreateProblem/createProblem'
import { Home } from './components/Home/Home'
import {BrowserRouter,Route,Routes} from "react-router-dom";
import SignIn from './components/Auth/SignIn'
import Signup from './components/Auth/SignUp'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element={<Home/>}></Route>
          <Route path = "/create" element={<CreateProblem/>}></Route>
          <Route path = "/problem/:id" element={<Prob/>}></Route>
          <Route path= "/signIn" element={<SignIn/>}></Route>
          <Route path= "/signUp" element={<Signup/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
