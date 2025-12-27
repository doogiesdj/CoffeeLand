import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Layout from './components/Layout';
import Home from './pages/Home';
import Countries from './pages/Countries';
import Brands from './pages/Brands';
import Chains from './pages/Chains';
import Brokers from './pages/Brokers';
import Visualization from './pages/Visualization';
import About from './pages/About';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="app">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Header toggleSidebar={toggleSidebar} />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/chains" element={<Chains />} />
            <Route path="/brokers" element={<Brokers />} />
            <Route path="/visualization" element={<Visualization />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
