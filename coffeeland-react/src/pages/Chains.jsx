import { useState } from 'react';
import { Users, MapPin, X, Store, Globe, TrendingUp } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/EntityPage.css';

const Chains = () => {
  const { data, loading, error } = useRDFData();
  const [selectedChain, setSelectedChain] = useState(null);
  
  if (loading) return <div className="loading">Loading chains...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  const chains = data?.chains || [];

  // Chain information database
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
      mission: 'Deliver superior quality products and services for our guests and communities.'
    },
    'McCafe': {
      founded: '1993',
      headquarters: 'Oak Brook, USA',
      stores: '10,000+',
      countries: '100+',
      description: 'Coffee-house-style food and beverage chain by McDonald\'s, offering premium coffee.',
      specialty: 'Espresso drinks, frappes, smoothies',
      mission: 'Provide quality coffee at accessible prices worldwide.'
    },
    'Peet Coffee': {
      founded: '1966',
      headquarters: 'Emeryville, USA',
      stores: '200+',
      countries: '5+',
      description: 'American specialty coffee roaster and retailer, pioneer of the specialty coffee movement.',
      specialty: 'Small-batch roasted coffee, deep flavors',
      mission: 'Inspire a lifelong love of great coffee through commitment to quality.'
    },
    'Blue Bottle': {
      founded: '2002',
      headquarters: 'Oakland, USA',
      stores: '100+',
      countries: '4+',
      description: 'Premium specialty coffee roaster and retailer, known for single-origin coffees.',
      specialty: 'Pour-over coffee, single-origin beans, artisanal approach',
      mission: 'Deliciousness in every cup through careful sourcing and expert roasting.'
    },
    'Caffe Nero': {
      founded: '1997',
      headquarters: 'London, UK',
      stores: '1,000+',
      countries: '10+',
      description: 'British coffee house chain offering authentic Italian coffee experience.',
      specialty: 'Italian espresso, handcrafted drinks, pastries',
      mission: 'Create the best Italian coffee house experience.'
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
    }
  };

  const handleChainClick = (chain) => {
    setSelectedChain(chain);
  };

  const closeModal = () => {
    setSelectedChain(null);
  };

  const getChainInfo = (chainName) => {
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

  return (
    <div className="entity-page">
      <div className="page-header">
        <Users className="page-icon" />
        <div>
          <h1>Coffee Chains</h1>
          <p className="page-description">
            Major coffee retail chains and their global presence. Click on any chain for details.
          </p>
        </div>
      </div>

      <div className="entity-grid">
        {chains.map((chain, index) => (
          <div 
            key={index} 
            className="entity-card chain-card clickable-card"
            onClick={() => handleChainClick(chain)}
            title="Click for details"
          >
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

      {/* Chain Details Modal */}
      {selectedChain && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            
            <div className="modal-header modal-header-green">
              <Users className="modal-icon" />
              <h2>{selectedChain.name}</h2>
            </div>

            <div className="modal-body">
              {(() => {
                const info = getChainInfo(selectedChain.name);
                return (
                  <>
                    <div className="modal-section">
                      <h3>Company Overview</h3>
                      <p className="brand-description">
                        {info.description}
                      </p>
                    </div>

                    <div className="modal-section">
                      <h3>Company Profile</h3>
                      <ul className="characteristics-list">
                        <li>
                          <Store size={16} style={{ display: 'inline', marginRight: '8px' }} />
                          <strong>Founded:</strong> {info.founded}
                        </li>
                        <li>
                          <MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />
                          <strong>Headquarters:</strong> {info.headquarters}
                        </li>
                        <li>
                          <Store size={16} style={{ display: 'inline', marginRight: '8px' }} />
                          <strong>Total Stores:</strong> {info.stores} worldwide
                        </li>
                        <li>
                          <Globe size={16} style={{ display: 'inline', marginRight: '8px' }} />
                          <strong>Countries:</strong> Operating in {info.countries} countries
                        </li>
                      </ul>
                    </div>

                    {selectedChain.operatesIn && (
                      <div className="modal-section">
                        <h3>Operating Locations</h3>
                        <div className="info-row">
                          <span className="info-label">Cities:</span>
                          <span className="info-value">
                            {selectedChain.operatesIn.map(city => city.name).join(', ')}
                          </span>
                        </div>
                        <p className="brand-description" style={{ marginTop: '1rem' }}>
                          {selectedChain.name} has established a strong presence in {selectedChain.operatesIn.length} {selectedChain.operatesIn.length === 1 ? 'city' : 'cities'}, 
                          serving millions of customers with quality coffee and exceptional service.
                        </p>
                      </div>
                    )}

                    <div className="modal-section">
                      <h3>Specialty & Focus</h3>
                      <p className="brand-description">
                        <strong>Signature Offerings:</strong> {info.specialty}
                      </p>
                    </div>

                    <div className="modal-section">
                      <h3>Mission & Values</h3>
                      <p className="brand-description">
                        {info.mission}
                      </p>
                    </div>

                    {selectedChain.buysFrom && (
                      <div className="modal-section">
                        <h3>Supply Chain</h3>
                        <div className="info-row">
                          <span className="info-label">Brokers:</span>
                          <span className="info-value">
                            {selectedChain.buysFrom.map(broker => broker.name).join(', ')}
                          </span>
                        </div>
                        <p className="brand-description" style={{ marginTop: '1rem' }}>
                          {selectedChain.name} maintains strategic partnerships with trusted coffee brokers 
                          to ensure a consistent supply of high-quality coffee beans from around the world.
                        </p>
                      </div>
                    )}

                    <div className="modal-section">
                      <h3>Customer Experience</h3>
                      <p className="brand-description">
                        At {selectedChain.name}, every visit is crafted to provide an exceptional coffee 
                        experience. From expertly trained baristas to comfortable seating areas, the chain 
                        focuses on creating a welcoming environment where customers can enjoy premium coffee, 
                        connect with others, or work productively. The commitment to quality extends from 
                        bean sourcing to the final cup, ensuring consistency and excellence across all locations.
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chains;
