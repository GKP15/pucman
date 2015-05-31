/**
 * saves the highscore
 */
function savescoredata(id, player, score) {

		// count number of entries for new update
		var numb = 0 ;
		var exists = true;
		// Base URL Adress for RDF Database
		apiUrlBase = "http://pcai042.informatik.uni-leipzig.de:1540/sparql?default-graph-uri=pucman&query=";
		
		do {
			// Query for URL
			apiUrlData = "PREFIX%20puchs%3A%20%3Chttp%3A%2F%2Fpcai042.informatik.uni-leipzig.de%3A1540%2Fpm%2Fhighscore%2F%3E%0APREFIX%20pucvoc%3A%20%3Chttp%3A%2F%2Fpcai042.informatik.uni-leipzig.de%3A1540%2Fpm%2Fschema%2F%3E%0A%0AASK%0AWHERE%20%7B%0Apuchs%3A"
			+ id + player + numb + "%20a%20pucvoc%3AHighscore%20.%0A%7D";
			
	//		"PREFIX%20puchs%3A%20%3Chttp%3A%2F%2Flocalhost%2Fpm%2Fhighscore%2F%3E%0APREFIX%20pucvoc%3A%20%3Chttp%3A%2F%2Flocalhost%2Fpm%2Fschema%2F%3E%0A%0AASK%0AWHERE%20%7B%0Apuchs%3A"
	//		+ id + player + numb + "%20a%20pucvoc%3AHighscore%20.%0A%7D";
			
			// asking Data
			$.ajax({
				url: apiUrlBase + apiUrlData,
				crossDomain: true,
				method: "GET",
				//DataType: 'json',
				async: false,
				success: function(data) {
					console.log("Data: " + data); //LOG
					// If Answer true -> Entry already exist; try next higher number
					if (data == true) {
						numb++;
					// Else: Exit
					} else {
						exists = false;
					}
				}
			});
			console.log("number: " + numb + " existiert: " + exists); // LOG
		}
		while (exists == true);
		
};
