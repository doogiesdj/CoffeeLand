import { Menu } from 'lucide-react';
import '../styles/Header.css';

const Header = ({ toggleSidebar, title }) => {
  return (
    <header className="header">
      <button className="menu-button" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      <h1 className="header-title">{title || 'CoffeeLand Ontology'}</h1>
      <div className="header-actions">
        <span className="domain-badge">tonicloud.org</span>
      </div>
    </header>
  );
};

export default Header;
