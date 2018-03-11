// The Google Map.
var map;

var geoJsonOutput;
var downloadLink;

var mapContainer;

//data box variables
var dataBox;
var dataContainer;

//selection variables
var selected = [];
var isSelected = false;
var feat;
var index= 0;

//value of the rating of the feature
var value = "unknown";

function init() {
  map = new google.maps.Map(document.getElementById('map-holder'), {
    center: {lat: 39.623, lng: 19.914},
    zoom: 17,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeId: 'satellite'
  });
	
  map.data.setControls(['Point', 'LineString', 'Polygon']);
  map.data.setStyle({
  	editable: true,
  	draggable: true,
  	clickable: true
  });
	
  //sets the style in the features
  map.data.setStyle(function(feature) {
	//default color
        var color = "white";
	// sees if the rating and the color isnt null so it can proseed
        if (feature.getProperty("Rating") == null && feature.getProperty("Color") == null) {
            feature.setProperty("Rating", value);
	    feature.setProperty("Color", value);
        }
	//looks if the color is null and if it is then it sets it to the right one
        if (feature.getProperty("Color") != value) {
            var color = feature.getProperty("Color");
        }
        return ({
            strokeColor: color,
            strokeWeight: 4
        });
    });
	
  //when the user clicks on a feature
  map.data.addListener("click",function(clicking){	
	feat= clicking.feature;
	//sets the boolean to true if the current selected was already selected.
	//sets the boolean to false if the current one wasnt found in the selected array.
 	for(i=0;i<=index;i++){
		if(feat === selected[i]){			  
			console.log("isSelected = true");
			isSelected = true;
			//if it finds that it was already selected it breaks.
			break;
		}else{
			console.log("isSelected = false");
			isSelected = false;
		}
	}
	//if the boolean is false then it procceds to select the feature and adds in the array.
	//if not then it resets the style of the selected object(de-selects it).
	if(isSelected == false){
		console.log("it wasnt selected");
		//visualisation of the selection.
		map.data.overrideStyle(feat , {strokeWeight: 8});
		//puts the currently selected feature in an array.
		selected[index] = feat;
		//increases the size of the array.
		index++;
	}else{
		console.log("it was selected already");
		//its not selected anymore so we delete it from the array. 
		var n=0;
		//loops as many times as there is points in the array
		for(n=0;n<=index;n++){
			console.log("before: \n n: "+n+"\n selected: "+selected[n]+"\n index: "+index);
			//a statement that finds in the selected array the one that is similar to the currently selected
			if(feat === selected[n]){
				//when it finds it ,it sets the selected array in the point its right now to zero
				console.log("it entered the if statement");
				selected[n] = 0;	
				//decreses the size of the array
				index--;
				console.log("after: \n n: "+n+"\n selected: "+selected[n]+"\n index: "+index);			 
				//resets the visualisation of the selection.
				map.data.revertStyle(feat);
				//breaks out of the
				break;
			}						
		}
	}
  });
	
  bindDataLayerListeners(map.data);
  
  //load the json file	
  map.data.loadGeoJson("data/geojson.json");	
	
  // Retrieve HTML elements.
  dataContainer = document.getElementById('data-container');
  dataBox = document.getElementById('dataBox');	
	
  mapContainer = document.getElementById('map-holder');
  geoJsonOutput = document.getElementById('geojson-output');
  downloadLink = document.getElementById('download-link');
	
  displayStyle = document.getElementById('geojson-output').style.display;
	
  resize();
	
  [mapContainer, dataContainer].forEach(function(container) {
    google.maps.event.addDomListener(container, 'drop', handleDrop);
    google.maps.event.addDomListener(container, 'dragover', showDataBox);
  });

  google.maps.event.addDomListener(mapContainer, 'dragstart', showDataBox);
  google.maps.event.addDomListener(mapContainer, 'dragenter', showDataBox);	
	
  google.maps.event.addDomListener(dataContainer, 'dragend', hideDataBox);
  google.maps.event.addDomListener(dataContainer, 'dragleave', hideDataBox);
	
  google.maps.event.addDomListener(geoJsonOutput,'output',refreshDataFromGeoJson);
  google.maps.event.addDomListener(geoJsonOutput,'output',refreshDownloadLinkFromGeoJson);
	
  google.maps.event.addDomListener(window, 'resize', resize);
}

//displays the data of the map(json file)
function showButton() {
        var my_disply = document.getElementById('geojson-output').style.display;
        if(my_disply === "none"){
        	document.getElementById('geojson-output').style.display = "block";
	}else{
        	document.getElementById('geojson-output').style.display = "none";
	}
}

google.maps.event.addDomListener(window, 'load', init);

//rating 
//loops to find all the selected features that we gonna rate.
//visualisies the rating by coloring the all the selected features.
//sets the value of the array in the i position so the selected array will be empty after the rating.
//sets the index to 0 to reset the size of the array.
function ratingFunction(int,col){
	this.int = int;
	this.col = col;
	for(i=0;i<=index;i++){
		var currentFeature = selected[i];
// 		map.data.overrideStyle(currentFeature ,{
// 			strokeWeight: 1, 
// 			strokeColor: col 
// 		});
		
		//takes the value of the feature that is in the array in the i position.
// 		currentFeature.setProperty("Color", col);
// 		currentFeature.setProperty("Rating", int);
		map.data.setStyle(function(currentFeature){
			currentFeature.feature.setProperty("Color", col);
			currentFeature.feature.setProperty("Rating", int);
		});
		//clears the position i in the selected array.
		selected[i]=0;
// 		console.log("rating: "+currentFeature.feature.getProperty("Rating"));
// 		console.log("\n value: "+currentFeature.value);
	}
	index=0;
}
function Rating1(){
	ratingFunction(1,'red');
}
function Rating2(){
	ratingFunction(2,'yellow');
}
function Rating3(){
	ratingFunction(3,'white');
}
function Rating4(){
	ratingFunction(4,'blue');
}
function Rating5(){
	ratingFunction(5,'green');
}

//clear function
//selectes all the features
//removes them
function Clear(){	
	map.data.forEach(function(feature){
		map.data.remove(feature);
	});
}

//deletes the selected.
//loops and deletes all the points in the array.
//resets the size of the array.
function DeleteSel(){
	for(i=0;i<=selected.length;i++){
		map.data.remove(selected[i]);
	}
	index= 0;
}

function showDataBox(e) {
  e.stopPropagation();
  e.preventDefault();
  dataContainer.className = 'visible';
  return false;
}

function hideDataBox() {
  dataContainer.className = '';
}

// Refresh different components from other components.
function refreshGeoJsonFromData() {
  map.data.toGeoJson(function(geoJson) {
    geoJsonOutput.value = JSON.stringify(geoJson, null, 2); 
    refreshDownloadLinkFromGeoJson();
  });
}

// Refresh download link.
function refreshDownloadLinkFromGeoJson() {
  downloadLink.href = "data:;base64," + btoa(geoJsonOutput.value);
}

// Apply listeners to refresh the GeoJson display on a given data layer.
function bindDataLayerListeners(dataLayer) {
  dataLayer.addListener('addfeature', refreshGeoJsonFromData);
  dataLayer.addListener('removefeature', refreshGeoJsonFromData);
  dataLayer.addListener('setgeometry', refreshGeoJsonFromData);
  dataLayer.addListener('setproperty', refreshGeoJsonFromData);
}

function refreshDataFromGeoJson(){
	var newData = new google.maps.Data({
  		map: map,
  		style: map.data.getStyle(),
  		controls: ['Point', 'LineString', 'Polygon']
  	});
	
  	try {
  		var userObject = JSON.parse(geoJsonInput.value);
  		var newFeatures = newData.addGeoJson(userObject);
  	} catch (error) {
  		newData.setMap(null);
  		if (geoJsonInput.value !== "") {
  			setGeoJsonValidity(false);
  		} else {
  			setGeoJsonValidity(true);
  		}
  		return;
  	}
  	// No error means GeoJSON was valid!
  	map.data.setMap(null);
  	map.data = newData;
  	bindDataLayerListeners(newData);
	setGeoJsonValidity(true);
}

function setGeoJsonValidity(newVal) {
	if (!newVal) {
		geoJsonOutput.className = 'invalid';
	} else {
		geoJsonOutput.className = '';
	}
}

function handleDrop(e) {
	e.preventDefault();
	e.stopPropagation();
	hideDataBox();

	var files = e.dataTransfer.files;
	if (files.length) {
		// process file(s) being dropped
		// grab the file data from each file
		for (var i = 0, file; file = files[i]; i++) {
			var reader = new FileReader();
			reader.onload = function(e) {
				map.data.addGeoJson(JSON.parse(e.target.result));
			};
			reader.onerror = function(e) {
				console.error('reading failed');
			};
			reader.readAsText(file);
		}
	} else {
		// process non-file (e.g. text or html) content being dropped
		// grab the plain text version of the data
		var plainText = e.dataTransfer.getData('text/plain');
		if (plainText) {
			map.data.addGeoJson(JSON.parse(plainText));
		}
  	};
  // prevent drag event from bubbling further
  return false;
}

function resize() {
	var geoJsonOutputRect = geoJsonOutput.getBoundingClientRect();
	var dataBoxRect = dataBox.getBoundingClientRect();
	geoJsonOutput.style.height = dataBoxRect.bottom - geoJsonOutputRect.top - 8 + "px";
}
