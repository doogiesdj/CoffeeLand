import { useState } from 'react';
import { Database, Users, Coffee } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import EntityModal from '../components/EntityModal';
import '../styles/EntityPage.css';

const Brokers = () => {
  const { data, loading, error } = useRDFData();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', content: null, type: 'default' });
  
  if (loading) return <div className="loading">Loading brokers...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  const brokers = data?.brokers || [];

  // Broker descriptions
  const getBrokerDescription = (brokerName) => {
    const descriptions = {
      'Global Coffee Exchange': 'A leading international coffee trading platform connecting producers from over 50 countries with buyers worldwide. Specializes in specialty coffee trading and provides real-time market data, quality verification, and logistics support.',
      'Bean Connect': 'An innovative digital marketplace focusing on direct trade relationships between coffee farmers and roasters. Emphasizes transparency, fair pricing, and sustainable practices while reducing intermediary costs.',
      'Premium Coffee Traders': 'A boutique coffee broker specializing in high-quality specialty coffees. Known for their expertise in cupping, quality assessment, and maintaining long-term relationships with premium coffee producers.',
      'International Bean Network': 'A global coffee brokerage network with regional offices across major coffee-producing regions. Provides comprehensive services including market analysis, risk management, and supply chain optimization.',
      'Direct Trade Solutions': 'Focused on establishing direct connections between coffee farms and retailers, eliminating unnecessary middlemen. Pioneers in blockchain-based traceability and transparent pricing models.'
    };
    return descriptions[brokerName] || `${brokerName} is a professional coffee broker facilitating connections between coffee producers, brands, and retail chains in the global coffee supply chain.`;
  };

  // Brand descriptions
  const getBrandDescription = (brandName) => {
    const descriptions = {
      'Blue Bottle Coffee': 'A specialty coffee roaster known for meticulous sourcing, precise roasting techniques, and a commitment to freshness. Founded in Oakland, California, and now part of Nestlé, Blue Bottle emphasizes direct relationships with farmers.',
      'Stumptown Coffee Roasters': 'An iconic Portland-based roaster pioneering the third-wave coffee movement. Known for direct trade relationships, innovative cold brew products, and commitment to quality and sustainability.',
      'Intelligentsia Coffee': 'A Chicago-based specialty coffee roaster and retailer focusing on Direct Trade relationships with farmers. Renowned for exceptional quality standards and barista training programs.',
      'Counter Culture Coffee': 'A Durham, North Carolina-based roaster dedicated to sustainability and transparency. Provides comprehensive education programs and maintains close partnerships with coffee-producing communities.',
      'Ritual Coffee Roasters': 'A San Francisco-based specialty roaster emphasizing seasonal offerings and direct farmer relationships. Known for their commitment to quality, sustainability, and community engagement.'
    };
    return descriptions[brandName] || `${brandName} is a premium coffee brand committed to quality, sustainability, and excellence in coffee sourcing and roasting.`;
  };

  // Chain descriptions
  const getChainDescription = (chainName) => {
    const descriptions = {
      'Starbucks': 'The world\'s largest coffeehouse chain with over 35,000 locations globally. Known for standardizing espresso-based drinks, creating the "third place" concept, and implementing ethical sourcing through C.A.F.E. Practices.',
      'Dunkin\'': 'America\'s favorite coffee and baked goods chain, serving millions of customers daily. Known for affordable coffee, convenient locations, and a wide variety of beverages and food options.',
      'Peet\'s Coffee': 'The original specialty coffee roaster that inspired Starbucks founders. Based in Berkeley, California, Peet\'s is known for darker roasts and commitment to quality sourcing.',
      'Caribou Coffee': 'A coffeehouse chain emphasizing handcrafted beverages and sustainable sourcing through Rainforest Alliance certification. Known for its cabin-like atmosphere and community focus.',
      'The Coffee Bean & Tea Leaf': 'A California-based chain known for introducing the Ice Blended drink. Emphasizes premium quality, diverse menu, and global expansion with locations in over 30 countries.',
      'Blue Tokai Coffee Roasters': 'India\'s premier specialty coffee roaster focused on showcasing Indian single-origin coffees. Pioneers in the Indian specialty coffee scene with emphasis on farm-to-cup traceability.',
      'Cafe Coffee Day': 'India\'s largest coffee chain with thousands of outlets nationwide. Known for creating the café culture in India and providing a casual meeting space for youth.',
      'Luckin Coffee': 'China\'s rapidly growing coffee chain leveraging technology for mobile ordering and delivery. Known for aggressive expansion and competitive pricing strategies.',
      'Tim Hortons': 'Canada\'s iconic coffee and donut chain, synonymous with Canadian culture. Known for their signature double-double coffee and Timbits, with strong community presence.'
    };
    return descriptions[chainName] || `${chainName} is a coffee retail chain providing quality coffee and a welcoming atmosphere to customers worldwide.`;
  };

  const openBrokerModal = (broker) => {
    setModalData({
      title: broker.name,
      content: (
        <div>
          <p>{getBrokerDescription(broker.name)}</p>
          {broker.mediates && broker.mediates.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <strong>Mediates for brands:</strong>
              <ul>
                {broker.mediates.map((brand, i) => (
                  <li key={i}>{brand.name}</li>
                ))}
              </ul>
            </div>
          )}
          {broker.suppliesTo && broker.suppliesTo.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <strong>Supplies to chains:</strong>
              <ul>
                {broker.suppliesTo.map((chain, i) => (
                  <li key={i}>{chain.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
      type: 'broker'
    });
    setModalOpen(true);
  };

  const openBrandModal = (brand) => {
    setModalData({
      title: brand.name,
      content: <p>{getBrandDescription(brand.name)}</p>,
      type: 'brand'
    });
    setModalOpen(true);
  };

  const openChainModal = (chain) => {
    setModalData({
      title: chain.name,
      content: <p>{getChainDescription(chain.name)}</p>,
      type: 'chain'
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

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
          <div 
            key={index} 
            className="entity-card broker-card"
            onClick={() => openBrokerModal(broker)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-header">
              <Database className="card-icon" />
              <h3>{broker.name}</h3>
            </div>
            
            {broker.mediates && broker.mediates.length > 0 && (
              <div className="card-section">
                <h4><Coffee size={16} /> Mediates</h4>
                <div className="tag-list">
                  {broker.mediates.map((brand, i) => (
                    <span 
                      key={i} 
                      className="tag brand-tag"
                      onClick={(e) => {
                        e.stopPropagation();
                        openBrandModal(brand);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {brand.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {broker.suppliesTo && broker.suppliesTo.length > 0 && (
              <div className="card-section">
                <h4><Users size={16} /> Supplies To</h4>
                <div className="tag-list">
                  {broker.suppliesTo.map((chain, i) => (
                    <span 
                      key={i} 
                      className="tag chain-tag"
                      onClick={(e) => {
                        e.stopPropagation();
                        openChainModal(chain);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {chain.name}
                    </span>
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

      <EntityModal 
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalData.title}
        content={modalData.content}
        type={modalData.type}
      />
    </div>
  );
};

export default Brokers;
