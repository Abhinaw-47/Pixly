
import { useEffect } from 'react'
import './App.css'
import Home from './components/Home'
import Navbar from './components/Navbar'
import { useDispatch } from 'react-redux'
import { getPosts } from './actions/post'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Auth from './components/Auth'
import { useState } from 'react'
function App() {
const dispatch = useDispatch()

useEffect(() => {
  dispatch(getPosts())
}, [dispatch])
const user=JSON.parse(localStorage.getItem("profile"));
const [showForm, setShowForm] = useState(false);
  return (
    <BrowserRouter>
    <div>
     <Navbar setShowForm={setShowForm} />
     <div style={{backgroundColor:"#121212", minHeight: '100vh',}}>
     <Routes>
      <Route path="/" element={<Home showForm={showForm} setShowForm={setShowForm} />}/>
       <Route path="/auth"  element={user?<Home showForm={showForm} setShowForm={setShowForm} />:<Auth/>} />
       <Route path="/search" element={<Home showForm={showForm} setShowForm={setShowForm} />} />
     </Routes>
     </div>
    </div>
    </BrowserRouter>
  )
}

export default App
