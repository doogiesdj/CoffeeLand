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

    // Create nodes from all entities with enhanced properties
    const nodes = [];
    const addNodes = (entities, type, color, shape = 'rect') => {
      entities?.forEach(entity => {
        nodes.push({ 
          id: entity.name, 
          label: entity.name,
          type, 
          color,
          shape,
          ...entity 
        });
      });
    };

    // Different shapes for different types (like Protégé)
    addNodes(data.countries, 'Country', '#10b981', 'rect');
    addNodes(data.brands, 'Brand', '#f59e0b', 'rect');
    addNodes(data.chains, 'Chain', '#3b82f6', 'rect');
    addNodes(data.brokers, 'Broker', '#8b5cf6', 'rect');

    console.log('Total nodes:', nodes.length);

    // Create links from relationships
    const links = data.relationships?.map(rel => ({
      source: rel.source,
      target: rel.target,
      type: rel.type,
      label: rel.type
    })) || [];

    // Filter links to only include nodes that exist
    const nodeIds = new Set(nodes.map(n => n.id));
    const validLinks = links.filter(link => 
      nodeIds.has(link.source) && nodeIds.has(link.target)
    );

    console.log('Valid links:', validLinks.length);

    setGraphStats({
      nodes: nodes.length,
      links: validLinks.length,
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

    // Define arrow markers for directed links
    const defs = svg.append('defs');

    // Create different colored arrows for each node type
    const colors = [
      { id: 'green', color: '#10b981' },
      { id: 'orange', color: '#f59e0b' },
      { id: 'blue', color: '#3b82f6' },
      { id: 'purple', color: '#8b5cf6' },
      { id: 'gray', color: '#6b7280' }
    ];

    colors.forEach(c => {
      defs.append('marker')
        .attr('id', `arrow-${c.id}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 40)
        .attr('refY', 0)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', 'none')
        .attr('stroke', c.color)
        .attr('stroke-width', 2);
    });

    // Create force simulation - Protégé OntoGraf style
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(validLinks).id(d => d.id).distance(250).strength(0.7))
      .force('charge', d3.forceManyBody().strength(-1200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(100))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    // Draw links
    const linkElements = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(validLinks)
      .enter().append('line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', 'url(#arrow-gray)');

    // Draw link labels
    const linkLabels = g.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(validLinks)
      .enter().append('text')
      .attr('class', 'link-label')
      .attr('font-size', '11px')
      .attr('fill', '#6b7280')
      .attr('text-anchor', 'middle')
      .attr('dy', -8)
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

    // Node shapes - rectangles with rounded corners (like Protégé)
    nodeElements.append('rect')
      .attr('x', -70)
      .attr('y', -35)
      .attr('width', 140)
      .attr('height', 70)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 4)
      .style('filter', 'drop-shadow(0px 3px 6px rgba(0,0,0,0.25))');

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
            <span>Nodes: {graphStats.nodes}</span>
            <span>•</span>
            <span>Links: {graphStats.links}</span>
            <span>•</span>
            <span>Countries: {graphStats.countries}</span>
            <span>•</span>
            <span>Brands: {graphStats.brands}</span>
            <span>•</span>
            <span>Chains: {graphStats.chains}</span>
            <span>•</span>
            <span>Brokers: {graphStats.brokers}</span>
          </div>
        )}
      </div>

      {/* Two-column layout: sidebar + graph */}
      <div className="content-grid">
        {/* Left sidebar - narrow */}
        <div className="sidebar-panel">
          <div className="legend-card">
            <h3>Node Types</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#10b981' }}></div>
                <span>Countries</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#f59e0b' }}></div>
                <span>Brands</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#3b82f6' }}></div>
                <span>Chains</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#8b5cf6' }}></div>
                <span>Brokers</span>
              </div>
            </div>
          </div>

          <div className="legend-card">
            <h3>Controls</h3>
            <div className="control-info">
              <p>🖱️ Drag nodes to move</p>
              <p>🔍 Scroll to zoom</p>
              <p>✋ Drag background to pan</p>
              <p>💡 Hover for connections</p>
              <p>🎯 Click to focus</p>
            </div>
          </div>

          <div className="legend-card">
            <h3>Graph Info</h3>
            <div className="control-info">
              <p>📊 Force-directed layout</p>
              <p>🔗 Relationship arrows</p>
              <p>🏷️ Node type badges</p>
              <p>💫 Dynamic positioning</p>
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
