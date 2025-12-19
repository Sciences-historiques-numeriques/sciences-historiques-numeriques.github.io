//const sparqlEndpoint = 'https://sparql.geovistory.org/api_v1_project_1483135';
//const sparqlEndpoint = 'https://ag1yqae8nwnhv3g7.allegrograph.cloud/repositories/science-history';

const sparqlEndpoint = 'https://fberetta.lod4hss.cloud/wisski/endpoint/default'

// Convert CSV-like response (with header) to JSON array of objects
// works with two columns, probably not with more
function csvToJSON(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      // Convert to number if possible
      obj[header] = isNaN(values[i]) ? values[i] : Number(values[i]);
    });
    return obj;
  });
}

const sparqlQuery = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?classLabel (count(*) as ?number)
WHERE {
    ?s a ?class.
    ?class rdfs:label ?classLabel
}
GROUP BY ?classLabel ?class
order by DESC(?number)
offset 7
limit 10`;
console.log(sparqlQuery)

// Encode query for URL
const encodedQuery = encodeURIComponent(sparqlQuery);


// Construct GET URL with query parameter
const getUrl = `${sparqlEndpoint}?query=${encodedQuery}`;

//console.log(getUrl)


fetch(getUrl, {
  method: 'GET',
  headers: {
    'Accept': 'application/sparql-results+json'  // Still include this for good measure
  }
})
.then(response => response.text()) // ← Get as TEXT, not JSON
.then(csvText => {
  // Parse CSV to JSON array of objects
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(','); // First row = column names

  const jsonData = lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      // Convert to number if possible, otherwise keep as string
      obj[header] = isNaN(values[i]) ? values[i] : Number(values[i]);
    });
    return obj;
  });

  return jsonData; // Return parsed JSON
})
.then(data => {
  console.log(data)

  // clean the data
  const cleanedData = data.map(item => {
  const cleaned = {};
  for (let key in item) {
    const cleanKey = key.replace(/\s+/g, ' ').trim(); // Normalize whitespace
    cleaned[cleanKey] = item[key];
  }
  return cleaned;
  });

  console.log(cleanedData)
 // Extract labels and counts from the results
 const labels = cleanedData.map(result => result.classLabel);
 const counts = cleanedData.map(result => result.number);

 // Set up the dimensions and margins for the chart
 const margin = { top: 20, right: 20, bottom: 100, left: 40 };
 const width = 600 - margin.left - margin.right;
 const height = 400 - margin.top - margin.bottom;

 // Create the SVG container
 const svg = d3.select('#chart')
   .append('svg')
   .attr('width', width + margin.left + margin.right)
   .attr('height', height + margin.top + margin.bottom)
   .append('g')
   .attr('transform', `translate(${margin.left}, ${margin.top})`);

 // Create scales for x and y axes
 const x = d3.scaleBand()
   .domain(labels)
   .range([0, width])
   .padding(0.1);

const maxCount = d3.max(counts) || 0; // fallback if all NaN or empty
const y = d3.scaleLinear()
  .domain([0, maxCount])
  .range([height, 0]);

 // Add x and y axes
 svg.append('g')
   .attr('transform', `translate(0, ${height})`)
   .call(d3.axisBottom(x)) .selectAll("text")
   .style("text-anchor", "end")
   .attr("dx", "-.8em")
   .attr("dy", ".15em")
   .attr("transform", "rotate(-30)");

 svg.append('g')
   .call(d3.axisLeft(y));


// Add chart title
svg.append("text")
.attr("x", width*0.5)
.attr("y", height*0.2)
.attr("font-size", "14px")
//.attr("font-weight", "bold")
.text("Most frequent classes")
.append("tspan")
.attr("x", width*0.5)
.attr("dy", "1.2em")
.append("a")
.attr("xlink:href", sparqlEndpoint)
.attr("target", "_blank") 
.style("text-decoration", "underline")
.style("fill", "blue")
.text("your triplestore");





 // Create bars
 svg.selectAll('.bar')
   .data(counts)
   .enter().append('rect')
   .attr('class', 'bar')
   .attr('x', (d, i) => x(labels[i]))
   .attr('y', d => y(d))
   .attr('width', x.bandwidth())
   .attr('height', d => height - y(d))
   .attr("fill", "#add8e6");
})
.catch(error => console.error('Error:', error));