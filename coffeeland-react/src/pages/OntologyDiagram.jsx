import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../styles/OntologyDiagram.css';

const OntologyDiagram = () => {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const container = containerRef.current;
    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 700;

    // Calculate center - use more horizontal space
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Spread nodes more horizontally to fill the space
    const horizontalSpread = Math.min(width * 0.35, 450);
    const verticalSpread = Math.min(height * 0.3, 280);

    // Define ontology structure (VOWL style) - spread out layout
    const classes = [
      { id: 'Location', label: 'Location', type: 'abstract', color: '#94a3b8', x: centerX - horizontalSpread * 0.8, y: centerY - verticalSpread * 1.2 },
      { id: 'Country', label: 'Country', type: 'class', color: '#10b981', x: centerX - horizontalSpread * 1.1, y: centerY - verticalSpread * 0.4 },
      { id: 'City', label: 'City', type: 'class', color: '#14b8a6', x: centerX - horizontalSpread * 0.5, y: centerY - verticalSpread * 0.4 },
      { id: 'Capital', label: 'Capital', type: 'class', color: '#06b6d4', x: centerX - horizontalSpread * 0.25, y: centerY + verticalSpread * 0.1 },
      
      { id: 'Organization', label: 'Organization', type: 'abstract', color: '#94a3b8', x: centerX + horizontalSpread * 0.6, y: centerY - verticalSpread * 1.2 },
      { id: 'CoffeeChain', label: 'CoffeeChain', type: 'class', color: '#3b82f6', x: centerX + horizontalSpread * 0.3, y: centerY - verticalSpread * 0.4 },
      { id: 'Broker', label: 'Broker', type: 'class', color: '#8b5cf6', x: centerX + horizontalSpread * 0.9, y: centerY - verticalSpread * 0.4 },
      
      { id: 'Product', label: 'Product', type: 'abstract', color: '#94a3b8', x: centerX, y: centerY + verticalSpread * 0.5 },
      { id: 'CoffeeBrand', label: 'CoffeeBrand', type: 'class', color: '#f59e0b', x: centerX - horizontalSpread * 0.3, y: centerY + verticalSpread * 1.1 },
      { id: 'CoffeeBean', label: 'CoffeeBean', type: 'class', color: '#f97316', x: centerX + horizontalSpread * 0.3, y: centerY + verticalSpread * 1.1 }
    ];

    const relationships = [
      // Inheritance (subClassOf)
      { source: 'Country', target: 'Location', type: 'subClassOf', label: 'subClassOf' },
      { source: 'City', target: 'Country', type: 'subClassOf', label: 'subClassOf' },
      { source: 'Capital', target: 'Country', type: 'subClassOf', label: 'subClassOf' },
      { source: 'CoffeeChain', target: 'Organization', type: 'subClassOf', label: 'subClassOf' },
      { source: 'Broker', target: 'Organization', type: 'subClassOf', label: 'subClassOf' },
      { source: 'CoffeeBrand', target: 'Product', type: 'subClassOf', label: 'subClassOf' },
      { source: 'CoffeeBean', target: 'Product', type: 'subClassOf', label: 'subClassOf' },
      
      // Object Properties
      { source: 'Country', target: 'CoffeeBrand', type: 'produces', label: 'produces', style: 'property' },
      { source: 'City', target: 'Country', type: 'isLocatedIn', label: 'isLocatedIn', style: 'property' },
      { source: 'CoffeeChain', target: 'City', type: 'operatesIn', label: 'operatesIn', style: 'property' },
      { source: 'Broker', target: 'CoffeeChain', type: 'suppliesTo', label: 'suppliesTo', style: 'property' },
      { source: 'CoffeeChain', target: 'Broker', type: 'buysFrom', label: 'buysFrom', style: 'property' },
      { source: 'Country', target: 'Capital', type: 'hasMainCapital', label: 'hasMainCapital', style: 'property' },
      { source: 'CoffeeBrand', target: 'City', type: 'hasOriginIn', label: 'hasOriginIn', style: 'property' },
      { source: 'CoffeeBrand', target: 'Country', type: 'isConsumedIn', label: 'isConsumedIn', style: 'property' }
    ];

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Add zoom behavior
    const g = svg.append('g');
    
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);
    
    // No initial zoom - show at full scale
    svg.call(zoom.transform, d3.zoomIdentity);

    // Define arrow markers
    const defs = svg.append('defs');

    // Inheritance arrow (filled triangle)
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
      .attr('fill', '#64748b');

    // Property arrow (open triangle)
    defs.append('marker')
      .attr('id', 'arrow-property')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 40)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2);

    // Draw relationships
    const links = g.append('g')
      .attr('class', 'links')
      .selectAll('g')
      .data(relationships)
      .enter().append('g')
      .attr('class', 'link-group');

    links.append('path')
      .attr('class', d => `link link-${d.type}`)
      .attr('d', d => {
        const sourceNode = classes.find(c => c.id === d.source);
        const targetNode = classes.find(c => c.id === d.target);
        
        if (!sourceNode || !targetNode) return '';
        
        return `M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`;
      })
      .attr('stroke', d => d.style === 'property' ? '#3b82f6' : '#64748b')
      .attr('stroke-width', d => d.style === 'property' ? 2 : 2)
      .attr('stroke-dasharray', d => d.style === 'property' ? '0' : '5,5')
      .attr('fill', 'none')
      .attr('marker-end', d => d.style === 'property' ? 'url(#arrow-property)' : 'url(#arrow-inheritance)');

    // Add labels to relationships
    links.append('text')
      .attr('class', 'link-label')
      .attr('x', d => {
        const sourceNode = classes.find(c => c.id === d.source);
        const targetNode = classes.find(c => c.id === d.target);
        return sourceNode && targetNode ? (sourceNode.x + targetNode.x) / 2 : 0;
      })
      .attr('y', d => {
        const sourceNode = classes.find(c => c.id === d.source);
        const targetNode = classes.find(c => c.id === d.target);
        return sourceNode && targetNode ? (sourceNode.y + targetNode.y) / 2 - 5 : 0;
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', d => d.style === 'property' ? '#1e40af' : '#475569')
      .style('pointer-events', 'none')
      .text(d => d.label);

    // Draw class nodes
    const nodes = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(classes)
      .enter().append('g')
      .attr('class', d => `node node-${d.type}`)
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Class boxes
    nodes.append('rect')
      .attr('x', -60)
      .attr('y', -30)
      .attr('width', 120)
      .attr('height', 60)
      .attr('rx', 8)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))');

    // Abstract class indicator (dashed border)
    nodes.filter(d => d.type === 'abstract')
      .append('rect')
      .attr('x', -60)
      .attr('y', -30)
      .attr('width', 120)
      .attr('height', 60)
      .attr('rx', 8)
      .attr('fill', 'none')
      .attr('stroke', '#475569')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Class labels
    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 5)
      .attr('font-size', '14px')
      .attr('font-weight', '700')
      .attr('fill', '#fff')
      .style('pointer-events', 'none')
      .text(d => d.label);

    // Type indicator for abstract classes
    nodes.filter(d => d.type === 'abstract')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -12)
      .attr('font-size', '10px')
      .attr('font-style', 'italic')
      .attr('fill', '#fff')
      .style('pointer-events', 'none')
      .text('«abstract»');

    // Add tooltips
    const tooltip = d3.select('body').append('div')
      .attr('class', 'ontology-tooltip')
      .style('opacity', 0);

    nodes.on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0.95);
      
      let tooltipHtml = `<strong>${d.label}</strong><br/>`;
      tooltipHtml += `Type: ${d.type === 'abstract' ? 'Abstract Class' : 'Class'}<br/>`;
      
      // Find relationships
      const outgoing = relationships.filter(r => r.source === d.id && r.style === 'property');
      const incoming = relationships.filter(r => r.target === d.id && r.style === 'property');
      
      if (outgoing.length > 0) {
        tooltipHtml += `<br/><em>Properties:</em><br/>`;
        outgoing.forEach(r => {
          tooltipHtml += `→ ${r.label}<br/>`;
        });
      }
      
      tooltip.html(tooltipHtml)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
      
      // Highlight
      d3.select(event.currentTarget).select('rect')
        .attr('stroke', '#fbbf24')
        .attr('stroke-width', 5);
    })
    .on('mouseout', (event) => {
      tooltip.transition().duration(500).style('opacity', 0);
      
      d3.select(event.currentTarget).select('rect')
        .attr('stroke', '#fff')
        .attr('stroke-width', 3);
    });

    return () => {
      tooltip.remove();
    };
  }, []);

  return (
    <div className="ontology-page">
      {/* Full-width header */}
      <div className="page-header">
        <h1>Ontology Class Diagram</h1>
        <p>VOWL-style visualization of the CoffeeLand ontology structure</p>
      </div>

      {/* Two-column layout: sidebar + diagram */}
      <div className="content-grid">
        {/* Left sidebar - narrow */}
        <div className="sidebar-panel">
          <div className="legend-card">
            <h3>Classes</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#94a3b8', border: '2px dashed #475569' }}></div>
                <span>Abstract Class</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#10b981' }}></div>
                <span>Location</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#3b82f6' }}></div>
                <span>Organization</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#f59e0b' }}></div>
                <span>Product</span>
              </div>
            </div>
          </div>

          <div className="legend-card">
            <h3>Relationships</h3>
            <div className="legend-items">
              <div className="legend-item">
                <svg width="50" height="20">
                  <line x1="0" y1="10" x2="40" y2="10" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5"/>
                  <polygon points="40,10 35,7 35,13" fill="#64748b"/>
                </svg>
                <span>subClassOf</span>
              </div>
              <div className="legend-item">
                <svg width="50" height="20">
                  <line x1="0" y1="10" x2="40" y2="10" stroke="#3b82f6" strokeWidth="2"/>
                  <polygon points="40,10 35,7 35,13" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                </svg>
                <span>Property</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right diagram - wide */}
        <div className="diagram-panel">
          <div className="diagram-container" ref={containerRef}>
            <svg ref={svgRef}></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OntologyDiagram;
