var domReady = function (callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

//all main application logic should go here - this loads when the page is ready
domReady(function () {
	console.log("DOM loaded");
	document.getElementById("search").onclick = function () {

		var query = getMovieSearchUrl(document.getElementById("query").value)

		getJSON(query, writeMovieList);
	};
});

//write out the search results for a query
function writeMovieList(data) {

	var resultsElem = document.getElementById("results");

	if (data == null || data.Response === "False") {
		resultsElem.innerHTML = "Too many results!  Try a more specific query.";
		return;
	}
	
	//clear out the results element
	resultsElem.innerHTML = "";
	
	//TODO: add some error checking here
	//loop through each of the movies and output a row for each
	data.Search.forEach(function (movie) {
		//build favorite button
		var favoriteBtn = document.createElement("button");
		favoriteBtn.className = "favoriteBtn";
		favoriteBtn.innerHTML = 'Favorite';
		favoriteBtn.onclick = function () {
			markFavorite(movie.Title);
		};
		
		//build details div
		var detailsDiv = document.createElement("div");
		detailsDiv.className = "detailsHolder";
				
		//build movie span
		var movieSpan = document.createElement("span");
		movieSpan.title = "Click for details on " + movie.Title;
		movieSpan.onclick = function () {
			showDetails(detailsDiv, movie.imdbID);
		}
		movieSpan.innerHTML = movie.Title;
				
		//build div to hold the button and span
		var div = document.createElement("div");
		div.className = "movieHolder";

		//wait until the end to append the actual div to the DOM for efficiency
		div.appendChild(favoriteBtn);
		div.appendChild(movieSpan);
		resultsElem.appendChild(div);
		resultsElem.appendChild(detailsDiv);
	});
}

//hit the OMDB API with the movie's ID to get detailed information
function showDetails(detailsElement, id) {
	getJSON(getMovieDetailsUrl(id), function (data) {
		
		//clear out the details element
		detailsElement.innerHTML = "";
		
		//create a container to hold all of the elements as we are building them
		var detailsContainer = document.createElement("span");
		
		//build out the various details elements
		//TODO: Add more details

		var actors = document.createElement("div");
		actors.innerHTML = "Actors: " + data.Actors;
		detailsContainer.appendChild(actors);

		var director = document.createElement("div");
		director.innerHTML = "Director: " + data.Director;
		detailsContainer.appendChild(director);

		var plot = document.createElement("div");
		plot.innerHTML = "Plot: " + data.Plot;
		detailsContainer.appendChild(plot);

		//add the details to the page
		detailsElement.appendChild(detailsContainer);
	});
}

//helper function to get the URL for a movie search
function getMovieSearchUrl(title) {
	return "https://www.omdbapi.com/?s=" + title.replace(" ", "+") + "&r=json";
}

//helper function to get the URL for a detailed search by ID
function getMovieDetailsUrl(id) {
	return "https://www.omdbapi.com/?i=" + id + "&r=json";
}

//retrieves JSON as a GET from the given path
function getJSON(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
			var data = JSON.parse(httpRequest.responseText);
			if (callback) callback(data);
		}
    };
    httpRequest.open("GET", path);
    httpRequest.send();
}

//sends a favorite to the "back end" for saving and alerts with a user-readable message
function markFavorite(data) {	
	// construct an HTTP request
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/favorites", true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	// send the collected data as JSON
	xhr.send(JSON.stringify(data));

	xhr.onloadend = function () {
		alert(xhr.response);
	};
}