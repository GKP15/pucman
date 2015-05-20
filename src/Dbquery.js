function rdfmarkerget() {

	// create array with markers
	var markerlist = [];
	
		$.getJSON( "resources/query" , function( data ) {
			// create marker array
			var markerelement = [];
			var bindings = data.results.bindings;
			for(var i in bindings) {
				markerelement = [bindings[i].City.value, bindings[i].long.value, bindings[i].lat.value, bindings[i].Person.value, bindings[i].Score.value];
				markerlist.push(markerelement);
				markerelement = null;
			};
		});
	return markerlist;
};
/*$.getJSON( "query" , function( data ) {
             
// get the sparql variables from the 'head' of the data.
    var headerVars = data.head.vars; 
// grab the actual results from the data.                                          
    var bindings = data.results.bindings;

	var i = 0;
//	for(var i in bindings) {
	markerelement = [bindings[i].City.value, bindings[i].long.value, bindings[i].lat.value, bindings[i].Person.value, bindings[i].Score.value];
//	}
console.log(markerelement);

// output query objects
for(var i in bindings) {
console.log("City"+[i]+": " + bindings[i].City.value);
console.log("long"+[i]+": " + bindings[i].long.value);
console.log("lat"+[i]+" : " + bindings[i].lat.value);
console.log("Person"+[i]+": " + bindings[i].Person.value);
console.log("Score"+[i]+": " + bindings[i].Score.value); }

});*/

