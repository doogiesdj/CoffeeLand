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

    console.log('Visualization data:', data);

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const container = containerRef.current;
    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 700;

    console.log('SVG dimensions:', width, height);

    // Create nodes from all entities
    const nodes = [];
    const addNodes = (entities, type, color) => {
      entities?.forEach(entity => {
        nodes.push({ id: entity.name, type, color, ...entity });
      });
    };

    addNodes(data.countries, 'Country', '#10b981');
    addNodes(data.brands, 'Brand', '#f59e0b');
    addNodes(data.chains, 'Chain', '#3b82f6');
    addNodes(data.brokers, 'Broker', '#8b5cf6');

    console.log('Nodes:', nodes.length, nodes);

    // Create links from relationships
    const links = data.relationships?.map(rel => ({
      source: rel.source,
      target: rel.target,
      type: rel.type
    })) || [];

    console.log('Links:', links.length, links);

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

    // If no data, show message
    if (nodes.length === 0) {
      console.warn('No nodes to display');
      return;
    }

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Add zoom behavior
    const g = svg.append('g');
    
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);

    // Create force simulation - spread nodes more to fill the space
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(validLinks).id(d => d.id).distance(200))
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    // Create arrow marker for links
    svg.append('defs').selectAll('marker')
      .data(['arrow'])
      .enter().append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(validLinks)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)');

    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', 20)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 3);

    node.append('text')
      .text(d => d.id.length > 15 ? d.id.substring(0, 12) + '...' : d.id)
      .attr('x', 0)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#333')
      .attr('font-weight', '600');

    // Add tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'graph-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('pointer-events', 'none');

    node.on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(`<strong>${d.id}</strong><br/>Type: ${d.type}`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
      
      // Highlight node
      d3.select(event.currentTarget).select('circle')
        .attr('stroke-width', 5)
        .attr('stroke', '#fbbf24');
    })
    .on('mouseout', (event) => {
      tooltip.transition().duration(500).style('opacity', 0);
      
      // Reset node
      d3.select(event.currentTarget).select('circle')
        .attr('stroke-width', 3)
        .attr('stroke', '#fff');
    });

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
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
          <p>Loading ontology visualization...</p>
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
      <div className="viz-header">
        <h1>Network Visualization</h1>
        <p>Interactive graph showing relationships in the coffee supply chain</p>
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
      
      <div className="legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
          <span>Countries</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
          <span>Brands</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
          <span>Chains</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></span>
          <span>Brokers</span>
        </div>
      </div>

      <div className="viz-controls">
        <p>💡 Tip: Drag nodes to rearrange • Scroll to zoom • Pan by dragging background</p>
      </div>

      <div className="visualization-container" ref={containerRef}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default Visualization;
