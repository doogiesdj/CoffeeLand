import { Home, Database, MapPin, Coffee, Users, BarChart3, Info, Network } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Home', description: 'Overview' },
    { path: '/countries', icon: MapPin, label: 'Countries', description: 'Coffee producing nations' },
    { path: '/brands', icon: Coffee, label: 'Coffee Brands', description: 'Premium coffee selections' },
    { path: '/chains', icon: Users, label: 'Coffee Chains', description: 'Major retailers' },
    { path: '/brokers', icon: Database, label: 'Brokers', description: 'Supply chain intermediaries' },
    { path: '/ontology', icon: Network, label: 'Ontology', description: 'Class diagram (VOWL)' },
    { path: '/visualization', icon: BarChart3, label: 'Network Graph', description: 'Instance relationships' },
    { path: '/about', icon: Info, label: 'About', description: 'About CoffeeLand' }
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <Coffee className="logo-icon" />
            <h2>CoffeeLand</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
              >
                <Icon className="nav-icon" />
                <div className="nav-content">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p>&copy; 2024 CoffeeLand</p>
          <p className="small-text">Powered by RDF Ontology</p>
        </div>
      </div>
      
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
