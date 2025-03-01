import {sendSparqlQuery} from './sqarql-queries/my_functions.js';

// Example usage: Replace 'yourEndpoint' with your actual SPARQL endpoint URL
// and 'yourQuery' with your actual SPARQL query.
var endpoint = 'https://sparql.geovistory.org/api_v1_project_1483135';
//var endpoint = 'https://ag1yqae8nwnhv3g7.allegrograph.cloud/repositories/science-history';
var query = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?sLabel ?s (count(*) as ?number)
WHERE {?s?p?o;
a <https://ontome.net/ontology/c21>;
 rdfs:label ?sLabel
} 
 GROUP BY ?s ?sLabel
 LIMIT 20`; // Example query
sendSparqlQuery(endpoint, query);