// Global variables
let uploadedFilename = null;
let rdfData = null;
let cy = null;

// DOM elements
const fileInput = document.getElementById('fileInput');
const uploadBox = document.getElementById('uploadBox');
const fileName = document.getElementById('fileName');
const uploadStatus = document.getElementById('uploadStatus');
const tabNav = document.getElementById('tabNav');
const tabContent = document.getElementById('tabContent');

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
    
    fileName.textContent = file.name;
    uploadStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 파일 업로드 중...';
    uploadStatus.className = 'upload-status';
    
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
            uploadStatus.innerHTML = '<i class="fas fa-check-circle"></i> 파일 업로드 성공!';
            uploadStatus.className = 'upload-status success';
            
            // Show tabs and load data
            tabNav.style.display = 'flex';
            tabContent.style.display = 'block';
            
            await loadRDFData();
        } else {
            throw new Error(result.error || '업로드 실패');
        }
    } catch (error) {
        uploadStatus.innerHTML = `<i class="fas fa-exclamation-circle"></i> 오류: ${error.message}`;
        uploadStatus.className = 'upload-status error';
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

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        
        // Update buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Update panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
        
        // Resize graph if switching to graph tab
        if (tabId === 'graph' && cy) {
            cy.resize();
            cy.fit();
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
                    'background-color': '#6f4e37',
                    'label': 'data(label)',
                    'color': '#fff',
                    'text-outline-color': '#6f4e37',
                    'text-outline-width': 2,
                    'font-size': '12px',
                    'width': '60px',
                    'height': '60px'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#a0826d',
                    'target-arrow-color': '#a0826d',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'label': 'data(label)',
                    'font-size': '10px',
                    'text-rotation': 'autorotate',
                    'text-margin-y': -10
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
    infoPanel.innerHTML = `
        <h4><i class="fas fa-info-circle"></i> 노드 정보</h4>
        <p><strong>라벨:</strong> ${data.label}</p>
        <p><strong>URI:</strong> <code>${data.fullUri}</code></p>
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
            
            // Expand/collapse functionality
            document.getElementById('expandAllBtn').addEventListener('click', () => {
                document.querySelectorAll('.tree-node-children').forEach(el => {
                    el.style.display = 'block';
                });
            });
            
            document.getElementById('collapseAllBtn').addEventListener('click', () => {
                document.querySelectorAll('.tree-node-children').forEach(el => {
                    el.style.display = 'none';
                });
            });
        }
    } catch (error) {
        console.error('Error loading hierarchy:', error);
    }
}

function renderTree(nodes) {
    if (!nodes || nodes.length === 0) {
        return '<p>계층 구조를 표시할 수 없습니다.</p>';
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
            resultCount.textContent = `(${result.count}개 결과)`;
            
            if (result.results.length === 0) {
                resultsContainer.innerHTML = '<p style="padding:1rem;">결과가 없습니다.</p>';
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
        resultsContainer.innerHTML = `<p style="padding:1rem;color:red;">오류: ${error.message}</p>`;
    }
}

// RDF Content
document.getElementById('convertBtn').addEventListener('click', async () => {
    const format = document.getElementById('formatSelect').value;
    const rdfContent = document.getElementById('rdfContent');
    
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

document.getElementById('copyRdfBtn').addEventListener('click', () => {
    const content = document.getElementById('rdfContent').textContent;
    navigator.clipboard.writeText(content);
    alert('클립보드에 복사되었습니다!');
});

document.getElementById('downloadRdfBtn').addEventListener('click', () => {
    const content = document.getElementById('rdfContent').textContent;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ontology.ttl';
    a.click();
});
