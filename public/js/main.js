// Global variables
let uploadedFilename = null;
let rdfData = null;
let cy = null;

// DOM elements
const fileInput = document.getElementById('fileInput');
const uploadBox = document.getElementById('uploadBox');
const fileName = document.getElementById('fileName');
const uploadStatus = document.getElementById('uploadStatus');
const sidebar = document.getElementById('sidebar');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');

// Sidebar Navigation
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const viewName = item.dataset.view;
        switchView(viewName);
        
        // Update active state
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Close mobile menu
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
});

function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.content-view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.add('active');
        
        // Resize graph if switching to graph view
        if (viewName === 'graph' && cy) {
            setTimeout(() => {
                cy.resize();
                cy.fit();
            }, 100);
        }
    }
}

// Mobile menu toggle
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// File upload handling
fileInput.addEventListener('change', handleFileSelect);
uploadBox.addEventListener('click', () => fileInput.click());
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
    
    // Update sidebar file info
    fileName.textContent = file.name;
    fileName.classList.add('active');
    
    // Update status in sidebar
    uploadStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 업로드 중...';
    uploadStatus.className = 'upload-status-widget';
    uploadStatus.style.display = 'block';
    
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
            uploadStatus.innerHTML = '<i class="fas fa-check-circle"></i> 업로드 성공!';
            uploadStatus.className = 'upload-status-widget success';
            
            // Enable navigation items
            navItems.forEach(item => {
                item.style.pointerEvents = 'auto';
                item.style.opacity = '1';
            });
            
            // Load data
            await loadRDFData();
            
            // Switch to graph view
            switchView('graph');
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-view="graph"]').classList.add('active');
        } else {
            throw new Error(result.error || '업로드 실패');
        }
    } catch (error) {
        uploadStatus.innerHTML = `<i class="fas fa-exclamation-circle"></i> 오류: ${error.message}`;
        uploadStatus.className = 'upload-status-widget error';
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

// Graph visualization
function initializeGraph() {
    const container = document.getElementById('cy');
    
    if (!container) return;
    
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
                    'background-color': '#2d72d2',
                    'label': 'data(label)',
                    'color': '#f5f8fa',
                    'text-outline-color': '#2d72d2',
                    'text-outline-width': 2,
                    'font-size': '12px',
                    'width': '60px',
                    'height': '60px',
                    'text-valign': 'center',
                    'text-halign': 'center'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#8b6f47',
                    'target-arrow-color': '#8b6f47',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'label': 'data(label)',
                    'font-size': '10px',
                    'text-rotation': 'autorotate',
                    'text-margin-y': -10,
                    'color': '#abb3bf',
                    'text-outline-color': '#1a1f29',
                    'text-outline-width': 1
                }
            }
        ],
        layout: {
            name: 'cose',
            animate: true,
            animationDuration: 1000,
            padding: 50
        }
    });
    
    // Node click event
    cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        showNodeInfo(node.data());
    });
    
    // Graph controls
    const fitBtn = document.getElementById('fitBtn');
    const centerBtn = document.getElementById('centerBtn');
    const resetZoomBtn = document.getElementById('resetZoomBtn');
    const layoutSelect = document.getElementById('layoutSelect');
    
    if (fitBtn) fitBtn.addEventListener('click', () => cy.fit());
    if (centerBtn) centerBtn.addEventListener('click', () => cy.center());
    if (resetZoomBtn) resetZoomBtn.addEventListener('click', () => {
        cy.zoom(1);
        cy.center();
    });
    
    if (layoutSelect) {
        layoutSelect.addEventListener('change', (e) => {
            cy.layout({ name: e.target.value, animate: true }).run();
        });
    }
}

function showNodeInfo(data) {
    const infoPanel = document.getElementById('nodeInfo');
    if (!infoPanel) return;
    
    infoPanel.innerHTML = `
        <h4><i class="fas fa-info-circle"></i> 노드 정보</h4>
        <p><strong>라벨:</strong> ${data.label}</p>
        <p><strong>URI:</strong><br><code>${data.fullUri}</code></p>
        <p><strong>연결:</strong> ${cy.getElementById(data.id).connectedEdges().length}개</p>
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
            if (namespaceList) {
                namespaceList.innerHTML = stats.namespaces
                    .map(ns => `<li>${ns}</li>`)
                    .join('');
            }
            
            // Classes
            const classList = document.getElementById('classList');
            if (classList) {
                classList.innerHTML = stats.classes
                    .map(cls => `<li>${getShortName(cls)}</li>`)
                    .join('');
            }
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
            if (treeView) {
                treeView.innerHTML = renderTree(result.hierarchy);
            }
            
            // Expand/collapse functionality
            const expandAllBtn = document.getElementById('expandAllBtn');
            const collapseAllBtn = document.getElementById('collapseAllBtn');
            
            if (expandAllBtn) {
                expandAllBtn.addEventListener('click', () => {
                    document.querySelectorAll('.tree-node-children').forEach(el => {
                        el.style.display = 'block';
                    });
                });
            }
            
            if (collapseAllBtn) {
                collapseAllBtn.addEventListener('click', () => {
                    document.querySelectorAll('.tree-node-children').forEach(el => {
                        el.style.display = 'none';
                    });
                });
            }
        }
    } catch (error) {
        console.error('Error loading hierarchy:', error);
    }
}

function renderTree(nodes) {
    if (!nodes || nodes.length === 0) {
        return '<p style="color: var(--text-secondary);">계층 구조를 표시할 수 없습니다.</p>';
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
const executeQueryBtn = document.getElementById('executeQueryBtn');
if (executeQueryBtn) {
    executeQueryBtn.addEventListener('click', executeSPARQLQuery);
}

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
    
    if (!resultsContainer) return;
    
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
            if (resultCount) {
                resultCount.textContent = `(${result.count}개)`;
            }
            
            if (result.results.length === 0) {
                resultsContainer.innerHTML = '<p style="padding:1rem;color:var(--text-secondary);">결과가 없습니다.</p>';
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
        resultsContainer.innerHTML = `<p style="padding:1rem;color:var(--error-color);">오류: ${error.message}</p>`;
    }
}

// RDF Content
const convertBtn = document.getElementById('convertBtn');
if (convertBtn) {
    convertBtn.addEventListener('click', async () => {
        const format = document.getElementById('formatSelect').value;
        const rdfContent = document.getElementById('rdfContent');
        
        if (!rdfContent) return;
        
        rdfContent.textContent = '변환 중...';
        
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
            rdfContent.textContent = `오류: ${error.message}`;
        }
    });
}

const copyRdfBtn = document.getElementById('copyRdfBtn');
if (copyRdfBtn) {
    copyRdfBtn.addEventListener('click', () => {
        const content = document.getElementById('rdfContent').textContent;
        navigator.clipboard.writeText(content);
        
        // Visual feedback
        copyRdfBtn.innerHTML = '<i class="fas fa-check"></i> 복사됨!';
        setTimeout(() => {
            copyRdfBtn.innerHTML = '<i class="fas fa-copy"></i> 복사';
        }, 2000);
    });
}

const downloadRdfBtn = document.getElementById('downloadRdfBtn');
if (downloadRdfBtn) {
    downloadRdfBtn.addEventListener('click', () => {
        const content = document.getElementById('rdfContent').textContent;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ontology.ttl';
        a.click();
        URL.revokeObjectURL(url);
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});
