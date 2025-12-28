import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Countries from './pages/Countries';
import Brands from './pages/Brands';
import Chains from './pages/Chains';
import Brokers from './pages/Brokers';
import OntologyDiagram from './pages/OntologyDiagram';
import About from './pages/About';
import './styles/Layout.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/chains" element={<Chains />} />
            <Route path="/brokers" element={<Brokers />} />
            <Route path="/ontology" element={<OntologyDiagram />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
