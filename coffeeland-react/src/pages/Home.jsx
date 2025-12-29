import { useState } from 'react';
import { Coffee, MapPin, Store, Users, Search, X, Sprout, Star, Truck, DollarSign, Factory, Warehouse } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/Home.css';

const Home = () => {
  const { data, loading, error } = useRDFData();
  const [selectedProject, setSelectedProject] = useState(null);
  
  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  const stats = [
    {
      title: 'Supply Chain Entities',
      value: (data?.countries?.length || 0) + (data?.farms?.length || 0) + (data?.farmers?.length || 0) + (data?.cooperatives?.length || 0),
      icon: Sprout,
      gradient: 'primary'
    },
    {
      title: 'Organizations',
      value: (data?.chains?.length || 0) + (data?.roasters?.length || 0) + (data?.brokers?.length || 0) + (data?.retailers?.length || 0) + (data?.processingMills?.length || 0),
      icon: Store,
      gradient: 'secondary'
    },
    {
      title: 'Products',
      value: (data?.brands?.length || 0) + (data?.varieties?.length || 0),
      icon: Coffee,
      gradient: 'success'
    },
    {
      title: 'Quality & Logistics',
      value: (data?.certifications?.length || 0) + (data?.warehouses?.length || 0) + (data?.ports?.length || 0),
      icon: Star,
      gradient: 'warning'
    }
  ];

  const projects = [
    // Core Supply Chain
    {
      name: 'Coffee Producing Countries',
      count: data?.countries?.length || 0,
      icon: MapPin,
      color: 'red',
      data: data?.countries || [],
      type: 'countries',
      category: 'Supply Chain'
    },
    {
      name: 'Farms',
      count: data?.farms?.length || 0,
      icon: Sprout,
      color: 'green',
      data: data?.farms || [],
      type: 'farms',
      category: 'Supply Chain'
    },
    {
      name: 'Farmers',
      count: data?.farmers?.length || 0,
      icon: Users,
      color: 'emerald',
      data: data?.farmers || [],
      type: 'farmers',
      category: 'Supply Chain'
    },
    {
      name: 'Cooperatives',
      count: data?.cooperatives?.length || 0,
      icon: Users,
      color: 'teal',
      data: data?.cooperatives || [],
      type: 'cooperatives',
      category: 'Supply Chain'
    },
    
    // Organizations
    {
      name: 'Global Coffee Chains',
      count: data?.chains?.length || 0,
      icon: Store,
      color: 'blue',
      data: data?.chains || [],
      type: 'chains',
      category: 'Organization'
    },
    {
      name: 'Roasters',
      count: data?.roasters?.length || 0,
      icon: Factory,
      color: 'orange',
      data: data?.roasters || [],
      type: 'roasters',
      category: 'Organization'
    },
    {
      name: 'Supply Chain Brokers',
      count: data?.brokers?.length || 0,
      icon: Users,
      color: 'purple',
      data: data?.brokers || [],
      type: 'brokers',
      category: 'Organization'
    },
    {
      name: 'Retailers',
      count: data?.retailers?.length || 0,
      icon: Store,
      color: 'indigo',
      data: data?.retailers || [],
      type: 'retailers',
      category: 'Organization'
    },
    
    // Products
    {
      name: 'Premium Coffee Brands',
      count: data?.brands?.length || 0,
      icon: Coffee,
      color: 'brown',
      data: data?.brands || [],
      type: 'brands',
      category: 'Product'
    },
    {
      name: 'Coffee Varieties',
      count: data?.varieties?.length || 0,
      icon: Coffee,
      color: 'amber',
      data: data?.varieties || [],
      type: 'varieties',
      category: 'Product'
    },
    
    // Quality & Processing
    {
      name: 'Processing Mills',
      count: data?.processingMills?.length || 0,
      icon: Factory,
      color: 'violet',
      data: data?.processingMills || [],
      type: 'processingMills',
      category: 'Quality & Processing'
    },
    {
      name: 'Certifications',
      count: data?.certifications?.length || 0,
      icon: Star,
      color: 'yellow',
      data: data?.certifications || [],
      type: 'certifications',
      category: 'Quality & Processing'
    },
    
    // Logistics & Distribution
    {
      name: 'Warehouses',
      count: data?.warehouses?.length || 0,
      icon: Warehouse,
      color: 'gray',
      data: data?.warehouses || [],
      type: 'warehouses',
      category: 'Logistics'
    },
    {
      name: 'Ports',
      count: data?.ports?.length || 0,
      icon: Truck,
      color: 'cyan',
      data: data?.ports || [],
      type: 'ports',
      category: 'Logistics'
    },
    
    // Market & Economics
    {
      name: 'Trade Agreements',
      count: data?.tradeAgreements?.length || 0,
      icon: DollarSign,
      color: 'lime',
      data: data?.tradeAgreements || [],
      type: 'tradeAgreements',
      category: 'Market & Economics'
    }
  ];

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <div className="search-box">
            <Search className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="user-badge">
            <div className="user-avatar">AS</div>
            <span>Admin</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`stat-card ${stat.gradient}`}>
              <div className="stat-header">
                <div className="stat-icon">
                  <Icon />
                </div>
                <div className="stat-content">
                  <h3>{stat.title}</h3>
                  <div className="stat-value">{stat.value}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2>Project Overview</h2>
            <button>View All</button>
          </div>
          <div className="project-list">
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <div 
                  key={index} 
                  className="project-item clickable"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className={`project-icon ${project.color}`}>
                    <Icon />
                  </div>
                  <div className="project-info">
                    <h4>{project.name}</h4>
                    <p>Coffee supply chain data</p>
                  </div>
                  <div className="project-count">{project.count}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Task Progress</h2>
          </div>
          <div className="progress-list">
            <div className="progress-item">
              <h4>Data Collection</h4>
              <div className="progress-bar">
                <div className="progress-fill primary" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="progress-item">
              <h4>Ontology Mapping</h4>
              <div className="progress-bar">
                <div className="progress-fill secondary" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className="progress-item">
              <h4>Visualization</h4>
              <div className="progress-bar">
                <div className="progress-fill success" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div className="progress-item">
              <h4>Documentation</h4>
              <div className="progress-bar">
                <div className="progress-fill warning" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <div className={`modal-icon ${selectedProject.color}`}>
                  <selectedProject.icon />
                </div>
                <h2>{selectedProject.name}</h2>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <X />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-stats">
                <div className="modal-stat-item">
                  <span className="modal-stat-label">Total Count</span>
                  <span className="modal-stat-value">{selectedProject.count}</span>
                </div>
              </div>

              <div className="modal-list">
                {selectedProject.type === 'countries' && selectedProject.data.map((item, idx) => (
                  <div key={idx} className="modal-list-item">
                    <div className="modal-list-icon">
                      <MapPin size={16} />
                    </div>
                    <div className="modal-list-content">
                      <h4>{item.name}</h4>
                      {item.produces && item.produces.length > 0 && (
                        <p>Produces: {item.produces.slice(0, 3).map(b => b.name || b).join(', ')}
                        {item.produces.length > 3 && ` +${item.produces.length - 3} more`}</p>
                      )}
                    </div>
                  </div>
                ))}

                {selectedProject.type === 'brands' && selectedProject.data.map((item, idx) => (
                  <div key={idx} className="modal-list-item">
                    <div className="modal-list-icon">
                      <Coffee size={16} />
                    </div>
                    <div className="modal-list-content">
                      <h4>{item.name}</h4>
                      {item.hasOriginIn && item.hasOriginIn.length > 0 && (
                        <p>Origin: {item.hasOriginIn.map(o => o.name || o).join(', ')}</p>
                      )}
                    </div>
                  </div>
                ))}

                {selectedProject.type === 'chains' && selectedProject.data.map((item, idx) => (
                  <div key={idx} className="modal-list-item">
                    <div className="modal-list-icon">
                      <Store size={16} />
                    </div>
                    <div className="modal-list-content">
                      <h4>{item.name}</h4>
                      {item.operatesIn && item.operatesIn.length > 0 && (
                        <p>Operates in: {item.operatesIn.slice(0, 3).map(c => c.name || c).join(', ')}
                        {item.operatesIn.length > 3 && ` +${item.operatesIn.length - 3} more`}</p>
                      )}
                    </div>
                  </div>
                ))}

                {selectedProject.type === 'brokers' && selectedProject.data.map((item, idx) => (
                  <div key={idx} className="modal-list-item">
                    <div className="modal-list-icon">
                      <Users size={16} />
                    </div>
                    <div className="modal-list-content">
                      <h4>{item.name}</h4>
                      {item.isHeadquarteredIn && item.isHeadquarteredIn.length > 0 && (
                        <p>Headquartered in: {item.isHeadquarteredIn.map(h => h.name || h).join(', ')}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Generic rendering for other types */}
                {!['countries', 'brands', 'chains', 'brokers'].includes(selectedProject.type) && selectedProject.data.map((item, idx) => (
                  <div key={idx} className="modal-list-item">
                    <div className="modal-list-icon">
                      <selectedProject.icon size={16} />
                    </div>
                    <div className="modal-list-content">
                      <h4>{item.name}</h4>
                      <p className="modal-item-uri">{item.uri ? item.uri.split('#')[1] : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
