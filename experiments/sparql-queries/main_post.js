//const sparqlEndpoint = 'https://sparql.geovistory.org/api_v1_project_1483135';
//const sparqlEndpoint = 'https://ag1yqae8nwnhv3g7.allegrograph.cloud/repositories/science-history';
const sparqlEndpoint = 'https://fberetta.lod4hss.cloud/wisski/endpoint/default'


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
limit 10
`;
console.log(sparqlQuery)

fetch(sparqlEndpoint, {
 method: 'POST',
 headers: {
   'Content-Type': 'application/x-www-form-urlencoded',
   'Accept': 'application/sparql-results+json'
 },
 body: new URLSearchParams({ query: sparqlQuery })
})
.then(response => response.json())
.then(data => {
 // Process the data and create the bar chart
 const results = data.results.bindings;
   
 // Extract labels and counts from the results
 const labels = results.map(result => result.classLabel.value);
 const counts = results.map(result => parseInt(result.number.value));

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

 const y = d3.scaleLinear()
   .domain([0, d3.max(counts)])
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
.text("Most frequent classes in the")
.append("tspan")
.attr("x", width*0.5)
.attr("dy", "1.2em")
.append("a")
.attr("xlink:href", "https://www.geovistory.org/project/1483135")
.attr("target", "_blank") 
.style("text-decoration", "underline")
.style("fill", "blue")
.text("Academic Education & Careers project");




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