import { useState } from 'react';
import { Coffee, MapPin, X } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/EntityPage.css';

const Brands = () => {
  const { data, loading, error } = useRDFData();
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  if (loading) return <div className="loading">Loading brands...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  const brands = data?.brands || [];

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
  };

  const closeModal = () => {
    setSelectedBrand(null);
  };

  return (
    <div className="entity-page">
      <div className="page-header">
        <Coffee className="page-icon" />
        <div>
          <h1>Coffee Brands</h1>
          <p className="page-description">
            Discover premium coffee brands from around the world. Click on any brand for details.
          </p>
        </div>
      </div>

      <div className="entity-grid">
        {brands.map((brand, index) => (
          <div 
            key={index} 
            className="entity-card brand-card clickable-card"
            onClick={() => handleBrandClick(brand)}
            title="Click for details"
          >
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

      {/* Brand Details Modal */}
      {selectedBrand && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            
            <div className="modal-header">
              <Coffee className="modal-icon" />
              <h2>{selectedBrand.name}</h2>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Brand Story</h3>
                <p className="brand-description">
                  <strong>{selectedBrand.name}</strong> represents the pinnacle of coffee craftsmanship, 
                  embodying generations of expertise in coffee cultivation and roasting. This exceptional 
                  brand is renowned for its distinctive flavor profile and commitment to quality, making 
                  it a favorite among coffee connoisseurs worldwide.
                </p>
              </div>

              {selectedBrand.hasOriginIn && (
                <div className="modal-section">
                  <h3>Origin & Terroir</h3>
                  <div className="info-row">
                    <span className="info-label">Origin City:</span>
                    <span className="info-value">
                      {selectedBrand.hasOriginIn.map(city => city.name).join(', ')}
                    </span>
                  </div>
                  <p className="brand-description" style={{ marginTop: '1rem' }}>
                    The unique terroir of {selectedBrand.hasOriginIn.map(c => c.name).join(', ')} 
                    provides the perfect conditions for growing exceptional coffee. The combination of 
                    altitude, climate, and soil creates a distinctive flavor that cannot be replicated 
                    elsewhere.
                  </p>
                </div>
              )}

              {selectedBrand.isConsumedIn && (
                <div className="modal-section">
                  <h3>Global Presence</h3>
                  <div className="info-row">
                    <span className="info-label">Markets:</span>
                    <span className="info-value">
                      {selectedBrand.isConsumedIn.map(country => country.name).join(', ')}
                    </span>
                  </div>
                  <p className="brand-description" style={{ marginTop: '1rem' }}>
                    Available in {selectedBrand.isConsumedIn.length} {selectedBrand.isConsumedIn.length === 1 ? 'country' : 'countries'}, 
                    this brand has established a strong global presence while maintaining its commitment 
                    to quality and authenticity.
                  </p>
                </div>
              )}

              <div className="modal-section">
                <h3>Coffee Profile</h3>
                <ul className="characteristics-list">
                  <li>
                    <strong>Bean Type:</strong> 100% Premium Arabica
                  </li>
                  <li>
                    <strong>Roast Level:</strong> Medium to Dark, preserving natural flavors
                  </li>
                  <li>
                    <strong>Flavor Profile:</strong> Complex notes of chocolate, caramel, and subtle fruit
                  </li>
                  <li>
                    <strong>Aroma:</strong> Rich, fragrant with floral undertones
                  </li>
                  <li>
                    <strong>Body:</strong> Full-bodied with smooth, velvety texture
                  </li>
                  <li>
                    <strong>Acidity:</strong> Balanced brightness with pleasant finish
                  </li>
                </ul>
              </div>

              <div className="modal-section">
                <h3>Cultivation & Processing</h3>
                <ul className="characteristics-list">
                  <li>
                    <strong>Growing Altitude:</strong> 1,200-2,000 meters above sea level
                  </li>
                  <li>
                    <strong>Harvest Method:</strong> Hand-picked at peak ripeness
                  </li>
                  <li>
                    <strong>Processing:</strong> Washed process for clean, bright flavor
                  </li>
                  <li>
                    <strong>Drying:</strong> Sun-dried on raised beds for optimal development
                  </li>
                  <li>
                    <strong>Quality Control:</strong> Multiple sorting stages ensure consistency
                  </li>
                </ul>
              </div>

              <div className="modal-section">
                <h3>Brewing Recommendations</h3>
                <p className="brand-description">
                  For the best experience, we recommend brewing this coffee using pour-over, 
                  French press, or espresso methods. Use water at 195-205°F (90-96°C) and 
                  maintain a coffee-to-water ratio of 1:15 to 1:17. The complex flavor profile 
                  shines through when brewed properly, revealing layers of taste that evolve 
                  as the cup cools.
                </p>
              </div>

              <div className="modal-section">
                <h3>Heritage & Tradition</h3>
                <p className="brand-description">
                  Each cup of {selectedBrand.name} tells a story of dedication, craftsmanship, 
                  and respect for coffee tradition. From the careful selection of seeds to the 
                  meticulous roasting process, every step is undertaken with precision and care. 
                  This commitment to excellence has made {selectedBrand.name} a benchmark for 
                  quality in the specialty coffee industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
