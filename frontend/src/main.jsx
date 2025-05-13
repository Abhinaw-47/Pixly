import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux'
import {configureStore} from '@reduxjs/toolkit'
import './index.css'
import App from './App.jsx'
import rootReducers from './reducers'
const store =configureStore({
  reducer:rootReducers
})


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <StrictMode>
    <App />
  </StrictMode>
  </Provider>
)
