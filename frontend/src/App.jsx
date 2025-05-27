
import { useEffect } from 'react'

import './index.css'
import Home from './components/Home'
import Navbar from './components/Navbar'
import { useDispatch } from 'react-redux'
import { getPosts } from './actions/post'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Auth from './components/Auth'
import { useState } from 'react'
import Chat from './components/Chat'
import { fetchUsers } from './actions/message'
function App() {
const dispatch = useDispatch()

useEffect(() => {
  dispatch(getPosts())
  dispatch(fetchUsers())
}, [dispatch])
const user=JSON.parse(localStorage.getItem("profile"));
const [showForm, setShowForm] = useState(false);
  return (
    <BrowserRouter>
    <div>
     <Navbar setShowForm={setShowForm} />
     <div style={{ minHeight: '100vh',width:"100%"}} className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 '>
     <Routes>
      <Route path="/" element={<Home showForm={showForm} setShowForm={setShowForm} />}/>
       <Route path="/auth"  element={user?<Home showForm={showForm} setShowForm={setShowForm} />:<Auth/>} />
       <Route path="/search" element={<Home showForm={showForm} setShowForm={setShowForm} />} />
       <Route path='/chat' element={<Chat />} />
     </Routes>
     </div>
    </div>
    </BrowserRouter>
  )
}

export default App
