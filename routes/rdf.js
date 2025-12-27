const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const N3 = require('n3');
const $rdf = require('rdflib');
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;

// Parse RDF file (supports RDF/XML, Turtle, N3, N-Triples)
router.post('/parse', async (req, res) => {
    try {
        const { filename } = req.body;
        
        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', filename);
        const fileContent = await fs.readFile(filePath, 'utf8');
        
        // Detect format
        const ext = path.extname(filename).toLowerCase();
        const isRdfXml = fileContent.trim().startsWith('<?xml') || 
                        fileContent.includes('<rdf:RDF') || 
                        ext === '.rdf' || ext === '.owl';
        
        const triples = [];
        
        if (isRdfXml) {
            // Use rdflib for RDF/XML
            const store = $rdf.graph();
            const contentType = 'application/rdf+xml';
            const baseURI = 'http://example.org/';
            
            try {
                $rdf.parse(fileContent, store, baseURI, contentType);
                
                // Extract triples from store
                store.statements.forEach(statement => {
                    triples.push({
                        subject: statement.subject.value,
                        predicate: statement.predicate.value,
                        object: statement.object.value,
                        objectType: statement.object.termType
                    });
                });
            } catch (parseError) {
                console.error('RDF/XML parse error:', parseError);
                throw new Error('Failed to parse RDF/XML: ' + parseError.message);
            }
        } else {
            // Use N3 parser for Turtle, N3, N-Triples
            const parser = new N3.Parser();
            
            await new Promise((resolve, reject) => {
                parser.parse(fileContent, (error, triple, prefixes) => {
                    if (error) {
                        reject(error);
                    } else if (triple) {
                        triples.push({
                            subject: triple.subject.value,
                            predicate: triple.predicate.value,
                            object: triple.object.value,
                            objectType: triple.object.termType
                        });
                    } else {
                        resolve({ triples, prefixes });
                    }
                });
            });
        }

        res.json({
            success: true,
            triples: triples,
            count: triples.length
        });

    } catch (error) {
        console.error('Error parsing RDF:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get ontology statistics
router.post('/stats', async (req, res) => {
    try {
        const { filename } = req.body;
        
        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', filename);
        const fileContent = await fs.readFile(filePath, 'utf8');
        
        const triples = [];
        const classes = new Set();
        const properties = new Set();
        const individuals = new Set();
        const namespaces = new Set();
        
        // Detect format
        const isRdfXml = fileContent.trim().startsWith('<?xml') || fileContent.trim().startsWith('<rdf:RDF');
        
        if (isRdfXml) {
            // Use rdflib for RDF/XML
            const store = $rdf.graph();
            let parseError = null;
            
            try {
                $rdf.parse(fileContent, store, 'http://example.org/', 'application/rdf+xml');
            } catch (e) {
                parseError = e;
            }
            
            if (parseError) {
                throw new Error('Failed to parse RDF/XML stats: ' + parseError.message);
            }
            
            // Extract triples and analyze
            const statements = store.statements;
            statements.forEach(stmt => {
                triples.push(stmt);
                
                // Extract namespace
                const extractNamespace = (uri) => {
                    const match = uri.match(/^(.+[/#])([^/#]+)$/);
                    return match ? match[1] : uri;
                };
                
                const subjectUri = stmt.subject.value;
                const predicateUri = stmt.predicate.value;
                const objectUri = stmt.object.value;
                
                namespaces.add(extractNamespace(subjectUri));
                namespaces.add(extractNamespace(predicateUri));
                
                // Identify classes
                if (predicateUri === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
                    objectUri === 'http://www.w3.org/2002/07/owl#Class') {
                    classes.add(subjectUri);
                }
                
                // Identify properties
                if (predicateUri === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
                    (objectUri === 'http://www.w3.org/2002/07/owl#ObjectProperty' ||
                     objectUri === 'http://www.w3.org/2002/07/owl#DatatypeProperty')) {
                    properties.add(subjectUri);
                }
                
                // Identify individuals
                if (predicateUri === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
                    !objectUri.includes('owl#') &&
                    !objectUri.includes('rdf#') &&
                    !objectUri.includes('rdfs#')) {
                    individuals.add(subjectUri);
                }
            });
        } else {
            // Use N3 parser for Turtle, N3, N-Triples
            const parser = new N3.Parser();
            
            await new Promise((resolve, reject) => {
                parser.parse(fileContent, (error, triple, prefixes) => {
                    if (error) {
                        reject(error);
                    } else if (triple) {
                        triples.push(triple);
                        
                        // Extract namespace
                        const extractNamespace = (uri) => {
                            const match = uri.match(/^(.+[/#])([^/#]+)$/);
                            return match ? match[1] : uri;
                        };
                        
                        namespaces.add(extractNamespace(triple.subject.value));
                        namespaces.add(extractNamespace(triple.predicate.value));
                        
                        // Identify classes
                        if (triple.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
                            triple.object.value === 'http://www.w3.org/2002/07/owl#Class') {
                            classes.add(triple.subject.value);
                        }
                        
                        // Identify properties
                        if (triple.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
                            (triple.object.value === 'http://www.w3.org/2002/07/owl#ObjectProperty' ||
                             triple.object.value === 'http://www.w3.org/2002/07/owl#DatatypeProperty')) {
                            properties.add(triple.subject.value);
                        }
                        
                        // Identify individuals
                        if (triple.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
                            !triple.object.value.includes('owl#') &&
                            !triple.object.value.includes('rdf#') &&
                            !triple.object.value.includes('rdfs#')) {
                            individuals.add(triple.subject.value);
                        }
                    } else {
                        resolve();
                    }
                });
            });
        }

        res.json({
            success: true,
            stats: {
                totalTriples: triples.length,
                classCount: classes.size,
                propertyCount: properties.size,
                individualCount: individuals.size,
                classes: Array.from(classes),
                properties: Array.from(properties),
                individuals: Array.from(individuals),
                namespaces: Array.from(namespaces)
            }
        });

    } catch (error) {
        console.error('Error generating stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Convert RDF format
router.post('/convert', async (req, res) => {
    try {
        const { filename, format } = req.body;
        
        if (!filename || !format) {
            return res.status(400).json({ error: 'Filename and format are required' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', filename);
        const fileContent = await fs.readFile(filePath, 'utf8');
        
        const store = new N3.Store();
        
        // Detect format
        const isRdfXml = fileContent.trim().startsWith('<?xml') || fileContent.trim().startsWith('<rdf:RDF');
        
        if (isRdfXml) {
            // Use rdflib for RDF/XML
            const rdflibStore = $rdf.graph();
            let parseError = null;
            
            try {
                $rdf.parse(fileContent, rdflibStore, 'http://example.org/', 'application/rdf+xml');
            } catch (e) {
                parseError = e;
            }
            
            if (parseError) {
                throw new Error('Failed to parse RDF/XML: ' + parseError.message);
            }
            
            // Convert rdflib statements to N3 quads for output
            const statements = rdflibStore.statements;
            statements.forEach(stmt => {
                store.addQuad(
                    N3.DataFactory.namedNode(stmt.subject.value),
                    N3.DataFactory.namedNode(stmt.predicate.value),
                    stmt.object.termType === 'Literal' 
                        ? N3.DataFactory.literal(stmt.object.value)
                        : N3.DataFactory.namedNode(stmt.object.value)
                );
            });
        } else {
            // Use N3 parser for Turtle, N3, N-Triples
            const parser = new N3.Parser();
            
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
        }

        const writer = new N3.Writer({ format: format });
        let output = '';
        
        store.forEach((quad) => {
            writer.addQuad(quad);
        }, null, null, null, null);
        
        writer.end((error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            output = result;
        });

        res.json({
            success: true,
            format: format,
            content: output
        });

    } catch (error) {
        console.error('Error converting RDF:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get class hierarchy
router.post('/hierarchy', async (req, res) => {
    try {
        const { filename } = req.body;
        
        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', filename);
        const fileContent = await fs.readFile(filePath, 'utf8');
        
        const classes = new Map();
        const subClassRelations = [];
        
        // Detect format
        const isRdfXml = fileContent.trim().startsWith('<?xml') || fileContent.trim().startsWith('<rdf:RDF');
        
        if (isRdfXml) {
            // Use rdflib for RDF/XML
            const store = $rdf.graph();
            let parseError = null;
            
            try {
                $rdf.parse(fileContent, store, 'http://example.org/', 'application/rdf+xml');
            } catch (e) {
                parseError = e;
            }
            
            if (parseError) {
                throw new Error('Failed to parse RDF/XML hierarchy: ' + parseError.message);
            }
            
            // Extract hierarchy information
            const statements = store.statements;
            statements.forEach(stmt => {
                const subjectUri = stmt.subject.value;
                const predicateUri = stmt.predicate.value;
                const objectUri = stmt.object.value;
                
                // Find classes
                if (predicateUri === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
                    objectUri === 'http://www.w3.org/2002/07/owl#Class') {
                    classes.set(subjectUri, {
                        uri: subjectUri,
                        label: subjectUri.split(/[/#]/).pop(),
                        children: []
                    });
                }
                
                // Find subclass relations
                if (predicateUri === 'http://www.w3.org/2000/01/rdf-schema#subClassOf') {
                    subClassRelations.push({
                        child: subjectUri,
                        parent: objectUri
                    });
                }
            });
        } else {
            // Use N3 parser for Turtle, N3, N-Triples
            const parser = new N3.Parser();
            
            await new Promise((resolve, reject) => {
                parser.parse(fileContent, (error, triple, prefixes) => {
                    if (error) {
                        reject(error);
                    } else if (triple) {
                        // Find classes
                        if (triple.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
                            triple.object.value === 'http://www.w3.org/2002/07/owl#Class') {
                            classes.set(triple.subject.value, {
                                uri: triple.subject.value,
                                label: triple.subject.value.split(/[/#]/).pop(),
                                children: []
                            });
                        }
                        
                        // Find subclass relations
                        if (triple.predicate.value === 'http://www.w3.org/2000/01/rdf-schema#subClassOf') {
                            subClassRelations.push({
                                child: triple.subject.value,
                                parent: triple.object.value
                            });
                        }
                    } else {
                        resolve();
                    }
                });
            });
        }

        // Build hierarchy tree
        const roots = [];
        const classMap = new Map(classes);
        
        subClassRelations.forEach(rel => {
            const parent = classMap.get(rel.parent);
            const child = classMap.get(rel.child);
            
            if (parent && child) {
                parent.children.push(child);
            }
        });
        
        // Find root classes (no parent)
        classMap.forEach((cls, uri) => {
            const hasParent = subClassRelations.some(rel => rel.child === uri);
            if (!hasParent) {
                roots.push(cls);
            }
        });

        res.json({
            success: true,
            hierarchy: roots.length > 0 ? roots : Array.from(classMap.values())
        });

    } catch (error) {
        console.error('Error building hierarchy:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
