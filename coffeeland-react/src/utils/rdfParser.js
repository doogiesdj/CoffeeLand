import * as $rdf from 'rdflib';

export const parseRDFData = async (rdfUrl) => {
  try {
    // Fetch RDF file directly
    const response = await fetch(rdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch RDF file: ${response.statusText}`);
    }
    
    const rdfText = await response.text();
    
    // Parse RDF using rdflib
    const store = $rdf.graph();
    const contentType = 'application/rdf+xml';
    const baseURI = rdfUrl;
    
    $rdf.parse(rdfText, store, baseURI, contentType);
    
    const ontologyNS = 'http://www.semanticweb.org/boogi/ontologies/2025/11/untitled-ontology-2#';
    const ns = $rdf.Namespace(ontologyNS);
    
    // Extract all entities
    const countries = extractEntitiesByType(store, ns('Country'));
    const cities = extractEntitiesByType(store, ns('City'));
    const brands = extractEntitiesByType(store, ns('CoffeeBrand'));
    const chains = extractEntitiesByType(store, ns('CoffeeChain'));
    
    // Extract brokers (including ExportBroker and ImportBroker subtypes)
    const brokers = [
      ...extractEntitiesByType(store, ns('Broker')),
      ...extractEntitiesByType(store, ns('ExportBroker')),
      ...extractEntitiesByType(store, ns('ImportBroker'))
    ];
    
    // Extract coffee varieties
    const varieties = extractEntitiesByType(store, ns('CoffeeVariety'));
    
    // Extract relationships
    const relationships = extractRelationships(store, ontologyNS);
    
    return {
      countries,
      cities,
      brands,
      chains,
      brokers,
      varieties,
      relationships,
      store
    };
  } catch (error) {
    console.error('Error parsing RDF:', error);
    throw error;
  }
};

const extractEntitiesByType = (store, classType) => {
  const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
  const entities = store.each(null, RDF('type'), classType);
  
  return entities.map(entity => {
    const name = entity.value.split('#')[1] || entity.value.split('/').pop();
    const properties = extractProperties(store, entity);
    
    return {
      uri: entity.value,
      name: name.replace(/_/g, ' '),
      ...properties
    };
  });
};

const extractProperties = (store, subject) => {
  const statements = store.match(subject, null, null);
  const properties = {};
  
  statements.forEach(statement => {
    const predicate = statement.predicate.value.split('#')[1] || statement.predicate.value.split('/').pop();
    const object = statement.object;
    
    if (predicate !== 'type') {
      if (object.termType === 'NamedNode') {
        const objectName = object.value.split('#')[1] || object.value.split('/').pop();
        if (!properties[predicate]) {
          properties[predicate] = [];
        }
        properties[predicate].push({
          uri: object.value,
          name: objectName.replace(/_/g, ' ')
        });
      } else {
        properties[predicate] = object.value;
      }
    }
  });
  
  return properties;
};

const extractRelationships = (store, ontologyNS) => {
  const relationships = [];
  const statements = store.match(null, null, null);
  
  statements.forEach(statement => {
    const subject = statement.subject;
    const predicate = statement.predicate.value;
    const object = statement.object;
    
    if (subject.termType === 'NamedNode' && 
        object.termType === 'NamedNode' && 
        predicate.includes(ontologyNS) &&
        !predicate.includes('type')) {
      
      const predicateName = predicate.split('#')[1] || predicate.split('/').pop();
      const subjectName = subject.value.split('#')[1] || subject.value.split('/').pop();
      const objectName = object.value.split('#')[1] || object.value.split('/').pop();
      
      relationships.push({
        source: subjectName.replace(/_/g, ' '),
        target: objectName.replace(/_/g, ' '),
        type: predicateName,
        sourceUri: subject.value,
        targetUri: object.value
      });
    }
  });
  
  return relationships;
};

export const getEntityDetails = (store, entityUri) => {
  const subject = $rdf.sym(entityUri);
  return extractProperties(store, subject);
};
