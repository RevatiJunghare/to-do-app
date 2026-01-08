import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ToDo from '../pages/Todo'

const AllRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/todo" element={<ToDo/>}/>
    </Routes>
  )
}

export default AllRouter