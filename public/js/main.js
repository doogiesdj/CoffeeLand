// Global variables
let uploadedFilename = null;
let rdfData = null;
let cy = null;

// DOM elements
const fileInput = document.getElementById('fileInput');
const uploadBox = document.getElementById('uploadBox');
const fileName = document.getElementById('fileName');
const uploadStatus = document.getElementById('uploadStatus');
const sidebarNav = document.getElementById('sidebarNav');
const tabContent = document.getElementById('tabContent');
const welcomeScreen = document.getElementById('welcomeScreen');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.getElementById('mainContent');

// Sidebar toggle
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// Mobile sidebar toggle
if (window.innerWidth <= 1024) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
    });
}

// File upload handling
fileInput.addEventListener('change', handleFileSelect);
uploadBox.addEventListener('click', (e) => {
    if (e.target !== fileInput) {
        fileInput.click();
    }
});
uploadBox.addEventListener('dragover', handleDragOver);
uploadBox.addEventListener('dragleave', handleDragLeave);
uploadBox.addEventListener('drop', handleDrop);

function handleDragOver(e) {
    e.preventDefault();
    uploadBox.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect();
    }
}

async function handleFileSelect() {
    const file = fileInput.files[0];
    
    if (!file) return;
    
    fileName.textContent = file.name;
    uploadStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 업로드 중...';
    uploadStatus.className = 'upload-status-mini';
    
    const formData = new FormData();
    formData.append('rdfFile', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            uploadedFilename = result.filename;
            uploadStatus.innerHTML = '<i class="fas fa-check-circle"></i> 성공!';
            uploadStatus.className = 'upload-status-mini success';
            
            // Hide welcome screen and show content
            welcomeScreen.style.display = 'none';
            sidebarNav.style.display = 'block';
            tabContent.style.display = 'block';
            
            await loadRDFData();
        } else {
            throw new Error(result.error || '업로드 실패');
        }
    } catch (error) {
        uploadStatus.innerHTML = `<i class="fas fa-exclamation-circle"></i> 오류`;
        uploadStatus.className = 'upload-status-mini error';
        console.error('Upload error:', error);
    }
}

// Load RDF data
async function loadRDFData() {
    try {
        // Parse RDF
        const parseResponse = await fetch('/api/rdf/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: uploadedFilename })
        });
        
        const parseResult = await parseResponse.json();
        
        if (parseResult.success) {
            rdfData = parseResult.triples;
            
            // Load statistics
            await loadStatistics();
            
            // Initialize graph visualization
            initializeGraph();
            
            // Load hierarchy
            await loadHierarchy();
        }
    } catch (error) {
        console.error('Error loading RDF data:', error);
    }
}

// Sidebar navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const tabId = item.dataset.tab;
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        item.classList.add('active');
        
        // Update content panes
        document.querySelectorAll('.content-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
        
        // Update page title
        const titles = {
            'graph': 'Graph Visualization',
            'tree': 'Class Hierarchy',
            'sparql': 'SPARQL Query Interface',
            'raw': 'RDF Content',
            'stats': 'Ontology Statistics'
        };
        document.getElementById('pageTitle').textContent = titles[tabId] || 'Ontology Viewer';
        
        // Resize graph if switching to graph tab
        if (tabId === 'graph' && cy) {
            setTimeout(() => {
                cy.resize();
                cy.fit();
            }, 100);
        }
    });
});

// Graph visualization
function initializeGraph() {
    const container = document.getElementById('cy');
    
    // Build graph elements
    const elements = [];
    const nodeSet = new Set();
    
    rdfData.forEach(triple => {
        if (!nodeSet.has(triple.subject)) {
            elements.push({
                data: { 
                    id: triple.subject, 
                    label: getShortName(triple.subject),
                    fullUri: triple.subject
                }
            });
            nodeSet.add(triple.subject);
        }
        
        if (!nodeSet.has(triple.object) && triple.objectType === 'NamedNode') {
            elements.push({
                data: { 
                    id: triple.object, 
                    label: getShortName(triple.object),
                    fullUri: triple.object
                }
            });
            nodeSet.add(triple.object);
        }
        
        elements.push({
            data: {
                source: triple.subject,
                target: triple.object,
                label: getShortName(triple.predicate),
                fullUri: triple.predicate
            }
        });
    });
    
    // Initialize Cytoscape
    cy = cytoscape({
        container: container,
        elements: elements,
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#4a9eff',
                    'label': 'data(label)',
                    'color': '#ffffff',
                    'text-outline-color': '#1a1f29',
                    'text-outline-width': 2,
                    'font-size': '12px',
                    'width': '60px',
                    'height': '60px',
                    'font-weight': 'bold'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#6b7785',
                    'target-arrow-color': '#6b7785',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'label': 'data(label)',
                    'font-size': '10px',
                    'text-rotation': 'autorotate',
                    'text-margin-y': -10,
                    'color': '#a8b2c1'
                }
            }
        ],
        layout: {
            name: 'cose',
            animate: true,
            animationDuration: 1000
        }
    });
    
    // Node click event
    cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        showNodeInfo(node.data());
    });
    
    // Graph controls
    document.getElementById('fitBtn').addEventListener('click', () => {
        cy.fit();
    });
    
    document.getElementById('centerBtn').addEventListener('click', () => {
        cy.center();
    });
    
    document.getElementById('resetZoomBtn').addEventListener('click', () => {
        cy.zoom(1);
        cy.center();
    });
    
    document.getElementById('layoutSelect').addEventListener('change', (e) => {
        cy.layout({ name: e.target.value, animate: true }).run();
    });
}

function showNodeInfo(data) {
    const infoPanel = document.getElementById('nodeInfo');
    const connections = cy.getElementById(data.id).connectedEdges().length;
    infoPanel.innerHTML = `
        <h4><i class="fas fa-info-circle"></i> Node Information</h4>
        <p><strong>Label:</strong> ${data.label}</p>
        <p><strong>URI:</strong> <code>${data.fullUri}</code></p>
        <p><strong>Connections:</strong> ${connections}</p>
    `;
}

function getShortName(uri) {
    const match = uri.match(/[/#]([^/#]+)$/);
    return match ? match[1] : uri;
}

// Statistics
async function loadStatistics() {
    try {
        const response = await fetch('/api/rdf/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: uploadedFilename })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const stats = result.stats;
            
            document.getElementById('classCount').textContent = stats.classCount;
            document.getElementById('propertyCount').textContent = stats.propertyCount;
            document.getElementById('individualCount').textContent = stats.individualCount;
            document.getElementById('tripleCount').textContent = stats.totalTriples;
            
            // Namespaces
            const namespaceList = document.getElementById('namespaceList');
            namespaceList.innerHTML = stats.namespaces
                .map(ns => `<li>${ns}</li>`)
                .join('');
            
            // Classes
            const classList = document.getElementById('classList');
            classList.innerHTML = stats.classes
                .map(cls => `<li>${getShortName(cls)}</li>`)
                .join('');
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Hierarchy
async function loadHierarchy() {
    try {
        const response = await fetch('/api/rdf/hierarchy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: uploadedFilename })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const treeView = document.getElementById('treeView');
            treeView.innerHTML = renderTree(result.hierarchy);
            
            // Add click handlers for tree nodes
            document.querySelectorAll('.tree-node-label').forEach(node => {
                node.addEventListener('click', (e) => {
                    const children = e.currentTarget.parentElement.querySelector('.tree-node-children');
                    if (children) {
                        children.style.display = children.style.display === 'none' ? 'block' : 'none';
                        const icon = e.currentTarget.querySelector('i');
                        if (icon.classList.contains('fa-chevron-down')) {
                            icon.classList.remove('fa-chevron-down');
                            icon.classList.add('fa-chevron-right');
                        } else {
                            icon.classList.remove('fa-chevron-right');
                            icon.classList.add('fa-chevron-down');
                        }
                    }
                });
            });
            
            // Expand/collapse functionality
            document.getElementById('expandAllBtn').addEventListener('click', () => {
                document.querySelectorAll('.tree-node-children').forEach(el => {
                    el.style.display = 'block';
                });
                document.querySelectorAll('.tree-node-label i.fa-chevron-right').forEach(icon => {
                    icon.classList.remove('fa-chevron-right');
                    icon.classList.add('fa-chevron-down');
                });
            });
            
            document.getElementById('collapseAllBtn').addEventListener('click', () => {
                document.querySelectorAll('.tree-node-children').forEach(el => {
                    el.style.display = 'none';
                });
                document.querySelectorAll('.tree-node-label i.fa-chevron-down').forEach(icon => {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-right');
                });
            });
        }
    } catch (error) {
        console.error('Error loading hierarchy:', error);
    }
}

function renderTree(nodes) {
    if (!nodes || nodes.length === 0) {
        return '<p style="color: var(--text-secondary);">No hierarchy structure available.</p>';
    }
    
    return nodes.map(node => {
        const hasChildren = node.children && node.children.length > 0;
        return `
            <div class="tree-node">
                <div class="tree-node-label">
                    ${hasChildren ? '<i class="fas fa-chevron-down"></i>' : '<i class="fas fa-circle" style="font-size:8px;"></i>'}
                    <strong>${node.label}</strong>
                </div>
                ${hasChildren ? `<div class="tree-node-children">${renderTree(node.children)}</div>` : ''}
            </div>
        `;
    }).join('');
}

// SPARQL Query
document.getElementById('executeQueryBtn').addEventListener('click', executeSPARQLQuery);

document.querySelectorAll('.example-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const queryType = btn.dataset.query;
        
        try {
            const response = await fetch('/api/sparql/examples');
            const result = await response.json();
            
            if (result.success && result.examples[queryType]) {
                document.getElementById('sparqlQuery').value = result.examples[queryType].query;
            }
        } catch (error) {
            console.error('Error loading example query:', error);
        }
    });
});

async function executeSPARQLQuery() {
    const query = document.getElementById('sparqlQuery').value;
    const resultsContainer = document.getElementById('queryResults');
    const resultCount = document.getElementById('resultCount');
    
    resultsContainer.innerHTML = '<div class="spinner"></div>';
    
    try {
        const response = await fetch('/api/sparql/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                filename: uploadedFilename,
                query: query
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            resultCount.textContent = `(${result.count} results)`;
            
            if (result.results.length === 0) {
                resultsContainer.innerHTML = '<p style="padding:1rem;color:var(--text-secondary);">No results found.</p>';
                return;
            }
            
            // Build table
            const keys = Object.keys(result.results[0]);
            let tableHTML = '<table class="results-table"><thead><tr>';
            
            keys.forEach(key => {
                tableHTML += `<th>${key}</th>`;
            });
            
            tableHTML += '</tr></thead><tbody>';
            
            result.results.forEach(row => {
                tableHTML += '<tr>';
                keys.forEach(key => {
                    tableHTML += `<td>${getShortName(row[key])}</td>`;
                });
                tableHTML += '</tr>';
            });
            
            tableHTML += '</tbody></table>';
            
            resultsContainer.innerHTML = tableHTML;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        resultsContainer.innerHTML = `<p style="padding:1rem;color:var(--error-color);">Error: ${error.message}</p>`;
    }
}

// RDF Content
document.getElementById('convertBtn').addEventListener('click', async () => {
    const format = document.getElementById('formatSelect').value;
    const rdfContent = document.getElementById('rdfContent');
    
    rdfContent.textContent = 'Converting...';
    
    try {
        const response = await fetch('/api/rdf/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                filename: uploadedFilename,
                format: format
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            rdfContent.textContent = result.content;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        rdfContent.textContent = `Error: ${error.message}`;
    }
});

document.getElementById('copyRdfBtn').addEventListener('click', () => {
    const content = document.getElementById('rdfContent').textContent;
    navigator.clipboard.writeText(content).then(() => {
        const btn = document.getElementById('copyRdfBtn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    });
});

document.getElementById('downloadRdfBtn').addEventListener('click', () => {
    const content = document.getElementById('rdfContent').textContent;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ontology.ttl';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Window resize handler
window.addEventListener('resize', () => {
    if (cy) {
        cy.resize();
    }
});
