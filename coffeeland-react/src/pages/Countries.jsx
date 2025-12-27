import { MapPin, Coffee as CoffeeIcon } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/EntityPage.css';

const Countries = () => {
  const { data, loading, error } = useRDFData();
  
  if (loading) return <div className="loading">Loading countries...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  const countries = data?.countries || [];

  return (
    <div className="entity-page">
      <div className="page-header">
        <MapPin className="page-icon" />
        <div>
          <h1>Coffee Producing Countries</h1>
          <p className="page-description">
            Explore the major coffee-producing nations and their unique coffee brands
          </p>
        </div>
      </div>

      <div className="entity-grid">
        {countries.map((country, index) => (
          <div key={index} className="entity-card">
            <div className="card-header">
              <MapPin className="card-icon" />
              <h3>{country.name}</h3>
            </div>
            
            {country.produces && country.produces.length > 0 && (
              <div className="card-section">
                <h4><CoffeeIcon size={16} /> Produces</h4>
                <div className="tag-list">
                  {country.produces.map((brand, i) => (
                    <span key={i} className="tag">{brand.name}</span>
                  ))}
                </div>
              </div>
            )}
            
            {country.hasMainCapital && (
              <div className="card-section">
                <h4>Capital</h4>
                <p>{country.hasMainCapital[0]?.name}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {countries.length === 0 && (
        <div className="empty-state">
          <MapPin size={48} />
          <p>No countries found in the ontology</p>
        </div>
      )}
    </div>
  );
};

export default Countries;
