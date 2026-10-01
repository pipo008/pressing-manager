import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Commandes from './pages/Commandes'
import Clients from './pages/Clients'
import Tarifs from './pages/Tarifs'
import Parametres from './pages/Parametres'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"            element={<Dashboard />} />
          <Route path="/commandes"   element={<Commandes />} />
          <Route path="/clients"     element={<Clients />} />
          <Route path="/tarifs"      element={<Tarifs />} />
          <Route path="/parametres"  element={<Parametres />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}