
import { useEffect } from 'react'
import './App.css'
import Home from './components/Home'
import Navbar from './components/Navbar'
import { useDispatch } from 'react-redux'
import { getPosts } from './actions/post'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Auth from './components/Auth'
function App() {
const dispatch = useDispatch()

useEffect(() => {
  dispatch(getPosts())
}, [dispatch])

  return (
    <BrowserRouter>
    <div>
     <Navbar />
     <div style={{backgroundColor:"#121212"}}>
     <Routes>
      <Route path="/" element={<Home />}/>
      <Route path='/auth' element={<Auth/>}/>
     </Routes>
     </div>
    </div>
    </BrowserRouter>
  )
}

export default App
