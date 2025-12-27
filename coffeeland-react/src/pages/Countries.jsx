import { useState } from 'react';
import { MapPin, Coffee as CoffeeIcon, X } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/EntityPage.css';

const Countries = () => {
  const { data, loading, error } = useRDFData();
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  if (loading) return <div className="loading">Loading countries...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  const countries = data?.countries || [];
  const allBrands = data?.brands || [];

  // Find full brand details
  const getBrandDetails = (brandName) => {
    return allBrands.find(brand => brand.name === brandName);
  };

  const handleBrandClick = (brandName) => {
    const brandDetails = getBrandDetails(brandName);
    setSelectedBrand(brandDetails);
  };

  const closeModal = () => {
    setSelectedBrand(null);
  };

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
                    <span 
                      key={i} 
                      className="tag tag-clickable"
                      onClick={() => handleBrandClick(brand.name)}
                      title="Click for details"
                    >
                      {brand.name}
                    </span>
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

      {/* Brand Details Modal */}
      {selectedBrand && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            
            <div className="modal-header">
              <CoffeeIcon className="modal-icon" />
              <h2>{selectedBrand.name}</h2>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Brand Information</h3>
                <p className="brand-description">
                  <strong>{selectedBrand.name}</strong> is a premium coffee brand known for its 
                  distinctive flavor profile and quality. This brand represents the rich coffee 
                  heritage and expertise of its region.
                </p>
              </div>

              {selectedBrand.hasOriginIn && (
                <div className="modal-section">
                  <h3>Origin</h3>
                  <div className="info-row">
                    <span className="info-label">Origin City:</span>
                    <span className="info-value">
                      {selectedBrand.hasOriginIn.map(city => city.name).join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {selectedBrand.isConsumedIn && (
                <div className="modal-section">
                  <h3>Markets</h3>
                  <div className="info-row">
                    <span className="info-label">Consumed In:</span>
                    <span className="info-value">
                      {selectedBrand.isConsumedIn.map(country => country.name).join(', ')}
                    </span>
                  </div>
                </div>
              )}

              <div className="modal-section">
                <h3>Characteristics</h3>
                <ul className="characteristics-list">
                  <li>
                    <strong>Type:</strong> Premium Arabica Coffee
                  </li>
                  <li>
                    <strong>Processing:</strong> Washed and sun-dried
                  </li>
                  <li>
                    <strong>Flavor Notes:</strong> Fruity, floral, and chocolate undertones
                  </li>
                  <li>
                    <strong>Altitude:</strong> High-altitude grown (1200-2000m)
                  </li>
                </ul>
              </div>

              <div className="modal-section">
                <h3>About This Brand</h3>
                <p>
                  This coffee brand is part of a rich tradition of coffee cultivation 
                  and processing. Each cup represents generations of expertise in growing, 
                  harvesting, and roasting coffee beans to perfection. The unique terroir 
                  and climate of its origin region contribute to its distinctive taste profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Countries;
