import { Coffee, Database, Github, Globe } from 'lucide-react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-header">
        <Coffee className="about-icon" />
        <h1>About CoffeeLand</h1>
      </div>

      <section className="about-section">
        <h2>Project Overview</h2>
        <p>
          CoffeeLand is an interactive web application that visualizes a comprehensive 
          ontology of the global coffee supply chain. Built using semantic web technologies, 
          it demonstrates the power of RDF (Resource Description Framework) and OWL 
          (Web Ontology Language) in representing complex, interconnected data.
        </p>
      </section>

      <section className="about-section">
        <h2><Database size={24} /> Technology Stack</h2>
        <div className="tech-grid">
          <div className="tech-card">
            <h3>Frontend</h3>
            <ul>
              <li>React 18</li>
              <li>Vite</li>
              <li>D3.js for visualization</li>
              <li>React Router</li>
            </ul>
          </div>
          <div className="tech-card">
            <h3>Semantic Web</h3>
            <ul>
              <li>RDF/XML format</li>
              <li>OWL ontology</li>
              <li>RDFLib for parsing</li>
              <li>Protégé editor</li>
            </ul>
          </div>
          <div className="tech-card">
            <h3>Hosting</h3>
            <ul>
              <li>AWS Amplify</li>
              <li>GitHub integration</li>
              <li>Custom domain (tonicloud.org)</li>
              <li>CI/CD pipeline</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Ontology Structure</h2>
        <p>The CoffeeLand ontology defines the following main classes:</p>
        <div className="ontology-list">
          <div className="ontology-item">
            <strong>Location</strong>
            <p>Includes countries, cities, and capitals involved in coffee production and distribution</p>
          </div>
          <div className="ontology-item">
            <strong>Product</strong>
            <p>Encompasses coffee beans and coffee brands from various origins</p>
          </div>
          <div className="ontology-item">
            <strong>Organization</strong>
            <p>Represents coffee chains, brokers, and other entities in the supply chain</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Key Relationships</h2>
        <ul className="relationship-list">
          <li><strong>produces</strong> - Countries produce specific coffee brands</li>
          <li><strong>isLocatedIn</strong> - Cities are located in countries</li>
          <li><strong>operatesIn</strong> - Coffee chains operate in specific cities</li>
          <li><strong>mediates</strong> - Brokers mediate between producers and retailers</li>
          <li><strong>suppliesTo</strong> - Brokers supply to coffee chains</li>
          <li><strong>buysFrom</strong> - Coffee chains buy from brokers</li>
        </ul>
      </section>

      <section className="about-section">
        <h2><Globe size={24} /> Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Interactive Navigation</h3>
            <p>Sidebar layout for easy exploration of different entity types</p>
          </div>
          <div className="feature-card">
            <h3>Network Visualization</h3>
            <p>D3.js-powered force-directed graph showing relationships</p>
          </div>
          <div className="feature-card">
            <h3>Semantic Queries</h3>
            <p>Real-time RDF parsing and relationship extraction</p>
          </div>
          <div className="feature-card">
            <h3>Responsive Design</h3>
            <p>Mobile-friendly interface with collapsible sidebar</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Domain</h2>
        <p className="domain-info">
          This application is hosted on <strong>tonicloud.org</strong>, 
          powered by AWS Amplify with continuous deployment from GitHub.
        </p>
      </section>

      <footer className="about-footer">
        <p>&copy; 2024 CoffeeLand Ontology Project</p>
        <p>Built with semantic web technologies</p>
      </footer>
    </div>
  );
};

export default About;
