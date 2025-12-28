import { NavLink } from 'react-router-dom';
import { Coffee, MapPin, ShoppingBag, Store, Users, BarChart3, Info } from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>
          <Coffee className="logo-icon" />
          CoffeeLand
        </h2>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Dashboard</div>
          <NavLink to="/" className="nav-item" end>
            <BarChart3 className="nav-icon" />
            <span>Overview</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Data</div>
          <NavLink to="/countries" className="nav-item">
            <MapPin className="nav-icon" />
            <span>Countries</span>
          </NavLink>
          <NavLink to="/brands" className="nav-item">
            <Coffee className="nav-icon" />
            <span>Coffee Brands</span>
          </NavLink>
          <NavLink to="/chains" className="nav-item">
            <Store className="nav-icon" />
            <span>Coffee Chains</span>
          </NavLink>
          <NavLink to="/brokers" className="nav-item">
            <Users className="nav-icon" />
            <span>Brokers</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Visualization</div>
          <NavLink to="/ontology" className="nav-item">
            <ShoppingBag className="nav-icon" />
            <span>Ontology Diagram</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <NavLink to="/about" className="nav-item">
            <Info className="nav-icon" />
            <span>About</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
