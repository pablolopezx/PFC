import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './screens/Home';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import NotFound from './screens/NotFound';
import Squads from './screens/Squads';
import { AuthProvider } from './components/AuthContext';
import Simulator from './screens/Simulator';
import UserPage from './components/UserPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Ruta para la página de inicio */}
            <Route path='/squads' element={<Squads />}/>
            <Route path='/simulator' element={<Simulator />}/>
            <Route path='/perfil' element={<UserPage />}/>
            {/* Ruta para URLs no encontradas */}
            <Route path="*" element={<NotFound />} /> {/* Ruta para cualquier URL que no coincida con las rutas anteriores */}
          </Routes>
        </div>
        <Footer />
      </AuthProvider>  
    </Router>
  );
}

export default App;
