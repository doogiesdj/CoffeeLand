import { useState } from 'react';
import { MapPin, Coffee as CoffeeIcon, Store, X, Users, Globe, TrendingUp } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/EntityPage.css';

const Countries = () => {
  const { data, loading, error } = useRDFData();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedChain, setSelectedChain] = useState(null);
  
  if (loading) return <div className="loading">Loading countries...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  const countries = data?.countries || [];
  const allBrands = data?.brands || [];
  const allChains = data?.chains || [];
  const allCities = data?.cities || [];

  // Find full brand details
  const getBrandDetails = (brandName) => {
    return allBrands.find(brand => brand.name === brandName);
  };

  // Get chains operating in this country
  const getChainsInCountry = (countryName) => {
    // Find cities in this country
    const citiesInCountry = allCities.filter(city => 
      city.isLocatedIn && city.isLocatedIn.some(loc => loc.name === countryName)
    );
    
    const cityNames = citiesInCountry.map(city => city.name);
    
    // Find chains that operate in these cities
    const chainsInCountry = allChains.filter(chain => 
      chain.operatesIn && chain.operatesIn.some(city => cityNames.includes(city.name))
    );
    
    return chainsInCountry;
  };

  const handleBrandClick = (brandName) => {
    const brandDetails = getBrandDetails(brandName);
    setSelectedBrand(brandDetails);
  };

  const handleChainClick = (chain) => {
    setSelectedChain(chain);
  };

  // Chain information database (same as in Chains.jsx)
  const getChainInfo = (chainName) => {
    const chainInfo = {
      'Starbucks': {
        founded: '1971',
        headquarters: 'Seattle, USA',
        stores: '35,000+',
        countries: '80+',
        description: 'The world\'s largest coffeehouse chain, known for its premium coffee and cozy atmosphere.',
        specialty: 'Espresso-based drinks, seasonal beverages',
        mission: 'To inspire and nurture the human spirit – one person, one cup and one neighborhood at a time.'
      },
      'Costa Coffee': {
        founded: '1971',
        headquarters: 'London, UK',
        stores: '3,800+',
        countries: '32+',
        description: 'British multinational coffeehouse company, second-largest coffeehouse chain globally.',
        specialty: 'Signature blend coffee, expertly crafted beverages',
        mission: 'Save the world from mediocre coffee.'
      },
      'Dunkin Donuts': {
        founded: '1950',
        headquarters: 'Canton, USA',
        stores: '12,000+',
        countries: '36+',
        description: 'American multinational coffee and donut company, famous for coffee and baked goods.',
        specialty: 'Original Blend coffee, donuts, breakfast sandwiches',
        mission: 'Make and serve the freshest, most delicious coffee and donuts quickly and courteously.'
      },
      'Tim Hortons': {
        founded: '1964',
        headquarters: 'Toronto, Canada',
        stores: '5,300+',
        countries: '15+',
        description: 'Canadian multinational fast food restaurant chain, iconic in Canadian culture.',
        specialty: 'Double-double coffee, Timbits, breakfast items',
        mission: 'To deliver superior quality products and services for our guests and communities.'
      },
      'Blue Bottle': {
        founded: '2002',
        headquarters: 'Oakland, USA',
        stores: '100+',
        countries: '5+',
        description: 'American specialty coffee roaster and retailer, known for meticulous brewing.',
        specialty: 'Single-origin coffee, pour-over brewing',
        mission: 'Delicious coffee, hospitality, and a commitment to a more sustainable and equitable future.'
      },
      'Peet Coffee': {
        founded: '1966',
        headquarters: 'Emeryville, USA',
        stores: '200+',
        countries: '1+',
        description: 'American specialty coffee roaster and retailer, pioneer of artisan coffee.',
        specialty: 'Dark roast coffee, hand-roasted beans',
        mission: 'Offer the best coffee, roasted fresh to bring out the fullest flavor.'
      },
      'McCafe': {
        founded: '1993',
        headquarters: 'Chicago, USA',
        stores: '10,000+',
        countries: '100+',
        description: 'McDonald\'s coffeehouse-style beverage brand, accessible premium coffee.',
        specialty: 'Lattes, cappuccinos, frappes',
        mission: 'Serve great-tasting coffee and beverages at an affordable price.'
      },
      'Caribou Coffee': {
        founded: '1992',
        headquarters: 'Brooklyn, USA',
        stores: '700+',
        countries: '10+',
        description: 'American coffeehouse chain known for its cabin-like atmosphere and quality coffee.',
        specialty: 'Signature roasted coffee, seasonal drinks',
        mission: 'Create day-making experiences that inspire and enrich lives.'
      },
      'The Coffee Bean And Tea Leaf': {
        founded: '1963',
        headquarters: 'Los Angeles, USA',
        stores: '1,200+',
        countries: '30+',
        description: 'American coffee chain offering premium coffee and tea from around the world.',
        specialty: 'Ice Blended drinks, hand-roasted coffee',
        mission: 'Deliver superior quality and service with passion.'
      },
      'Gloria Jeans': {
        founded: '1979',
        headquarters: 'Sydney, Australia',
        stores: '1,000+',
        countries: '40+',
        description: 'Australian coffee chain known for specialty flavored coffee.',
        specialty: 'Flavored coffee, chillers, hot chocolate',
        mission: 'Serve the best coffee with genuine hospitality.'
      },
      'Lavazza': {
        founded: '1895',
        headquarters: 'Turin, Italy',
        stores: '500+',
        countries: '90+',
        description: 'Italian coffee company, one of the oldest and most prestigious in the world.',
        specialty: 'Italian espresso, premium blends',
        mission: 'Spread Italian coffee culture and excellence worldwide.'
      },
      'Doutor Coffee': {
        founded: '1980',
        headquarters: 'Tokyo, Japan',
        stores: '1,200+',
        countries: '5+',
        description: 'Japanese coffeehouse chain, largest coffee chain in Japan.',
        specialty: 'Japanese-style coffee, light meals',
        mission: 'Provide comfortable spaces and quality coffee for daily life.'
      },
      'Luckin Coffee': {
        founded: '2017',
        headquarters: 'Beijing, China',
        stores: '13,000+',
        countries: '2+',
        description: 'Chinese coffee company, rapidly growing with technology-driven service.',
        specialty: 'Mobile ordering, affordable premium coffee',
        mission: 'Make it easy for everyone to enjoy great coffee.'
      },
      'Coffee Project NY': {
        founded: '2015',
        headquarters: 'Manila, Philippines',
        stores: '50+',
        countries: '2+',
        description: 'Philippine specialty coffee chain focusing on quality and experience.',
        specialty: 'Specialty coffee, artisanal drinks',
        mission: 'Elevate the coffee experience in Southeast Asia.'
      },
      'Philz Coffee': {
        founded: '2003',
        headquarters: 'San Francisco, USA',
        stores: '60+',
        countries: '1+',
        description: 'American coffee company known for customized coffee blends.',
        specialty: 'Personalized blended coffee, unique flavors',
        mission: 'Better the day of everyone we interact with.'
      },
      'Intelligentsia Coffee': {
        founded: '1995',
        headquarters: 'Chicago, USA',
        stores: '25+',
        countries: '1+',
        description: 'American specialty coffee roaster, pioneer in direct trade relationships.',
        specialty: 'Single-origin coffee, direct trade beans',
        mission: 'Pursue the extraordinary cup and create meaningful relationships.'
      },
      'Ediya Coffee': {
        founded: '2001',
        headquarters: 'Seoul, South Korea',
        stores: '3,000+',
        countries: '1+',
        description: 'South Korea\'s largest coffee chain, known for affordable quality coffee and wide accessibility.',
        specialty: 'Dutch coffee, seasonal beverages, affordable pricing',
        mission: 'Provide high-quality coffee at reasonable prices for everyone.'
      },
      'A Twosome Place': {
        founded: '2002',
        headquarters: 'Seoul, South Korea',
        stores: '1,600+',
        countries: '2+',
        description: 'Premium Korean dessert café chain specializing in coffee and fresh desserts.',
        specialty: 'Cake & coffee pairing, premium desserts, cozy atmosphere',
        mission: 'Create moments of happiness through quality coffee and desserts.'
      },
      'Mega Coffee': {
        founded: '2017',
        headquarters: 'Seoul, South Korea',
        stores: '2,900+',
        countries: '1+',
        description: 'Fast-growing Korean coffee franchise known for large-size drinks at competitive prices.',
        specialty: 'Mega-sized beverages, value pricing, diverse menu',
        mission: 'Deliver great taste and generous portions at affordable prices.'
      },
      'Compose Coffee': {
        founded: '2014',
        headquarters: 'Seoul, South Korea',
        stores: '2,600+',
        countries: '1+',
        description: 'Rapidly expanding Korean coffee franchise known for low prices and consistent quality.',
        specialty: 'Affordable premium coffee, convenience store model, rapid expansion',
        mission: 'Make quality coffee accessible to everyone at the lowest prices.'
      },
      'Hollys Coffee': {
        founded: '1998',
        headquarters: 'Seoul, South Korea',
        stores: '550+',
        countries: '3+',
        description: 'Premium Korean coffeehouse chain with a European café atmosphere and artisanal approach.',
        specialty: 'Belgian waffles, premium coffee, European café ambiance',
        mission: 'Provide sophisticated coffee culture experience with European elegance.'
      },
      'Paik\'s Coffee': {
        founded: '2006',
        headquarters: 'Seoul, South Korea',
        stores: '2,100+',
        countries: '1+',
        description: 'Popular Korean coffee franchise founded by celebrity chef Paik Jong-won, known for affordable prices and consistent quality.',
        specialty: 'Affordable espresso drinks, simple menu, rapid service',
        mission: 'Provide quality coffee at the most reasonable prices for everyday enjoyment.'
      },
      'Caffe Nero': {
        founded: '1997',
        headquarters: 'London, UK',
        stores: '1,000+',
        countries: '11+',
        description: 'British coffeehouse chain known for Italian-inspired coffee experience.',
        specialty: 'Italian espresso, premium coffee',
        mission: 'Deliver authentic Italian coffee experience.'
      }
    };
    
    return chainInfo[chainName] || {
      founded: 'N/A',
      headquarters: 'N/A',
      stores: 'N/A',
      countries: 'N/A',
      description: 'A prominent coffee chain serving quality coffee to customers worldwide.',
      specialty: 'Premium coffee and beverages',
      mission: 'Deliver exceptional coffee experiences to customers.'
    };
  };

  const closeBrandModal = () => {
    setSelectedBrand(null);
  };

  const closeChainModal = () => {
    setSelectedChain(null);
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
            
            {(() => {
              const chains = getChainsInCountry(country.name);
              return chains.length > 0 && (
                <div className="card-section">
                  <h4><Store size={16} /> Coffee Chains</h4>
                  <div className="tag-list">
                    {chains.map((chain, i) => (
                      <span 
                        key={i} 
                        className="tag tag-chain tag-clickable"
                        onClick={() => handleChainClick(chain)}
                        title="Click to view chain details"
                      >
                        {chain.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
            
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
        <div className="modal-overlay" onClick={closeBrandModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeBrandModal}>
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

      {/* Chain Details Modal */}
      {selectedChain && (() => {
        const info = getChainInfo(selectedChain.name);
        return (
          <div className="modal-overlay" onClick={closeChainModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeChainModal}>
                <X size={24} />
              </button>
              
              <div className="modal-header chain-modal-header">
                <Users className="modal-icon" />
                <h2>{selectedChain.name}</h2>
              </div>

              <div className="modal-body">
                {/* Company Overview */}
                <div className="modal-section">
                  <h3>Company Overview</h3>
                  <p className="brand-description">{info.description}</p>
                </div>

                {/* Company Profile */}
                <div className="modal-section">
                  <h3>Company Profile</h3>
                  <div className="info-grid">
                    <div className="info-row">
                      <span className="info-label">Founded:</span>
                      <span className="info-value">{info.founded}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Headquarters:</span>
                      <span className="info-value">{info.headquarters}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Total Stores:</span>
                      <span className="info-value">{info.stores}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Countries:</span>
                      <span className="info-value">{info.countries}</span>
                    </div>
                  </div>
                </div>

                {/* Operating Locations */}
                {selectedChain.operatesIn && selectedChain.operatesIn.length > 0 && (
                  <div className="modal-section">
                    <h3><MapPin size={18} /> Operating Locations</h3>
                    <div className="tag-list">
                      {selectedChain.operatesIn.map((city, i) => (
                        <span key={i} className="tag location-tag">{city.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialty & Focus */}
                <div className="modal-section">
                  <h3>Specialty & Focus</h3>
                  <p><strong>Signature Offerings:</strong> {info.specialty}</p>
                </div>

                {/* Mission & Values */}
                <div className="modal-section">
                  <h3>Mission & Values</h3>
                  <p><strong>Mission Statement:</strong> {info.mission}</p>
                </div>

                {/* Supply Chain */}
                {selectedChain.buysFrom && selectedChain.buysFrom.length > 0 && (
                  <div className="modal-section">
                    <h3><TrendingUp size={18} /> Supply Chain</h3>
                    <p><strong>Broker Partners:</strong></p>
                    <div className="tag-list">
                      {selectedChain.buysFrom.map((broker, i) => (
                        <span key={i} className="tag">{broker.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Experience */}
                <div className="modal-section">
                  <h3><Store size={18} /> Customer Experience</h3>
                  <p>
                    This coffee chain is committed to delivering exceptional coffee experiences 
                    to customers worldwide. With a focus on quality, consistency, and customer 
                    satisfaction, they have built a loyal customer base across multiple markets.
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

export default Countries;
