import { Coffee, MapPin, Store, Users, Search, TrendingUp } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/Home.css';

const Home = () => {
  const { data, loading, error } = useRDFData();
  
  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  const stats = [
    {
      title: 'Total Countries',
      value: data?.countries?.length || 0,
      icon: MapPin,
      gradient: 'primary'
    },
    {
      title: 'Coffee Brands',
      value: data?.brands?.length || 0,
      icon: Coffee,
      gradient: 'secondary'
    },
    {
      title: 'Coffee Chains',
      value: data?.chains?.length || 0,
      icon: Store,
      gradient: 'success'
    },
    {
      title: 'Brokers',
      value: data?.brokers?.length || 0,
      icon: Users,
      gradient: 'warning'
    }
  ];

  const projects = [
    {
      name: 'Coffee Producing Countries',
      count: data?.countries?.length || 0,
      icon: MapPin,
      color: 'red'
    },
    {
      name: 'Premium Coffee Brands',
      count: data?.brands?.length || 0,
      icon: Coffee,
      color: 'blue'
    },
    {
      name: 'Global Coffee Chains',
      count: data?.chains?.length || 0,
      icon: Store,
      color: 'green'
    },
    {
      name: 'Supply Chain Brokers',
      count: data?.brokers?.length || 0,
      icon: Users,
      color: 'orange'
    }
  ];

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
                <div key={index} className="project-item">
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
    </div>
  );
};

export default Home;
