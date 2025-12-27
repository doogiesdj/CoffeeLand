const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const N3 = require('n3');

// Execute SPARQL query
router.post('/query', async (req, res) => {
    try {
        const { filename, query } = req.body;
        
        if (!filename || !query) {
            return res.status(400).json({ error: 'Filename and query are required' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', filename);
        const fileContent = await fs.readFile(filePath, 'utf8');
        
        // Parse RDF into store
        const parser = new N3.Parser();
        const store = new N3.Store();
        
        await new Promise((resolve, reject) => {
            parser.parse(fileContent, (error, triple, prefixes) => {
                if (error) {
                    reject(error);
                } else if (triple) {
                    store.addQuad(triple);
                } else {
                    resolve();
                }
            });
        });

        // Execute simple SPARQL-like queries
        // Note: This is a simplified implementation. For full SPARQL support, consider using a library like sparql-engine
        const results = executeQuery(store, query);

        res.json({
            success: true,
            results: results,
            count: results.length
        });

    } catch (error) {
        console.error('Error executing SPARQL query:', error);
        res.status(500).json({ error: error.message });
    }
});

// Simplified SPARQL query executor
function executeQuery(store, queryString) {
    const results = [];
    
    // Parse query type
    const selectMatch = queryString.match(/SELECT\s+(.*?)\s+WHERE/is);
    
    if (!selectMatch) {
        throw new Error('Invalid SPARQL query format');
    }
    
    const variables = selectMatch[1].trim().split(/\s+/).filter(v => v.startsWith('?'));
    
    // Extract WHERE clause
    const whereMatch = queryString.match(/WHERE\s*\{(.*?)\}/is);
    if (!whereMatch) {
        throw new Error('WHERE clause not found');
    }
    
    const whereClause = whereMatch[1].trim();
    
    // Parse triple pattern
    const triplePattern = whereClause.match(/(\??\w+|\<[^>]+\>)\s+(\??\w+|\<[^>]+\>)\s+(\??\w+|\<[^>]+\>)/);
    
    if (!triplePattern) {
        throw new Error('Invalid triple pattern');
    }
    
    const [_, subj, pred, obj] = triplePattern;
    
    // Convert query pattern to N3 match parameters
    const subjParam = subj.startsWith('?') ? null : subj.replace(/[<>]/g, '');
    const predParam = pred.startsWith('?') ? null : pred.replace(/[<>]/g, '');
    const objParam = obj.startsWith('?') ? null : obj.replace(/[<>]/g, '');
    
    // Query store
    const quads = store.getQuads(subjParam, predParam, objParam, null);
    
    // Extract LIMIT if present
    const limitMatch = queryString.match(/LIMIT\s+(\d+)/i);
    const limit = limitMatch ? parseInt(limitMatch[1]) : quads.length;
    
    // Build results
    const limitedQuads = quads.slice(0, limit);
    
    limitedQuads.forEach(quad => {
        const result = {};
        
        variables.forEach(variable => {
            const varName = variable.substring(1); // Remove ?
            
            if (subj === variable) {
                result[varName] = quad.subject.value;
            }
            if (pred === variable) {
                result[varName] = quad.predicate.value;
            }
            if (obj === variable) {
                result[varName] = quad.object.value;
            }
        });
        
        results.push(result);
    });
    
    return results;
}

// Get predefined queries
router.get('/examples', (req, res) => {
    const examples = {
        all: {
            name: '모든 트리플',
            query: 'SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object } LIMIT 100'
        },
        classes: {
            name: '모든 클래스',
            query: 'SELECT ?class WHERE { ?class <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#Class> }'
        },
        properties: {
            name: '모든 속성',
            query: 'SELECT ?property WHERE { ?property <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#ObjectProperty> }'
        },
        individuals: {
            name: '모든 인스턴스',
            query: 'SELECT ?individual ?type WHERE { ?individual <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type } LIMIT 100'
        },
        subclasses: {
            name: '하위 클래스 관계',
            query: 'SELECT ?subclass ?superclass WHERE { ?subclass <http://www.w3.org/2000/01/rdf-schema#subClassOf> ?superclass }'
        }
    };
    
    res.json({
        success: true,
        examples: examples
    });
});

module.exports = router;
