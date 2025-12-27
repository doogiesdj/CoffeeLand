import { Database, Users, Coffee } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/EntityPage.css';

const Brokers = () => {
  const { data, loading, error } = useRDFData();
  
  if (loading) return <div className="loading">Loading brokers...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  const brokers = data?.brokers || [];

  return (
    <div className="entity-page">
      <div className="page-header">
        <Database className="page-icon" />
        <div>
          <h1>Coffee Brokers</h1>
          <p className="page-description">
            Intermediaries connecting producers with retailers in the coffee supply chain
          </p>
        </div>
      </div>

      <div className="entity-grid">
        {brokers.map((broker, index) => (
          <div key={index} className="entity-card broker-card">
            <div className="card-header">
              <Database className="card-icon" />
              <h3>{broker.name}</h3>
            </div>
            
            {broker.mediates && broker.mediates.length > 0 && (
              <div className="card-section">
                <h4><Coffee size={16} /> Mediates</h4>
                <div className="tag-list">
                  {broker.mediates.map((brand, i) => (
                    <span key={i} className="tag brand-tag">{brand.name}</span>
                  ))}
                </div>
              </div>
            )}
            
            {broker.suppliesTo && broker.suppliesTo.length > 0 && (
              <div className="card-section">
                <h4><Users size={16} /> Supplies To</h4>
                <div className="tag-list">
                  {broker.suppliesTo.map((chain, i) => (
                    <span key={i} className="tag chain-tag">{chain.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {brokers.length === 0 && (
        <div className="empty-state">
          <Database size={48} />
          <p>No brokers found in the ontology</p>
        </div>
      )}
    </div>
  );
};

export default Brokers;
