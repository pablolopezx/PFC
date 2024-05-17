import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './screens/Home';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import NotFound from './screens/NotFound';
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <Router>
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Ruta para la página de inicio */}

         {/* Ruta para URLs no encontradas */}
         <Route path="*" element={<NotFound />} /> {/* Ruta para cualquier URL que no coincida con las rutas anteriores */}
      </Routes>
      <Footer />
    </AuthProvider>  
    </Router>
  );
}

export default App;
