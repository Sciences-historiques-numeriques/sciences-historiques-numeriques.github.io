


* [AllegroGraph 8.3.1 SPARQL tutorial](https://franz.com/agraph/support/documentation/sparql-tutorial.html#SPARQL-syntax)

```sparql
prefix : <http://example#>
INSERT DATA {  
:john :knows :karen ;  
      :name "John" .  
:karen :knows :alex ;  
       :name "Karen" .  
:alex :name "Alex" . 
}
```

```sparql
# View triples
SELECT ?s ?p ?o { ?s ?p ?o . }
```
