import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/Visualization.css';

const Visualization = () => {
  const { data, loading, error } = useRDFData();
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

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

    // Create links from relationships
    const links = data.relationships?.map(rel => ({
      source: rel.source,
      target: rel.target,
      type: rel.type
    })) || [];

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

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
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)');

    // Create nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', 20)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node.append('text')
      .text(d => d.id)
      .attr('x', 0)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#333');

    // Add tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'graph-tooltip')
      .style('opacity', 0);

    node.on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(`<strong>${d.id}</strong><br/>Type: ${d.type}`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => {
      tooltip.transition().duration(500).style('opacity', 0);
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

  if (loading) return <div className="loading">Loading visualization...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  return (
    <div className="visualization-page">
      <div className="viz-header">
        <h1>Network Visualization</h1>
        <p>Interactive graph showing relationships in the coffee supply chain</p>
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

      <div className="visualization-container">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default Visualization;
