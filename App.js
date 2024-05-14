import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './screens/Home';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <Router>
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </AuthProvider>  
    </Router>
  );
}

export default App;
