// The Google Map.
var map;
var PropertyValue = "unknown";
var Window;
var geoJsonOutput;
var downloadLink;
var fornow;

function init() {
  // Initialise the map.
  map = new google.maps.Map(document.getElementById('map-holder'), {
    center: {lat: 39.622726, lng: 19.919312},
    zoom: 16,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeId: 'satellite'
  });
	
  map.data.loadGeoJson("data/2016016_review.geojson");

  map.data.setControls(['Point', 'LineString', 'Polygon']);
  map.data.setStyle({
    editable: true,
    draggable: true,
    clickable: true
  });

  map.data.addListener('rightclick',function(undo){
    map.data.remove(undo.feature);
  });

  map.data.setStyle(function(feature) {
        var color = "white";
        if (feature.getProperty("Rating") == null && feature.getProperty("Color") == null ) {
            feature.setProperty("Rating", PropertyValue);
            feature.setProperty("Color", PropertyValue);
        }
        if (feature.getProperty("Color") != PropertyValue) {
            var color = feature.getProperty("Color");
        }
        return ({
            strokeColor: color,
            strokeWeight: 4
	});
   });

  map.data.addListener('click',function(choose){
  		fornow = choose.feature;
  		map.data.revertStyle();
  		map.data.overrideStyle(fornow, {strokeWeight: 10});

  });

  bindDataLayerListeners(map.data);

// Retrieve HTML elements.
  Window = document.getElementById('Window');
  var mapContainer = document.getElementById('map-holder');
  geoJsonOutput = document.getElementById('geojson-output');
  downloadLink = document.getElementById('download-link');

  resizeGeoJsonInput();
  google.maps.event.addDomListener(window, 'resize', resizeGeoJsonInput);
}

google.maps.event.addDomListener(window, 'load', init);

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

//function that shows or hides the geojson output on the screen
function showButton() {
        var my_disply = document.getElementById('geojson-output').style.display;
        if(my_disply == "none")
              document.getElementById('geojson-output').style.display = "block";
        else
              document.getElementById('geojson-output').style.display = "none";
}

function resizeGeoJsonInput() {
  var geoJsonOutputRect = geoJsonOutput.getBoundingClientRect();
  var WindowRect = Window.getBoundingClientRect();
  geoJsonOutput.style.height = WindowRect.bottom - geoJsonOutputRect.top - 8 + "px";
}

function DeleteEverythingMwromo(){
	map.data.forEach(function(feature) {
        map.data.remove(feature);
    });
}

function Ratings(int) {
	var color;
	var rating = int;
	switch(int){
		case 1:
			color = 'red';
			break;
		case 2:
			color = 'yellow';
			break;
		case 3:
			color = 'white';
			break;
		case 4:
			color = 'blue';
			break;
		case 5:
			color = 'green';
			break;	
	}
	fornow.setProperty("Rating", rating);
	fornow.setProperty("Color", color);
}