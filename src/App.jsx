

import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Dashboard from './pages/Dashboard'
import CustomerManagement from './pages/CustomerManagement'

function App() {

  return (
    <Routes>
      <Route element={<MainLayout/>} >
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/Pelanggan" element={<CustomerManagement/>}/>
    </Route>
    </Routes>
  )
}

export default App
