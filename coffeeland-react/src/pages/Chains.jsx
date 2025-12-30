import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, MapPin, X, Store, Globe, TrendingUp } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/EntityPage.css';

const Chains = () => {
  const { data, loading, error } = useRDFData();
  const [selectedChain, setSelectedChain] = useState(null);
  const [searchParams] = useSearchParams();
  const chainRefs = useRef({});
  
  const highlightedChain = searchParams.get('highlight');
  const chains = data?.chains || [];

  // Scroll to and highlight the chain when URL parameter is present
  useEffect(() => {
    if (highlightedChain && chainRefs.current[highlightedChain]) {
      setTimeout(() => {
        chainRefs.current[highlightedChain]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [highlightedChain, data]);
  
  if (loading) return <div className="loading">Loading chains...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  // Chain information database
  const chainInfo = {
    'Starbucks': {
      founded: '1971',
      headquarters: 'Seattle, USA',
      stores: '35,000+',
      countries: '80+',
      description: 'The world\'s largest coffeehouse chain, known for its premium coffee and cozy atmosphere.',
      specialty: 'Espresso-based drinks, seasonal beverages',
      mission: 'To inspire and nurture the human spirit – one person, one cup and one neighborhood at a time.',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/200px-Starbucks_Corporation_Logo_2011.svg.png'
    },
    'Costa Coffee': {
      founded: '1971',
      headquarters: 'London, UK',
      stores: '3,800+',
      countries: '32+',
      description: 'British multinational coffeehouse company, second-largest coffeehouse chain globally.',
      specialty: 'Signature blend coffee, expertly crafted beverages',
      mission: 'Save the world from mediocre coffee.',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Costa_Coffee_logo.svg/200px-Costa_Coffee_logo.svg.png'
    },
    'Dunkin Donuts': {
      founded: '1950',
      headquarters: 'Canton, USA',
      stores: '12,000+',
      countries: '36+',
      description: 'American multinational coffee and donut company, famous for coffee and baked goods.',
      specialty: 'Original Blend coffee, donuts, breakfast sandwiches',
      mission: 'Make and serve the freshest, most delicious coffee and donuts quickly and courteously.',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Dunkin%27_logo.svg/200px-Dunkin%27_logo.svg.png'
    },
    'Tim Hortons': {
      founded: '1964',
      headquarters: 'Toronto, Canada',
      stores: '5,300+',
      countries: '15+',
      description: 'Canadian multinational fast food restaurant chain, iconic in Canadian culture.',
      specialty: 'Double-double coffee, Timbits, breakfast items',
      mission: 'Deliver superior quality products and services for our guests and communities.',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/Tim_Hortons_logo.svg/200px-Tim_Hortons_logo.svg.png'
    },
    'McCafe': {
      founded: '1993',
      headquarters: 'Oak Brook, USA',
      stores: '10,000+',
      countries: '100+',
      description: 'Coffee-house-style food and beverage chain by McDonald\'s, offering premium coffee.',
      specialty: 'Espresso drinks, frappes, smoothies',
      mission: 'Provide quality coffee at accessible prices worldwide.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/200px-McDonald%27s_Golden_Arches.svg.png'
    },
    'Peet Coffee': {
      founded: '1966',
      headquarters: 'Emeryville, USA',
      stores: '200+',
      countries: '5+',
      description: 'American specialty coffee roaster and retailer, pioneer of the specialty coffee movement.',
      specialty: 'Small-batch roasted coffee, deep flavors',
      mission: 'Inspire a lifelong love of great coffee through commitment to quality.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Peet%27s_Logo.svg/200px-Peet%27s_Logo.svg.png'
    },
    'Blue Bottle': {
      founded: '2002',
      headquarters: 'Oakland, USA',
      stores: '100+',
      countries: '4+',
      description: 'Premium specialty coffee roaster and retailer, known for single-origin coffees.',
      specialty: 'Pour-over coffee, single-origin beans, artisanal approach',
      mission: 'Deliciousness in every cup through careful sourcing and expert roasting.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Blue_Bottle_Coffee_logo.svg/200px-Blue_Bottle_Coffee_logo.svg.png'
    },
    'Caffe Nero': {
      founded: '1997',
      headquarters: 'London, UK',
      stores: '1,000+',
      countries: '10+',
      description: 'British coffee house chain offering authentic Italian coffee experience.',
      specialty: 'Italian espresso, handcrafted drinks, pastries',
      mission: 'Create the best Italian coffee house experience.',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Caffe_Nero_logo.svg/200px-Caffe_Nero_logo.svg.png'
    },
    'Caribou Coffee': {
      founded: '1992',
      headquarters: 'Brooklyn, USA',
      stores: '700+',
      countries: '10+',
      description: 'American coffeehouse chain known for its cabin-like atmosphere and quality coffee.',
      specialty: 'Signature roasted coffee, seasonal drinks',
      mission: 'Create day-making experiences that inspire and enrich lives.',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Caribou_Coffee_logo.svg/200px-Caribou_Coffee_logo.svg.png'
    },
    'The Coffee Bean And Tea Leaf': {
      founded: '1963',
      headquarters: 'Los Angeles, USA',
      stores: '1,200+',
      countries: '30+',
      description: 'American coffee chain offering premium coffee and tea from around the world.',
      specialty: 'Ice Blended drinks, hand-roasted coffee',
      mission: 'Deliver superior quality and service with passion.',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a0/The_Coffee_Bean_%26_Tea_Leaf_logo.svg/200px-The_Coffee_Bean_%26_Tea_Leaf_logo.svg.png'
    },
    'Gloria Jeans': {
      founded: '1979',
      headquarters: 'Sydney, Australia',
      stores: '1,000+',
      countries: '40+',
      description: 'Australian coffee chain known for specialty flavored coffee.',
      specialty: 'Flavored coffee, chillers, hot chocolate',
      mission: 'Serve the best coffee with genuine hospitality.',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Gloria_Jean%27s_Coffees_logo.svg/200px-Gloria_Jean%27s_Coffees_logo.svg.png'
    },
    'Lavazza': {
      founded: '1895',
      headquarters: 'Turin, Italy',
      stores: '500+',
      countries: '90+',
      description: 'Italian coffee company, one of the oldest and most prestigious in the world.',
      specialty: 'Italian espresso, premium blends',
      mission: 'Spread Italian coffee culture and excellence worldwide.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Lavazza_logo.svg/200px-Lavazza_logo.svg.png'
    },
    'Doutor Coffee': {
      founded: '1980',
      headquarters: 'Tokyo, Japan',
      stores: '1,200+',
      countries: '5+',
      description: 'Japanese coffeehouse chain, largest coffee chain in Japan.',
      specialty: 'Japanese-style coffee, light meals',
      mission: 'Provide comfortable spaces and quality coffee for daily life.',
      logo: 'https://www.doutor.co.jp/cms/wp-content/themes/dcm/common/img/logo.png'
    },
    'Luckin Coffee': {
      founded: '2017',
      headquarters: 'Beijing, China',
      stores: '13,000+',
      countries: '2+',
      description: 'Chinese coffee company, rapidly growing with technology-driven service.',
      specialty: 'Mobile ordering, affordable premium coffee',
      mission: 'Make it easy for everyone to enjoy great coffee.',
      logo: 'https://s.yimg.com/ny/api/res/1.2/cqXd4qiJZQ8pMQIiK7j7Nw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTM1OQ--/https://media.zenfs.com/en/luckin_coffee_articles_355/3ba3f31c9fdb4e6aaba3f1e8c96c7e1d'
    },
    'Coffee Project NY': {
      founded: '2015',
      headquarters: 'Manila, Philippines',
      stores: '50+',
      countries: '2+',
      description: 'Philippine specialty coffee chain focusing on quality and experience.',
      specialty: 'Specialty coffee, artisanal drinks',
      mission: 'Elevate the coffee experience in Southeast Asia.',
      logo: 'https://coffeeprojectny.com/wp-content/uploads/2020/07/logo.png'
    },
    'Philz Coffee': {
      founded: '2003',
      headquarters: 'San Francisco, USA',
      stores: '60+',
      countries: '1+',
      description: 'American coffee company known for customized coffee blends.',
      specialty: 'Personalized blended coffee, unique flavors',
      mission: 'Better the day of everyone we interact with.',
      logo: 'https://www.philzcoffee.com/static/images/philz-logo.svg'
    },
    'Intelligentsia Coffee': {
      founded: '1995',
      headquarters: 'Chicago, USA',
      stores: '25+',
      countries: '1+',
      description: 'American specialty coffee roaster, pioneer in direct trade relationships.',
      specialty: 'Single-origin coffee, direct trade beans',
      mission: 'Pursue the extraordinary cup and create meaningful relationships.',
      logo: 'https://www.intelligentsiacoffee.com/static/logo-8a9c3b5c4c8f8c9e8b8f8c8f8c8f8c8f.svg'
    },
    'Ediya Coffee': {
      founded: '2001',
      headquarters: 'Seoul, South Korea',
      stores: '3,000+',
      countries: '1+',
      description: 'South Korea\'s largest coffee chain, known for affordable quality coffee and wide accessibility.',
      specialty: 'Dutch coffee, seasonal beverages, affordable pricing',
      mission: 'Provide high-quality coffee at reasonable prices for everyone.',
      logo: 'https://www.ediya.com/files/brand/brand_img01.png'
    },
    'A Twosome Place': {
      founded: '2002',
      headquarters: 'Seoul, South Korea',
      stores: '1,600+',
      countries: '2+',
      description: 'Premium Korean dessert café chain specializing in coffee and fresh desserts.',
      specialty: 'Cake & coffee pairing, premium desserts, cozy atmosphere',
      mission: 'Create moments of happiness through quality coffee and desserts.',
      logo: 'https://www.atwosome.co.kr/resource/images/common/logo.png'
    },
    'Mega Coffee': {
      founded: '2017',
      headquarters: 'Seoul, South Korea',
      stores: '2,900+',
      countries: '1+',
      description: 'Fast-growing Korean coffee franchise known for large-size drinks at competitive prices.',
      specialty: 'Mega-sized beverages, value pricing, diverse menu',
      mission: 'Deliver great taste and generous portions at affordable prices.',
      logo: 'https://www.megacoffee.me/img/common/logo.png'
    },
    'Compose Coffee': {
      founded: '2014',
      headquarters: 'Seoul, South Korea',
      stores: '2,600+',
      countries: '1+',
      description: 'Rapidly expanding Korean coffee franchise known for low prices and consistent quality.',
      specialty: 'Affordable premium coffee, convenience store model, rapid expansion',
      mission: 'Make quality coffee accessible to everyone at the lowest prices.',
      logo: 'https://composecoffee.com/images/logo.png'
    },
    'Hollys Coffee': {
      founded: '1998',
      headquarters: 'Seoul, South Korea',
      stores: '550+',
      countries: '3+',
      description: 'Premium Korean coffeehouse chain with a European café atmosphere and artisanal approach.',
      specialty: 'Belgian waffles, premium coffee, European café ambiance',
      mission: 'Provide sophisticated coffee culture experience with European elegance.',
      logo: 'https://www.hollys.co.kr/images/common/logo.png'
    },
    'Paik\'s Coffee': {
      founded: '2006',
      headquarters: 'Seoul, South Korea',
      stores: '2,100+',
      countries: '1+',
      description: 'Popular Korean coffee franchise founded by celebrity chef Paik Jong-won, known for affordable prices and consistent quality.',
      specialty: 'Affordable espresso drinks, simple menu, rapid service',
      mission: 'Provide quality coffee at the most reasonable prices for everyday enjoyment.',
      logo: 'https://paikdabang.com/wp-content/themes/paikdabang/assets/images/common/logo.png'
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
      mission: 'Deliver exceptional coffee experiences to customers.',
      logo: 'https://via.placeholder.com/200x100?text=Coffee+Chain'
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
        {chains.map((chain, index) => {
          const isHighlighted = highlightedChain === chain.name;
          return (
            <div 
              key={index}
              ref={(el) => (chainRefs.current[chain.name] = el)}
              className={`entity-card chain-card clickable-card ${isHighlighted ? 'highlighted' : ''}`}
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
          );
        })}
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
              {(() => {
                const info = getChainInfo(selectedChain.name);
                return info.logo ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                    <img 
                      src={info.logo} 
                      alt={`${selectedChain.name} logo`}
                      style={{ 
                        maxHeight: '60px', 
                        maxWidth: '120px',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div>
                      <Users className="modal-icon" style={{ display: 'inline', marginRight: '8px' }} />
                      <h2 style={{ display: 'inline', margin: 0 }}>{selectedChain.name}</h2>
                    </div>
                  </div>
                ) : (
                  <>
                    <Users className="modal-icon" />
                    <h2>{selectedChain.name}</h2>
                  </>
                );
              })()}
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
