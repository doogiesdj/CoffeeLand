import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/Visualization.css';

const Visualization = () => {
  const { data, loading, error } = useRDFData();
  const svgRef = useRef();
  const containerRef = useRef();
  const [graphStats, setGraphStats] = useState(null);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    console.log('Network Graph data:', data);

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const container = containerRef.current;
    const width = container.clientWidth || 1200;
    const height = 4000;

    console.log('Network Graph dimensions:', width, height);

    // Create ontology hierarchy nodes (like the first image)
    const nodes = [
      // Top level - owl:Thing
      { id: 'owl:Thing', label: 'owl:Thing', type: 'owl:Class', color: '#22c55e', shape: 'rect', isOntology: true },
      
      // Second level - Main classes
      { id: 'Location', label: 'Location', type: 'Class', color: '#94a3b8', shape: 'rect', isOntology: true },
      { id: 'Organization', label: 'Organization', type: 'Class', color: '#94a3b8', shape: 'rect', isOntology: true },
      { id: 'Product', label: 'Product', type: 'Class', color: '#94a3b8', shape: 'rect', isOntology: true },
      
      // Third level - Subclasses
      { id: 'Country', label: 'Country', type: 'Class', color: '#10b981', shape: 'rect', isOntology: true },
      { id: 'City', label: 'City', type: 'Class', color: '#14b8a6', shape: 'rect', isOntology: true },
      { id: 'Capital', label: 'Capital', type: 'Class', color: '#06b6d4', shape: 'rect', isOntology: true },
      { id: 'CoffeeChain', label: 'CoffeeChain', type: 'Class', color: '#3b82f6', shape: 'rect', isOntology: true },
      { id: 'Broker', label: 'Broker', type: 'Class', color: '#8b5cf6', shape: 'rect', isOntology: true },
      { id: 'CoffeeBrand', label: 'CoffeeBrand', type: 'Class', color: '#f59e0b', shape: 'rect', isOntology: true },
      { id: 'CoffeeBean', label: 'CoffeeBean', type: 'Class', color: '#f97316', shape: 'rect', isOntology: true }
    ];

    // Add instances from data
    const addInstances = (entities, type, parentClass, color) => {
      entities?.forEach(entity => {
        nodes.push({ 
          id: `instance:${entity.name}`, 
          label: entity.name,
          type: `${type} Instance`, 
          color,
          shape: 'rect',
          isOntology: false,
          parentClass,
          ...entity 
        });
      });
    };

    addInstances(data.countries, 'Country', 'Country', '#10b981');
    addInstances(data.cities, 'City', 'City', '#14b8a6');
    addInstances(data.brands, 'Brand', 'CoffeeBrand', '#f59e0b');
    addInstances(data.chains, 'Chain', 'CoffeeChain', '#3b82f6');
    addInstances(data.brokers, 'Broker', 'Broker', '#8b5cf6');

    console.log('Total nodes:', nodes.length);

    // Create ontology hierarchy links (subClassOf)
    const ontologyLinks = [
      // owl:Thing → Main classes
      { source: 'Location', target: 'owl:Thing', type: 'subClassOf', label: 'subClassOf', style: 'inheritance' },
      { source: 'Organization', target: 'owl:Thing', type: 'subClassOf', label: 'subClassOf', style: 'inheritance' },
      { source: 'Product', target: 'owl:Thing', type: 'subClassOf', label: 'subClassOf', style: 'inheritance' },
      
      // Main classes → Subclasses
      { source: 'Country', target: 'Location', type: 'subClassOf', label: 'subClassOf', style: 'inheritance' },
      { source: 'City', target: 'Country', type: 'subClassOf', label: 'subClassOf', style: 'inheritance' },
      { source: 'Capital', target: 'Country', type: 'subClassOf', label: 'subClassOf', style: 'inheritance' },
      { source: 'CoffeeChain', target: 'Organization', type: 'subClassOf', label: 'subClassOf', style: 'inheritance' },
      { source: 'Broker', target: 'Organization', type: 'subClassOf', label: 'subClassOf', style: 'inheritance' },
      { source: 'CoffeeBrand', target: 'Product', type: 'subClassOf', label: 'subClassOf', style: 'inheritance' },
      { source: 'CoffeeBean', target: 'Product', type: 'subClassOf', label: 'subClassOf', style: 'inheritance' }
    ];

    // Create property links (object properties)
    const propertyLinks = [
      { source: 'Country', target: 'CoffeeBrand', type: 'produces', label: 'produces', style: 'property' },
      { source: 'City', target: 'Country', type: 'isLocatedIn', label: 'isLocatedIn', style: 'property' },
      { source: 'CoffeeChain', target: 'City', type: 'operatesIn', label: 'operatesIn', style: 'property' },
      { source: 'Broker', target: 'CoffeeChain', type: 'suppliesTo', label: 'suppliesTo', style: 'property' },
      { source: 'CoffeeChain', target: 'Broker', type: 'buysFrom', label: 'buysFrom', style: 'property' },
      { source: 'Country', target: 'Capital', type: 'hasMainCapital', label: 'hasMainCapital', style: 'property' },
      { source: 'CoffeeBrand', target: 'City', type: 'hasOriginIn', label: 'hasOriginIn', style: 'property' },
      { source: 'CoffeeBrand', target: 'Country', type: 'isConsumedIn', label: 'isConsumedIn', style: 'property' }
    ];

    // Combine all links
    const links = [...ontologyLinks, ...propertyLinks];

    // Add instance-to-class links
    nodes.forEach(node => {
      if (!node.isOntology && node.parentClass) {
        links.push({
          source: node.id,
          target: node.parentClass,
          type: 'instanceOf',
          label: 'instanceOf',
          style: 'instance'
        });
      }
    });

    // Create a set of node IDs for validation
    const nodeIds = new Set(nodes.map(n => n.id));

    // Add data relationships for instances (only if both nodes exist)
    data.relationships?.forEach(rel => {
      const sourceId = `instance:${rel.source}`;
      const targetId = `instance:${rel.target}`;
      
      // Only add link if both nodes exist
      if (nodeIds.has(sourceId) && nodeIds.has(targetId)) {
        links.push({
          source: sourceId,
          target: targetId,
          type: rel.type,
          label: rel.type,
          style: 'data'
        });
      } else {
        console.log('Skipping link - missing node:', rel.source, '→', rel.target);
      }
    });

    console.log('Total links:', links.length);

    const ontologyNodes = nodes.filter(n => n.isOntology);
    const instanceNodes = nodes.filter(n => !n.isOntology);

    setGraphStats({
      nodes: nodes.length,
      links: links.length,
      classes: ontologyNodes.length,
      instances: instanceNodes.length,
      countries: data.countries?.length || 0,
      brands: data.brands?.length || 0,
      chains: data.chains?.length || 0,
      brokers: data.brokers?.length || 0
    });

    if (nodes.length === 0) {
      console.warn('No nodes to display');
      return;
    }

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Add zoom and pan behavior
    const g = svg.append('g');
    
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);

    // Define arrow markers for different link types
    const defs = svg.append('defs');

    // Inheritance arrow (filled blue triangle) - for subClassOf
    defs.append('marker')
      .attr('id', 'arrow-inheritance')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 40)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5Z')
      .attr('fill', '#3b82f6');

    // Instance arrow (dashed) - for instanceOf
    defs.append('marker')
      .attr('id', 'arrow-instance')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 40)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5Z')
      .attr('fill', '#94a3b8');

    // Property arrow (various colors) - for object properties
    const propertyColors = [
      { id: 'green', color: '#10b981' },
      { id: 'orange', color: '#f59e0b' },
      { id: 'purple', color: '#8b5cf6' },
      { id: 'pink', color: '#ec4899' },
      { id: 'cyan', color: '#06b6d4' }
    ];

    propertyColors.forEach(c => {
      defs.append('marker')
        .attr('id', `arrow-property-${c.id}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 40)
        .attr('refY', 0)
        .attr('markerWidth', 7)
        .attr('markerHeight', 7)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', 'none')
        .attr('stroke', c.color)
        .attr('stroke-width', 2);
    });

    // Create force simulation - hierarchical layout like Protégé
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id)
        .distance(d => {
          // Different distances for different link types
          if (d.style === 'inheritance') return 180;
          if (d.style === 'instance') return 120;
          if (d.style === 'property') return 200;
          return 150;
        })
        .strength(d => {
          if (d.style === 'inheritance') return 0.8;
          if (d.style === 'instance') return 0.5;
          return 0.6;
        })
      )
      .force('charge', d3.forceManyBody().strength(d => {
        // Stronger repulsion for ontology nodes
        return d.isOntology ? -1500 : -800;
      }))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.isOntology ? 100 : 80))
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(d => {
        // Hierarchical positioning by level
        if (d.id === 'owl:Thing') return height * 0.15;
        if (['Location', 'Organization', 'Product'].includes(d.id)) return height * 0.3;
        if (d.isOntology) return height * 0.45;
        return height * 0.65;
      }).strength(0.1));

    // Draw links with different styles
    const linkElements = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', d => {
        if (d.style === 'inheritance') return '#3b82f6'; // Blue for subClassOf
        if (d.style === 'instance') return '#94a3b8'; // Gray for instanceOf
        if (d.style === 'property') {
          // Different colors for different properties
          const colorMap = {
            'produces': '#10b981',
            'isLocatedIn': '#06b6d4',
            'operatesIn': '#8b5cf6',
            'suppliesTo': '#ec4899',
            'buysFrom': '#f59e0b'
          };
          return colorMap[d.type] || '#6b7280';
        }
        return '#94a3b8';
      })
      .attr('stroke-width', d => {
        if (d.style === 'inheritance') return 3;
        if (d.style === 'instance') return 1.5;
        return 2;
      })
      .attr('stroke-dasharray', d => {
        if (d.style === 'instance') return '5,5'; // Dashed for instanceOf
        return '0';
      })
      .attr('stroke-opacity', d => d.style === 'instance' ? 0.4 : 0.7)
      .attr('marker-end', d => {
        if (d.style === 'inheritance') return 'url(#arrow-inheritance)';
        if (d.style === 'instance') return 'url(#arrow-instance)';
        if (d.style === 'property') {
          const colorMap = {
            'produces': 'green',
            'isLocatedIn': 'cyan',
            'operatesIn': 'purple',
            'suppliesTo': 'pink',
            'buysFrom': 'orange'
          };
          const colorId = colorMap[d.type] || 'green';
          return `url(#arrow-property-${colorId})`;
        }
        return '';
      });

    // Draw link labels (only for important relationships)
    const linkLabels = g.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(links.filter(d => d.style !== 'instance')) // Don't show labels for instanceOf
      .enter().append('text')
      .attr('class', 'link-label')
      .attr('font-size', d => d.style === 'inheritance' ? '10px' : '9px')
      .attr('fill', d => {
        if (d.style === 'inheritance') return '#3b82f6';
        if (d.style === 'property') {
          const colorMap = {
            'produces': '#10b981',
            'isLocatedIn': '#06b6d4',
            'operatesIn': '#8b5cf6',
            'suppliesTo': '#ec4899',
            'buysFrom': '#f59e0b'
          };
          return colorMap[d.type] || '#6b7280';
        }
        return '#6b7280';
      })
      .attr('font-weight', d => d.style === 'inheritance' ? 'bold' : 'normal')
      .attr('text-anchor', 'middle')
      .attr('dy', -10)
      .style('pointer-events', 'none')
      .text(d => d.label);

    // Draw nodes as groups
    const nodeElements = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Node shapes - different for ontology classes vs instances
    nodeElements.append('rect')
      .attr('x', d => d.isOntology ? -70 : -60)
      .attr('y', d => d.isOntology ? -35 : -30)
      .attr('width', d => d.isOntology ? 140 : 120)
      .attr('height', d => d.isOntology ? 70 : 60)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', d => d.color)
      .attr('stroke', d => d.isOntology ? '#1e293b' : '#fff')
      .attr('stroke-width', d => d.isOntology ? 3 : 4)
      .style('filter', 'drop-shadow(0px 3px 6px rgba(0,0,0,0.25))');

    // Add icon for owl:Thing
    nodeElements.filter(d => d.id === 'owl:Thing')
      .append('circle')
      .attr('cx', -50)
      .attr('cy', -20)
      .attr('r', 8)
      .attr('fill', '#fbbf24')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Node labels
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 0)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .style('pointer-events', 'none')
      .each(function(d) {
        // Wrap long text
        const text = d3.select(this);
        const words = d.label.split(/\s+/);
        
        if (words.length === 1 && d.label.length > 12) {
          // Break long single words
          const label = d.label;
          if (label.length > 24) {
            text.text(label.substring(0, 10) + '...');
          } else if (label.length > 12) {
            const mid = Math.floor(label.length / 2);
            text.append('tspan')
              .attr('x', 0)
              .attr('dy', '-0.3em')
              .text(label.substring(0, mid));
            text.append('tspan')
              .attr('x', 0)
              .attr('dy', '1.2em')
              .text(label.substring(mid));
          } else {
            text.text(label);
          }
        } else if (words.length > 1) {
          // Multi-word wrapping
          text.text('');
          const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
          const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
          
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', '-0.3em')
            .text(line1.length > 12 ? line1.substring(0, 12) + '...' : line1);
          
          if (line2) {
            text.append('tspan')
              .attr('x', 0)
              .attr('dy', '1.2em')
              .text(line2.length > 12 ? line2.substring(0, 12) + '...' : line2);
          }
        } else {
          text.text(d.label);
        }
      });

    // Type badge
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 28)
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', '#fff')
      .attr('opacity', 0.8)
      .style('pointer-events', 'none')
      .text(d => d.type);

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'network-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.9)')
      .style('color', 'white')
      .style('padding', '12px')
      .style('border-radius', '8px')
      .style('font-size', '13px')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    nodeElements.on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0.95);
      
      let tooltipHtml = `<strong style="color: ${d.color}; font-size: 15px;">${d.label}</strong><br/>`;
      tooltipHtml += `<em style="color: #94a3b8;">Type: ${d.type}</em><br/><br/>`;
      
      // Find connections
      const outgoing = validLinks.filter(l => l.source.id === d.id);
      const incoming = validLinks.filter(l => l.target.id === d.id);
      
      if (outgoing.length > 0) {
        tooltipHtml += `<span style="color: #10b981;">Outgoing (${outgoing.length}):</span><br/>`;
        outgoing.slice(0, 5).forEach(l => {
          tooltipHtml += `→ ${l.type} → ${l.target.label}<br/>`;
        });
        if (outgoing.length > 5) tooltipHtml += `... and ${outgoing.length - 5} more<br/>`;
      }
      
      if (incoming.length > 0) {
        tooltipHtml += `<br/><span style="color: #3b82f6;">Incoming (${incoming.length}):</span><br/>`;
        incoming.slice(0, 5).forEach(l => {
          tooltipHtml += `← ${l.type} ← ${l.source.label}<br/>`;
        });
        if (incoming.length > 5) tooltipHtml += `... and ${incoming.length - 5} more<br/>`;
      }
      
      tooltip.html(tooltipHtml)
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 28) + 'px');
      
      // Highlight node
      d3.select(event.currentTarget).select('rect')
        .attr('stroke', '#fbbf24')
        .attr('stroke-width', 6);

      // Highlight connected links
      linkElements
        .attr('stroke', l => (l.source.id === d.id || l.target.id === d.id) ? d.color : '#94a3b8')
        .attr('stroke-width', l => (l.source.id === d.id || l.target.id === d.id) ? 3 : 2)
        .attr('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.3);
    })
    .on('mouseout', (event, d) => {
      tooltip.transition().duration(500).style('opacity', 0);
      
      d3.select(event.currentTarget).select('rect')
        .attr('stroke', '#fff')
        .attr('stroke-width', 4);

      // Reset link highlighting
      linkElements
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.6);
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      linkElements
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      linkLabels
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);

      nodeElements
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [data]);

  if (loading) {
    return (
      <div className="visualization-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading network visualization...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="visualization-page">
        <div className="error">
          <h2>Error loading data</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="visualization-page">
      {/* Full-width header */}
      <div className="page-header">
        <h1>Network Visualization</h1>
        <p>Interactive graph like Protégé OntoGraf - drag, zoom, and explore relationships</p>
        {graphStats && (
          <div className="graph-stats">
            <span>Total Nodes: {graphStats.nodes}</span>
            <span>•</span>
            <span>Links: {graphStats.links}</span>
            <span>•</span>
            <span>Classes: {graphStats.classes}</span>
            <span>•</span>
            <span>Instances: {graphStats.instances}</span>
          </div>
        )}
      </div>

      {/* Two-column layout: sidebar + graph */}
      <div className="content-grid">
        {/* Left sidebar - narrow */}
        <div className="sidebar-panel">
          <div className="legend-card">
            <h3>Ontology Classes</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#22c55e' }}></div>
                <span>owl:Thing</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#94a3b8' }}></div>
                <span>Abstract Classes</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#10b981' }}></div>
                <span>Location Classes</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#3b82f6' }}></div>
                <span>Organization</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#f59e0b' }}></div>
                <span>Product Classes</span>
              </div>
            </div>
          </div>

          <div className="legend-card">
            <h3>Relationships</h3>
            <div className="legend-items">
              <div className="legend-item">
                <svg width="50" height="20">
                  <line x1="0" y1="10" x2="40" y2="10" stroke="#3b82f6" strokeWidth="3"/>
                  <polygon points="40,10 35,7 35,13" fill="#3b82f6"/>
                </svg>
                <span>subClassOf</span>
              </div>
              <div className="legend-item">
                <svg width="50" height="20">
                  <line x1="0" y1="10" x2="40" y2="10" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5,5"/>
                  <polygon points="40,10 35,7 35,13" fill="#94a3b8"/>
                </svg>
                <span>instanceOf</span>
              </div>
              <div className="legend-item">
                <svg width="50" height="20">
                  <line x1="0" y1="10" x2="40" y2="10" stroke="#10b981" strokeWidth="2"/>
                  <polygon points="40,10 35,7 35,13" fill="none" stroke="#10b981" strokeWidth="2"/>
                </svg>
                <span>Properties</span>
              </div>
            </div>
          </div>

          <div className="legend-card">
            <h3>Controls</h3>
            <div className="control-info">
              <p>🖱️ Drag nodes to move</p>
              <p>🔍 Scroll to zoom</p>
              <p>✋ Drag background to pan</p>
              <p>💡 Hover for details</p>
              <p>🔗 Colored links = different properties</p>
            </div>
          </div>
        </div>

        {/* Right graph - wide */}
        <div className="graph-panel">
          <div className="graph-container" ref={containerRef}>
            <svg ref={svgRef}></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
