import { useEffect, useState } from 'react';
import { Coffee, MapPin, Users, Database, TrendingUp } from 'lucide-react';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/Home.css';

const Home = () => {
  const { data, loading, error } = useRDFData();
  
  if (loading) return <div className="loading">Loading ontology data...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  const stats = [
    {
      icon: MapPin,
      label: 'Countries',
      value: data?.countries?.length || 0,
      color: '#10b981',
      description: 'Coffee producing nations'
    },
    {
      icon: Coffee,
      label: 'Coffee Brands',
      value: data?.brands?.length || 0,
      color: '#f59e0b',
      description: 'Unique coffee varieties'
    },
    {
      icon: Users,
      label: 'Coffee Chains',
      value: data?.chains?.length || 0,
      color: '#3b82f6',
      description: 'Major retail chains'
    },
    {
      icon: Database,
      label: 'Brokers',
      value: data?.brokers?.length || 0,
      color: '#8b5cf6',
      description: 'Supply chain partners'
    }
  ];

  const featuredBrands = data?.brands?.slice(0, 6) || [];
  const featuredCountries = data?.countries?.slice(0, 6) || [];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <Coffee className="hero-icon" />
            Welcome to CoffeeLand
          </h1>
          <p className="hero-subtitle">
            Explore the global coffee supply chain through semantic web technology
          </p>
          <p className="hero-description">
            An interactive RDF ontology visualization showcasing the relationships between 
            coffee-producing countries, brands, retail chains, and brokers worldwide.
          </p>
        </div>
      </section>

      <section className="stats-section">
        <h2 className="section-title">Ontology Statistics</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card" style={{ '--accent-color': stat.color }}>
                <div className="stat-icon">
                  <Icon size={32} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-description">{stat.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Featured Coffee Brands</h2>
        <div className="featured-grid">
          {featuredBrands.map((brand, index) => (
            <div key={index} className="featured-card">
              <Coffee className="card-icon" />
              <h3>{brand.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Coffee Producing Countries</h2>
        <div className="featured-grid">
          {featuredCountries.map((country, index) => (
            <div key={index} className="featured-card">
              <MapPin className="card-icon" />
              <h3>{country.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="info-section">
        <div className="info-card">
          <TrendingUp className="info-icon" />
          <h3>Semantic Web Technology</h3>
          <p>
            This application uses RDF (Resource Description Framework) and OWL (Web Ontology Language) 
            to represent and query complex relationships in the coffee supply chain.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
