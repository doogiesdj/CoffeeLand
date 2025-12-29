import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useRDFData } from '../hooks/useRDFData';
import '../styles/OntologyDiagram.css';

const OntologyDiagram = () => {
  const svgRef = useRef();
  const containerRef = useRef();
  const { data, loading, error } = useRDFData();
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [allNodes, setAllNodes] = useState([]);
  const [allLinks, setAllLinks] = useState([]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !data) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const container = containerRef.current;
    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 900;

    console.log('Ontology container dimensions:', width, height);

    // Define ontology classes as nodes (from RDF structure) - Complete 30-class hierarchy
    const baseNodes = [
      // Top-level abstract classes (4)
      { id: 'Location', label: 'Location', type: 'abstract', color: '#94a3b8', isClass: true },
      { id: 'Organization', label: 'Organization', type: 'abstract', color: '#94a3b8', isClass: true },
      { id: 'Product', label: 'Product', type: 'abstract', color: '#94a3b8', isClass: true },
      { id: 'QualityAndProcessing', label: 'Quality & Processing', type: 'abstract', color: '#8b5cf6', isClass: true },
      { id: 'MarketAndEconomics', label: 'Market & Economics', type: 'abstract', color: '#f59e0b', isClass: true },
      
      // Location hierarchy (7 classes)
      { id: 'Country', label: 'Country', type: 'class', color: '#10b981', isClass: true },
      { id: 'City', label: 'City', type: 'class', color: '#14b8a6', isClass: true },
      { id: 'Capital', label: 'Capital', type: 'class', color: '#06b6d4', isClass: true },
      { id: 'Farm', label: 'Farm', type: 'class', color: '#059669', isClass: true },
      { id: 'Port', label: 'Port', type: 'class', color: '#0891b2', isClass: true },
      { id: 'Warehouse', label: 'Warehouse', type: 'class', color: '#64748b', isClass: true },
      
      // Organization hierarchy (10 classes)
      { id: 'CoffeeChain', label: 'CoffeeChain', type: 'class', color: '#3b82f6', isClass: true },
      { id: 'Broker', label: 'Broker', type: 'abstract', color: '#8b5cf6', isClass: true },
      { id: 'ExportBroker', label: 'ExportBroker', type: 'class', color: '#a855f7', isClass: true },
      { id: 'ImportBroker', label: 'ImportBroker', type: 'class', color: '#c084fc', isClass: true },
      { id: 'LogisticsProvider', label: 'LogisticsProvider', type: 'class', color: '#d946ef', isClass: true },
      { id: 'Cooperative', label: 'Cooperative', type: 'class', color: '#14b8a6', isClass: true },
      { id: 'Farmer', label: 'Farmer', type: 'class', color: '#10b981', isClass: true },
      { id: 'Roaster', label: 'Roaster', type: 'class', color: '#f97316', isClass: true },
      { id: 'ProcessingMill', label: 'ProcessingMill', type: 'class', color: '#7c3aed', isClass: true },
      { id: 'Retailer', label: 'Retailer', type: 'class', color: '#2563eb', isClass: true },
      
      // Product hierarchy (2 classes)
      { id: 'CoffeeBrand', label: 'CoffeeBrand', type: 'class', color: '#f59e0b', isClass: true },
      { id: 'CoffeeVariety', label: 'CoffeeVariety', type: 'class', color: '#f97316', isClass: true },
      
      // Quality & Processing (3 classes)
      { id: 'Certification', label: 'Certification', type: 'class', color: '#84cc16', isClass: true },
      { id: 'ProcessingMethod', label: 'ProcessingMethod', type: 'class', color: '#a855f7', isClass: true },
      { id: 'QualityGrade', label: 'QualityGrade', type: 'class', color: '#c084fc', isClass: true },
      
      // Market & Economics (4 classes)
      { id: 'Consumer', label: 'Consumer', type: 'class', color: '#eab308', isClass: true },
      { id: 'Price', label: 'Price', type: 'class', color: '#f59e0b', isClass: true },
      { id: 'TradeAgreement', label: 'TradeAgreement', type: 'class', color: '#d97706', isClass: true },
      { id: 'Season', label: 'Season/Harvest', type: 'class', color: '#ca8a04', isClass: true }
    ];

    // Function to get instances for a class
    const getInstancesForClass = (classId) => {
      switch(classId) {
        // Location entities
        case 'Country':
          return (data.countries || []).map(c => ({
            id: `instance_${c.name}`,
            label: c.name,
            type: 'instance',
            color: '#10b981',
            parentClass: 'Country',
            isClass: false
          }));
        case 'City':
          return (data.cities || []).map(c => ({
            id: `instance_${c.name}`,
            label: c.name,
            type: 'instance',
            color: '#14b8a6',
            parentClass: 'City',
            isClass: false
          }));
        case 'Capital':
          return (data.capitals || []).map(c => ({
            id: `instance_${c.name}`,
            label: c.name,
            type: 'instance',
            color: '#06b6d4',
            parentClass: 'Capital',
            isClass: false
          }));
        case 'Farm':
          return (data.farms || []).map(f => ({
            id: `instance_${f.name}`,
            label: f.name,
            type: 'instance',
            color: '#059669',
            parentClass: 'Farm',
            isClass: false
          }));
        case 'Port':
          return (data.ports || []).map(p => ({
            id: `instance_${p.name}`,
            label: p.name,
            type: 'instance',
            color: '#0891b2',
            parentClass: 'Port',
            isClass: false
          }));
        case 'Warehouse':
          return (data.warehouses || []).map(w => ({
            id: `instance_${w.name}`,
            label: w.name,
            type: 'instance',
            color: '#64748b',
            parentClass: 'Warehouse',
            isClass: false
          }));
          
        // Organization entities
        case 'CoffeeChain':
          return (data.chains || []).map(c => ({
            id: `instance_${c.name}`,
            label: c.name,
            type: 'instance',
            color: '#3b82f6',
            parentClass: 'CoffeeChain',
            isClass: false
          }));
        case 'Cooperative':
          return (data.cooperatives || []).map(c => ({
            id: `instance_${c.name}`,
            label: c.name,
            type: 'instance',
            color: '#14b8a6',
            parentClass: 'Cooperative',
            isClass: false
          }));
        case 'Farmer':
          return (data.farmers || []).map(f => ({
            id: `instance_${f.name}`,
            label: f.name,
            type: 'instance',
            color: '#10b981',
            parentClass: 'Farmer',
            isClass: false
          }));
        case 'Roaster':
          return (data.roasters || []).map(r => ({
            id: `instance_${r.name}`,
            label: r.name,
            type: 'instance',
            color: '#f97316',
            parentClass: 'Roaster',
            isClass: false
          }));
        case 'ProcessingMill':
          return (data.processingMills || []).map(p => ({
            id: `instance_${p.name}`,
            label: p.name,
            type: 'instance',
            color: '#7c3aed',
            parentClass: 'ProcessingMill',
            isClass: false
          }));
        case 'Retailer':
          return (data.retailers || []).map(r => ({
            id: `instance_${r.name}`,
            label: r.name,
            type: 'instance',
            color: '#2563eb',
            parentClass: 'Retailer',
            isClass: false
          }));
        case 'ExportBroker':
        case 'ImportBroker':
        case 'LogisticsProvider':
          return (data.brokers || []).map(b => ({
            id: `instance_${b.name}_${classId}`,
            label: b.name,
            type: 'instance',
            color: classId === 'ExportBroker' ? '#a855f7' : (classId === 'ImportBroker' ? '#c084fc' : '#d946ef'),
            parentClass: classId,
            isClass: false
          }));
          
        // Product entities
        case 'CoffeeBrand':
          return (data.brands || []).map(b => ({
            id: `instance_${b.name}`,
            label: b.name,
            type: 'instance',
            color: '#f59e0b',
            parentClass: 'CoffeeBrand',
            isClass: false
          }));
        case 'CoffeeVariety':
          return (data.varieties || []).map(v => ({
            id: `instance_${v.name}`,
            label: v.name,
            type: 'instance',
            color: '#f97316',
            parentClass: 'CoffeeVariety',
            isClass: false
          }));
          
        // Quality & Processing
        case 'Certification':
          return (data.certifications || []).map(c => ({
            id: `instance_${c.name}`,
            label: c.name,
            type: 'instance',
            color: '#84cc16',
            parentClass: 'Certification',
            isClass: false
          }));
        case 'ProcessingMethod':
          return (data.processingMethods || []).map(p => ({
            id: `instance_${p.name}`,
            label: p.name,
            type: 'instance',
            color: '#a855f7',
            parentClass: 'ProcessingMethod',
            isClass: false
          }));
        case 'QualityGrade':
          return (data.qualityGrades || []).map(q => ({
            id: `instance_${q.name}`,
            label: q.name,
            type: 'instance',
            color: '#c084fc',
            parentClass: 'QualityGrade',
            isClass: false
          }));
          
        // Market & Economics
        case 'Consumer':
          return (data.consumers || []).map(c => ({
            id: `instance_${c.name}`,
            label: c.name,
            type: 'instance',
            color: '#eab308',
            parentClass: 'Consumer',
            isClass: false
          }));
        case 'Price':
          return (data.prices || []).map(p => ({
            id: `instance_${p.name}`,
            label: p.name,
            type: 'instance',
            color: '#f59e0b',
            parentClass: 'Price',
            isClass: false
          }));
        case 'TradeAgreement':
          return (data.tradeAgreements || []).map(t => ({
            id: `instance_${t.name}`,
            label: t.name,
            type: 'instance',
            color: '#d97706',
            parentClass: 'TradeAgreement',
            isClass: false
          }));
        case 'Season':
          return (data.seasons || []).map(s => ({
            id: `instance_${s.name}`,
            label: s.name,
            type: 'instance',
            color: '#ca8a04',
            parentClass: 'Season',
            isClass: false
          }));
          
        default:
          return [];
      }
    };

    // Build nodes based on expanded state
    let nodes = [...baseNodes];
    let instanceLinks = [];

    expandedNodes.forEach(classId => {
      const instances = getInstancesForClass(classId);
      nodes = [...nodes, ...instances];
      
      // Create links from instances to their class
      instances.forEach(inst => {
        instanceLinks.push({
          source: inst.id,
          target: classId,
          type: 'instanceOf',
          label: 'instanceOf',
          style: 'instance'
        });
      });
    });

    const baseLinks = [
      // Inheritance (subClassOf) - Complete hierarchy from RDF
      
      // Location hierarchy (no parent = top-level)
      { source: 'Country', target: 'Location', type: 'subClassOf', label: 'subClassOf' },
      { source: 'City', target: 'Country', type: 'subClassOf', label: 'subClassOf' },
      { source: 'Capital', target: 'Country', type: 'subClassOf', label: 'subClassOf' },
      { source: 'Farm', target: 'Location', type: 'subClassOf', label: 'subClassOf' },
      { source: 'Port', target: 'Location', type: 'subClassOf', label: 'subClassOf' },
      { source: 'Warehouse', target: 'Location', type: 'subClassOf', label: 'subClassOf' },
      
      // Organization hierarchy
      { source: 'CoffeeChain', target: 'Organization', type: 'subClassOf', label: 'subClassOf' },
      { source: 'Broker', target: 'Organization', type: 'subClassOf', label: 'subClassOf' },
      { source: 'ExportBroker', target: 'Broker', type: 'subClassOf', label: 'subClassOf' },
      { source: 'ImportBroker', target: 'Broker', type: 'subClassOf', label: 'subClassOf' },
      { source: 'LogisticsProvider', target: 'Broker', type: 'subClassOf', label: 'subClassOf' },
      { source: 'Cooperative', target: 'Organization', type: 'subClassOf', label: 'subClassOf' },
      { source: 'Farmer', target: 'Organization', type: 'subClassOf', label: 'subClassOf' },
      { source: 'Roaster', target: 'Organization', type: 'subClassOf', label: 'subClassOf' },
      { source: 'ProcessingMill', target: 'Organization', type: 'subClassOf', label: 'subClassOf' },
      { source: 'Retailer', target: 'Organization', type: 'subClassOf', label: 'subClassOf' },
      
      // Product hierarchy
      { source: 'CoffeeBrand', target: 'Product', type: 'subClassOf', label: 'subClassOf' },
      { source: 'CoffeeVariety', target: 'Product', type: 'subClassOf', label: 'subClassOf' },
      
      // Quality & Processing hierarchy
      { source: 'Certification', target: 'QualityAndProcessing', type: 'subClassOf', label: 'subClassOf' },
      { source: 'ProcessingMethod', target: 'QualityAndProcessing', type: 'subClassOf', label: 'subClassOf' },
      { source: 'QualityGrade', target: 'QualityAndProcessing', type: 'subClassOf', label: 'subClassOf' },
      
      // Market & Economics hierarchy
      { source: 'Consumer', target: 'MarketAndEconomics', type: 'subClassOf', label: 'subClassOf' },
      { source: 'Price', target: 'MarketAndEconomics', type: 'subClassOf', label: 'subClassOf' },
      { source: 'TradeAgreement', target: 'MarketAndEconomics', type: 'subClassOf', label: 'subClassOf' },
      { source: 'Season', target: 'MarketAndEconomics', type: 'subClassOf', label: 'subClassOf' },
      
      // Object Properties (key relationships from RDF)
      { source: 'Country', target: 'CoffeeBrand', type: 'produces', label: 'produces', style: 'property' },
      { source: 'City', target: 'Country', type: 'isLocatedIn', label: 'isLocatedIn', style: 'property' },
      { source: 'CoffeeChain', target: 'City', type: 'operatesIn', label: 'operatesIn', style: 'property' },
      { source: 'Broker', target: 'CoffeeChain', type: 'suppliesTo', label: 'suppliesTo', style: 'property' },
      { source: 'CoffeeChain', target: 'Broker', type: 'buysFrom', label: 'buysFrom', style: 'property' },
      { source: 'Country', target: 'Capital', type: 'hasMainCapital', label: 'hasMainCapital', style: 'property' },
      { source: 'CoffeeBrand', target: 'City', type: 'hasOriginIn', label: 'hasOriginIn', style: 'property' },
      { source: 'CoffeeBrand', target: 'Country', type: 'isConsumedIn', label: 'isConsumedIn', style: 'property' },
      { source: 'CoffeeBrand', target: 'CoffeeVariety', type: 'usesVariety', label: 'usesVariety', style: 'property' },
      { source: 'Certification', target: 'CoffeeBrand', type: 'verifies', label: 'verifies', style: 'property' },
      { source: 'CoffeeVariety', target: 'Country', type: 'isMainlyCultivatedIn', label: 'isMainlyCultivatedIn', style: 'property' },
      { source: 'ExportBroker', target: 'Country', type: 'isHeadquarteredIn', label: 'isHeadquarteredIn', style: 'property' },
      { source: 'Farm', target: 'CoffeeVariety', type: 'cultivates', label: 'cultivates', style: 'property' },
      { source: 'Farmer', target: 'Farm', type: 'owns', label: 'owns', style: 'property' },
      { source: 'Farmer', target: 'Cooperative', type: 'memberOf', label: 'memberOf', style: 'property' },
      { source: 'Roaster', target: 'CoffeeBrand', type: 'roasts', label: 'roasts', style: 'property' },
      { source: 'ProcessingMill', target: 'CoffeeVariety', type: 'processes', label: 'processes', style: 'property' },
      { source: 'Warehouse', target: 'CoffeeBrand', type: 'stores', label: 'stores', style: 'property' },
      { source: 'Retailer', target: 'CoffeeBrand', type: 'sells', label: 'sells', style: 'property' },
      { source: 'Consumer', target: 'CoffeeBrand', type: 'buys', label: 'buys', style: 'property' },
      { source: 'QualityGrade', target: 'CoffeeBrand', type: 'appliesTo', label: 'appliesTo', style: 'property' },
      { source: 'ProcessingMethod', target: 'CoffeeVariety', type: 'appliedTo', label: 'appliedTo', style: 'property' }
    ];

    const links = [...baseLinks, ...instanceLinks];

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
      .force('center', d3.forceCenter(width / 2, height / 2)) // Center in container
      .force('collision', d3.forceCollide().radius(80))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.08)); // Pull towards center

    // Draw links
    const linkElements = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', d => d.style === 'instance' ? '#10b981' : (d.style === 'property' ? '#3b82f6' : '#64748b'))
      .attr('stroke-width', d => d.style === 'instance' ? 1.5 : 2)
      .attr('stroke-dasharray', d => d.style === 'instance' ? '3,3' : (d.style === 'property' ? '0' : '5,5'))
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

    // Node rectangles (different sizes for classes vs instances)
    nodeElements.append('rect')
      .attr('x', d => d.isClass ? -60 : -50)
      .attr('y', d => d.isClass ? -30 : -20)
      .attr('width', d => d.isClass ? 120 : 100)
      .attr('height', d => d.isClass ? 60 : 40)
      .attr('rx', d => d.isClass ? 8 : 6)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', d => d.isClass ? 3 : 2)
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

    // Add expand/collapse indicator for classes
    nodeElements.filter(d => d.isClass && d.type !== 'abstract')
      .append('circle')
      .attr('cx', 50)
      .attr('cy', -20)
      .attr('r', 10)
      .attr('fill', d => expandedNodes.has(d.id) ? '#10b981' : '#94a3b8')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    nodeElements.filter(d => d.isClass && d.type !== 'abstract')
      .append('text')
      .attr('x', 50)
      .attr('y', -16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .style('pointer-events', 'none')
      .text(d => expandedNodes.has(d.id) ? '−' : '+');

    // Node labels
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('font-size', d => d.isClass ? '14px' : '11px')
      .attr('font-weight', d => d.isClass ? 'bold' : 'normal')
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

    // Add click handler for classes
    nodeElements.filter(d => d.isClass && d.type !== 'abstract')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(d.id)) {
          newExpanded.delete(d.id);
        } else {
          newExpanded.add(d.id);
        }
        setExpandedNodes(newExpanded);
      });

    nodeElements.on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0.95);
      
      let tooltipHtml = `<strong>${d.label}</strong><br/>`;
      if (d.isClass) {
        tooltipHtml += `Type: ${d.type === 'abstract' ? 'Abstract Class' : 'Class'}<br/>`;
        
        const outgoing = links.filter(r => r.source.id === d.id && r.style === 'property');
        const incoming = links.filter(r => r.target.id === d.id && r.style === 'property');
        
        if (outgoing.length > 0) {
          tooltipHtml += `<br/><em>Properties:</em><br/>`;
          outgoing.forEach(r => {
            tooltipHtml += `→ ${r.label}<br/>`;
          });
        }
        
        if (d.type !== 'abstract') {
          tooltipHtml += `<br/><em>Click to expand/collapse instances</em>`;
        }
      } else {
        tooltipHtml += `Type: Instance of ${d.parentClass}<br/>`;
      }
      
      tooltip.html(tooltipHtml)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
      
      d3.select(event.currentTarget).select('rect')
        .attr('stroke', '#fbbf24')
        .attr('stroke-width', d => d.isClass ? 5 : 3);
    })
    .on('mouseout', (event, d) => {
      tooltip.transition().duration(500).style('opacity', 0);
      
      d3.select(event.currentTarget).select('rect')
        .attr('stroke', '#fff')
        .attr('stroke-width', d => d.isClass ? 3 : 2);
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

    // Auto-fit graph to visible area after simulation stabilizes
    simulation.on('end', () => {
      console.log('Ontology simulation ended - auto-fitting to view');
      
      // Calculate bounds of all nodes
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      nodes.forEach(d => {
        if (d.x < minX) minX = d.x;
        if (d.y < minY) minY = d.y;
        if (d.x > maxX) maxX = d.x;
        if (d.y > maxY) maxY = d.y;
      });

      // Add padding
      const padding = 100;
      minX -= padding;
      minY -= padding;
      maxX += padding;
      maxY += padding;

      // Calculate bounds dimensions
      const boundsWidth = maxX - minX;
      const boundsHeight = maxY - minY;

      // Calculate scale to fit
      const scale = Math.min(width / boundsWidth, height / boundsHeight) * 0.8; // Fit to container
      
      // Calculate translation to center
      const translateX = width / 2 - (minX + boundsWidth / 2) * scale;
      const translateY = height / 2 - (minY + boundsHeight / 2) * scale; // Center in container

      console.log('Auto-fit:', { minX, minY, maxX, maxY, scale, translateX, translateY });

      // Apply transform with smooth transition
      svg.transition()
        .duration(1000)
        .call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));
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
  }, [data, expandedNodes]);

  if (loading) return <div className="loading">Loading ontology data...</div>;
  if (error) return <div className="error">Error loading data: {error.message}</div>;

  return (
    <div className="ontology-page">
      {/* Full-width header */}
      <div className="page-header">
        <h1>Coffee Supply Chain Ontology</h1>
        <p>Interactive class diagram with 30 classes across 5 categories and dynamic instance expansion</p>
      </div>

      {/* Two-column layout: sidebar + diagram */}
      <div className="content-grid">
        {/* Left sidebar - narrow */}
        <div className="sidebar-panel">
          <div className="legend-card">
            <h3>Classes (30 total)</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#94a3b8', border: '2px dashed #475569' }}></div>
                <span>Abstract Class</span>
              </div>
              
              <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginTop: '0.75rem', color: '#374151' }}>Location (7)</h4>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#10b981' }}></div>
                <span>Country</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#14b8a6' }}></div>
                <span>City</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#06b6d4' }}></div>
                <span>Capital</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#059669' }}></div>
                <span>Farm</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#0891b2' }}></div>
                <span>Port</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#64748b' }}></div>
                <span>Warehouse</span>
              </div>
              
              <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginTop: '0.75rem', color: '#374151' }}>Organization (10)</h4>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#3b82f6' }}></div>
                <span>CoffeeChain</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#14b8a6' }}></div>
                <span>Cooperative</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#10b981' }}></div>
                <span>Farmer</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#f97316' }}></div>
                <span>Roaster</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#2563eb' }}></div>
                <span>Retailer</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#7c3aed' }}></div>
                <span>ProcessingMill</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#8b5cf6', border: '2px dashed #7c3aed' }}></div>
                <span>Broker (Abstract)</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#a855f7' }}></div>
                <span>ExportBroker</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#c084fc' }}></div>
                <span>ImportBroker</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#d946ef' }}></div>
                <span>LogisticsProvider</span>
              </div>
              
              <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginTop: '0.75rem', color: '#374151' }}>Product (2)</h4>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#f59e0b' }}></div>
                <span>CoffeeBrand</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#f97316' }}></div>
                <span>CoffeeVariety</span>
              </div>
              
              <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginTop: '0.75rem', color: '#374151' }}>Quality & Processing (3)</h4>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#84cc16' }}></div>
                <span>Certification</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#a855f7' }}></div>
                <span>ProcessingMethod</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#c084fc' }}></div>
                <span>QualityGrade</span>
              </div>
              
              <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginTop: '0.75rem', color: '#374151' }}>Market & Economics (4)</h4>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#eab308' }}></div>
                <span>Consumer</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#f59e0b' }}></div>
                <span>Price</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#d97706' }}></div>
                <span>TradeAgreement</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ backgroundColor: '#ca8a04' }}></div>
                <span>Season/Harvest</span>
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
              <div className="legend-item">
                <svg width="50" height="20">
                  <line x1="0" y1="10" x2="40" y2="10" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3"/>
                </svg>
                <span>instanceOf</span>
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
              <p>🎯 <strong>Click classes</strong> to expand/collapse instances</p>
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
