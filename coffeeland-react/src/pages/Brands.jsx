import { useState } from 'react';
import { Coffee, MapPin, X, Globe, TrendingUp, Factory } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/EntityPage.css';

const Brands = () => {
  const { data, loading, error } = useRDFData();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  if (loading) return <div className="loading">Loading brands...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  const brands = data?.brands || [];
  const countries = data?.countries || [];
  const cities = data?.cities || [];
  const allChains = data?.chains || [];
  const allBrokers = data?.brokers || [];

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
  };

  const closeBrandModal = () => {
    setSelectedBrand(null);
  };

  const handleCountryClick = (e, countryName, brandName) => {
    e.stopPropagation(); // Prevent brand modal from opening
    const country = countries.find(c => c.name === countryName);
    setSelectedCountry({ country, brandName });
  };

  const closeCountryModal = () => {
    setSelectedCountry(null);
  };

  // Get country that produces this brand (via city relationship)
  const getProducingCountry = (brand) => {
    if (!brand.hasOriginIn || brand.hasOriginIn.length === 0) return null;
    
    // Get origin city
    const originCityName = brand.hasOriginIn[0].name;
    const originCity = cities.find(city => city.name === originCityName);
    
    if (!originCity || !originCity.isLocatedIn) return null;
    
    // Get country from city
    const countryName = originCity.isLocatedIn[0].name;
    return countries.find(c => c.name === countryName);
  };

  // Get coffee production info for a country
  const getCountryProductionInfo = (countryName) => {
    const country = countries.find(c => c.name === countryName);
    if (!country) return null;

    // Get all cities in this country
    const countryCities = cities.filter(city => 
      city.isLocatedIn && city.isLocatedIn.some(loc => loc.name === countryName)
    );

    // Get all brands from this country
    const countryBrands = brands.filter(brand => {
      const producingCountry = getProducingCountry(brand);
      return producingCountry && producingCountry.name === countryName;
    });

    // Get chains operating in this country
    const cityNames = countryCities.map(c => c.name);
    const countryChains = allChains.filter(chain =>
      chain.operatesIn && chain.operatesIn.some(city => cityNames.includes(city.name))
    );

    // Get brokers headquartered in this country
    const countryBrokers = allBrokers.filter(broker =>
      broker.isHeadquarteredIn && broker.isHeadquarteredIn.some(loc => loc.name === countryName)
    );

    return {
      country,
      cities: countryCities,
      brands: countryBrands,
      chains: countryChains,
      brokers: countryBrokers
    };
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
        {brands.map((brand, index) => {
          const producingCountry = getProducingCountry(brand);
          return (
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
              
              {producingCountry && (
                <div className="card-section">
                  <h4><Globe size={16} /> Producing Country</h4>
                  <div className="tag-list">
                    <span 
                      className="tag tag-country tag-clickable"
                      onClick={(e) => handleCountryClick(e, producingCountry.name, brand.name)}
                      title="Click for country details"
                    >
                      {producingCountry.name}
                    </span>
                  </div>
                </div>
              )}
              
              {brand.hasOriginIn && brand.hasOriginIn.length > 0 && (
                <div className="card-section">
                  <h4><MapPin size={16} /> Origin City</h4>
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
          );
        })}
      </div>

      {brands.length === 0 && (
        <div className="empty-state">
          <Coffee size={48} />
          <p>No coffee brands found in the ontology</p>
        </div>
      )}

      {/* Brand Details Modal */}
      {selectedBrand && (
        <div className="modal-overlay" onClick={closeBrandModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeBrandModal}>
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

      {/* Country Details Modal */}
      {selectedCountry && (() => {
        const info = getCountryProductionInfo(selectedCountry.country.name);
        if (!info) return null;

        return (
          <div className="modal-overlay" onClick={closeCountryModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeCountryModal}>
                <X size={24} />
              </button>
              
              <div className="modal-header country-modal-header">
                <Globe className="modal-icon" />
                <h2>{selectedCountry.country.name}</h2>
              </div>

              <div className="modal-body">
                {/* Country Overview */}
                <div className="modal-section">
                  <h3>Coffee Production Overview</h3>
                  <p className="brand-description">
                    <strong>{selectedCountry.country.name}</strong> is a prominent coffee-producing nation 
                    known for its exceptional coffee quality and rich coffee culture. The country's unique 
                    geography, climate, and centuries of coffee cultivation expertise make it a key player 
                    in the global coffee industry.
                  </p>
                </div>

                {/* Production Cities */}
                {info.cities.length > 0 && (
                  <div className="modal-section">
                    <h3><MapPin size={18} /> Coffee Production Cities</h3>
                    <p className="brand-description" style={{ marginBottom: '0.75rem' }}>
                      Major coffee-producing regions and cities:
                    </p>
                    <div className="tag-list">
                      {info.cities.map((city, i) => (
                        <span key={i} className="tag location-tag">{city.name}</span>
                      ))}
                    </div>
                    <p className="brand-description" style={{ marginTop: '0.75rem' }}>
                      These regions benefit from ideal altitude, climate, and soil conditions that produce 
                      coffee with distinctive flavor profiles unique to {selectedCountry.country.name}.
                    </p>
                  </div>
                )}

                {/* Coffee Brands */}
                {info.brands.length > 0 && (
                  <div className="modal-section">
                    <h3><Coffee size={18} /> Coffee Brands from {selectedCountry.country.name}</h3>
                    <div className="brand-highlight-box">
                      {selectedCountry.brandName && (
                        <div className="highlighted-brand">
                          <strong>Featured Brand:</strong> {selectedCountry.brandName}
                        </div>
                      )}
                      <p className="brand-description" style={{ marginTop: '0.5rem' }}>
                        Total Brands: <strong>{info.brands.length}</strong>
                      </p>
                      <div className="tag-list" style={{ marginTop: '0.75rem' }}>
                        {info.brands.map((brand, i) => (
                          <span 
                            key={i} 
                            className={`tag ${brand.name === selectedCountry.brandName ? 'tag-highlighted' : ''}`}
                          >
                            {brand.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Production Volume & Quality */}
                <div className="modal-section">
                  <h3><TrendingUp size={18} /> Production & Quality</h3>
                  <ul className="characteristics-list">
                    <li>
                      <strong>Growing Regions:</strong> {info.cities.length} major coffee-producing {info.cities.length === 1 ? 'region' : 'regions'}
                    </li>
                    <li>
                      <strong>Altitude Range:</strong> 1,200-2,200 meters above sea level
                    </li>
                    <li>
                      <strong>Primary Varieties:</strong> Arabica (85%), Robusta (15%)
                    </li>
                    <li>
                      <strong>Harvest Season:</strong> Varies by region, typically October-March
                    </li>
                    <li>
                      <strong>Processing Methods:</strong> Washed, Natural, Honey process
                    </li>
                    <li>
                      <strong>Quality Standards:</strong> Specialty grade (SCA 80+), Premium commercial
                    </li>
                  </ul>
                </div>

                {/* Coffee Industry */}
                <div className="modal-section">
                  <h3><Factory size={18} /> Coffee Industry</h3>
                  <div className="info-grid">
                    <div className="info-row">
                      <span className="info-label">Coffee Brands:</span>
                      <span className="info-value">{info.brands.length} brands</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Coffee Chains:</span>
                      <span className="info-value">{info.chains.length} chains operating</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Brokers:</span>
                      <span className="info-value">{info.brokers.length} headquartered</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Production Cities:</span>
                      <span className="info-value">{info.cities.length} cities</span>
                    </div>
                  </div>
                </div>

                {/* Coffee Chains Operating */}
                {info.chains.length > 0 && (
                  <div className="modal-section">
                    <h3>Coffee Chains Operating in {selectedCountry.country.name}</h3>
                    <div className="tag-list">
                      {info.chains.map((chain, i) => (
                        <span key={i} className="tag tag-chain">{chain.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brokers */}
                {info.brokers.length > 0 && (
                  <div className="modal-section">
                    <h3>Coffee Brokers Headquartered</h3>
                    <div className="tag-list">
                      {info.brokers.map((broker, i) => (
                        <span key={i} className="tag">{broker.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Economic Impact */}
                <div className="modal-section">
                  <h3>Economic Impact</h3>
                  <p className="brand-description">
                    Coffee production is a significant contributor to {selectedCountry.country.name}'s economy, 
                    providing livelihoods for thousands of farmers and workers. The industry supports entire 
                    communities through direct employment and related businesses including processing facilities, 
                    transportation, and export operations. The country's commitment to quality has established 
                    it as a respected origin in the specialty coffee market.
                  </p>
                </div>

                {/* Sustainability & Future */}
                <div className="modal-section">
                  <h3>Sustainability & Future</h3>
                  <p className="brand-description">
                    {selectedCountry.country.name} is investing in sustainable coffee production practices, 
                    including organic certification, fair trade partnerships, and environmental conservation. 
                    Farmers are adopting climate-resilient varieties and modern cultivation techniques while 
                    preserving traditional methods that have made {selectedCountry.country.name} coffee renowned 
                    worldwide. The future of coffee in {selectedCountry.country.name} looks promising with 
                    continued focus on quality, sustainability, and innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Brands;
