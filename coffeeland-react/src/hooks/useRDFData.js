import { useState, useEffect } from 'react';
import { parseRDFData } from '../utils/rdfParser';

export const useRDFData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRDFData = async () => {
      try {
        setLoading(true);
        // Use absolute URL for RDFLib
        const rdfUrl = `${window.location.origin}/coffeeland.rdf`;
        const rdfData = await parseRDFData(rdfUrl);
        setData(rdfData);
        setError(null);
      } catch (err) {
        console.error('Error loading RDF data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadRDFData();
  }, []);

  return { data, loading, error };
};
