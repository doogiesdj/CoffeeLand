import { Coffee, MapPin } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/EntityPage.css';

const Brands = () => {
  const { data, loading, error } = useRDFData();
  
  if (loading) return <div className="loading">Loading brands...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  const brands = data?.brands || [];

  return (
    <div className="entity-page">
      <div className="page-header">
        <Coffee className="page-icon" />
        <div>
          <h1>Coffee Brands</h1>
          <p className="page-description">
            Discover premium coffee brands from around the world
          </p>
        </div>
      </div>

      <div className="entity-grid">
        {brands.map((brand, index) => (
          <div key={index} className="entity-card brand-card">
            <div className="card-header">
              <Coffee className="card-icon" />
              <h3>{brand.name}</h3>
            </div>
            
            {brand.hasOriginIn && brand.hasOriginIn.length > 0 && (
              <div className="card-section">
                <h4><MapPin size={16} /> Origin</h4>
                <div className="tag-list">
                  {brand.hasOriginIn.map((origin, i) => (
                    <span key={i} className="tag origin-tag">{origin.name}</span>
                  ))}
                </div>
              </div>
            )}
            
            {brand.isConsumedIn && brand.isConsumedIn.length > 0 && (
              <div className="card-section">
                <h4>Consumed In</h4>
                <div className="tag-list">
                  {brand.isConsumedIn.map((country, i) => (
                    <span key={i} className="tag">{country.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="empty-state">
          <Coffee size={48} />
          <p>No coffee brands found in the ontology</p>
        </div>
      )}
    </div>
  );
};

export default Brands;
