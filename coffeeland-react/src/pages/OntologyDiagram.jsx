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
    const height = 4000;

    console.log('Ontology container dimensions:', width, height);

    // Define ontology classes as nodes
    const nodes = [
      { id: 'Location', label: 'Location', type: 'abstract', color: '#94a3b8' },
      { id: 'Country', label: 'Country', type: 'class', color: '#10b981' },
      { id: 'City', label: 'City', type: 'class', color: '#14b8a6' },
      { id: 'Capital', label: 'Capital', type: 'class', color: '#06b6d4' },
      { id: 'Organization', label: 'Organization', type: 'abstract', color: '#94a3b8' },
      { id: 'CoffeeChain', label: 'CoffeeChain', type: 'class', color: '#3b82f6' },
      { id: 'Broker', label: 'Broker', type: 'class', color: '#8b5cf6' },
      { id: 'Product', label: 'Product', type: 'abstract', color: '#94a3b8' },
      { id: 'CoffeeBrand', label: 'CoffeeBrand', type: 'class', color: '#f59e0b' },
      { id: 'CoffeeBean', label: 'CoffeeBean', type: 'class', color: '#f97316' }
    ];

    const links = [
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

    // Add zoom and pan behavior
    const g = svg.append('g');
    
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);

    // Define arrow markers
    const defs = svg.append('defs');

    // Inheritance arrow (filled triangle)
    defs.append('marker')
      .attr('id', 'arrow-inheritance')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 35)
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
      .attr('refX', 35)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2);

    // Create force simulation - like Protégé OntoGraf
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(200).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(80))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    // Draw links
    const linkElements = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', d => d.style === 'property' ? '#3b82f6' : '#64748b')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => d.style === 'property' ? '0' : '5,5')
      .attr('marker-end', d => d.style === 'property' ? 'url(#arrow-property)' : 'url(#arrow-inheritance)');

    // Draw link labels
    const linkLabels = g.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(links)
      .enter().append('text')
      .attr('class', 'link-label')
      .attr('font-size', '10px')
      .attr('fill', '#6b7280')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .text(d => d.label);

    // Draw nodes
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

    // Node rectangles
    nodeElements.append('rect')
      .attr('x', -60)
      .attr('y', -30)
      .attr('width', 120)
      .attr('height', 60)
      .attr('rx', 8)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))');

    // Dashed border for abstract classes
    nodeElements.filter(d => d.type === 'abstract')
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

    // Node labels
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .style('pointer-events', 'none')
      .text(d => d.label);

    // Abstract type indicator
    nodeElements.filter(d => d.type === 'abstract')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -12)
      .attr('font-size', '10px')
      .attr('font-style', 'italic')
      .attr('fill', '#fff')
      .style('pointer-events', 'none')
      .text('«abstract»');

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'ontology-tooltip')
      .style('opacity', 0);

    nodeElements.on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0.95);
      
      let tooltipHtml = `<strong>${d.label}</strong><br/>`;
      tooltipHtml += `Type: ${d.type === 'abstract' ? 'Abstract Class' : 'Class'}<br/>`;
      
      const outgoing = links.filter(r => r.source.id === d.id && r.style === 'property');
      const incoming = links.filter(r => r.target.id === d.id && r.style === 'property');
      
      if (outgoing.length > 0) {
        tooltipHtml += `<br/><em>Properties:</em><br/>`;
        outgoing.forEach(r => {
          tooltipHtml += `→ ${r.label}<br/>`;
        });
      }
      
      tooltip.html(tooltipHtml)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
      
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
  }, []);

  return (
    <div className="ontology-page">
      {/* Full-width header */}
      <div className="page-header">
        <h1>Ontology Class Diagram</h1>
        <p>Interactive VOWL-style visualization like Protégé OntoGraf</p>
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

          <div className="legend-card">
            <h3>Controls</h3>
            <div className="control-info">
              <p>🖱️ Drag nodes to move</p>
              <p>🔍 Scroll to zoom</p>
              <p>✋ Drag background to pan</p>
              <p>💡 Hover for details</p>
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
