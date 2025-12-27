import { Users, MapPin } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/EntityPage.css';

const Chains = () => {
  const { data, loading, error } = useRDFData();
  
  if (loading) return <div className="loading">Loading chains...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  const chains = data?.chains || [];

  return (
    <div className="entity-page">
      <div className="page-header">
        <Users className="page-icon" />
        <div>
          <h1>Coffee Chains</h1>
          <p className="page-description">
            Major coffee retail chains and their global presence
          </p>
        </div>
      </div>

      <div className="entity-grid">
        {chains.map((chain, index) => (
          <div key={index} className="entity-card chain-card">
            <div className="card-header">
              <Users className="card-icon" />
              <h3>{chain.name}</h3>
            </div>
            
            {chain.operatesIn && chain.operatesIn.length > 0 && (
              <div className="card-section">
                <h4><MapPin size={16} /> Operates In</h4>
                <div className="tag-list">
                  {chain.operatesIn.map((city, i) => (
                    <span key={i} className="tag location-tag">{city.name}</span>
                  ))}
                </div>
              </div>
            )}
            
            {chain.buysFrom && chain.buysFrom.length > 0 && (
              <div className="card-section">
                <h4>Buys From</h4>
                <div className="tag-list">
                  {chain.buysFrom.map((broker, i) => (
                    <span key={i} className="tag">{broker.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {chains.length === 0 && (
        <div className="empty-state">
          <Users size={48} />
          <p>No coffee chains found in the ontology</p>
        </div>
      )}
    </div>
  );
};

export default Chains;
