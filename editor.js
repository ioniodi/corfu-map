// The Google Map.
var map;

var geoJsonOutput;
var downloadLink;

function init() {
  // Initialise the map.
  map = new google.maps.Map(document.getElementById('map-holder'), {
    center: {lat: 39.618199, lng: 19.8999581},
    zoom: 15,
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

map.data.setStyle(function(feature) {
	var color = "#d3d3d3";
        if (feature.getProperty("Rating") == null && feature.getProperty("Color") == null ) {
            feature.setProperty("Rating", value);
            feature.setProperty("Color", value);
        }
        if (feature.getProperty("Color") != value) {
            var color = feature.getProperty("Color");
        }
        return ({
            strokeColor: color,
            strokeWeight: 3
        });

    });
  bindDataLayerListeners(map.data);
  //load rating
  map.data.loadGeoJson("data/2016096.geojson");
  //rate path with click
  map.data.addListener('click',function (event){ rPath(event)});
  //delete path with right click
  map.data.addListener('rightclick',function (event){dPath(event)});
  map.data.addListener('mouseover',function (event){map.data.overrideStyle(event.feature,{strokeWeight:5});});
  map.data.addListener('mouseout',function (event){map.data.overrideStyle(event.feature,{strokeWeight:3});});
  // Retrieve HTML elements.
  var mapContainer = document.getElementById('map-holder');
  geoJsonOutput = document.getElementById('geojson-output');
  downloadLink = document.getElementById('download-link');
}

google.maps.event.addDomListener(window, 'load', init);

// Refresh different components from other components.
function refreshGeoJsonFromData() {
  map.data.toGeoJson(function(geoJson) {
    geoJsonOutput.value = JSON.stringify(geoJson, null, "\t");
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
function geojsonOutput(){
  var a=document.getElementById("geojson-output");
  if (a.style.display=="none"){
      a.style.display="block";
  } else {
      a.style.display="none";
  }
}
function dAPaths() {
    bootbox.confirm({
        message: "Delete all the paths?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result == true) {
                map.data.forEach(function(feature) {
                    map.data.remove(feature);
                });
            }
        }
    });
}
function rPath (event) {
    bootbox.prompt({
        title: "Path rating",
        inputType: 'checkbox',
        backdrop: true,
        inputOptions: [
            {
                text: 'Very bad',
                value: '1',
            },
            {
                text: 'Bad',
                value: '2',
            },
            {
                text: 'Ok',
                value: '3',
            },
            {
                text: 'Good',
                value: '4',
            },
            {
                text: 'Very good',
                value: '5',
            }
        ],
        callback: function (result) {
            if (result != null) {

                var rating = "unknown";

                if (result == 1) {
                    rating = 1;
                    setColor(event, '#FF0000');
                }
                else if (result == 2) {
                    rating = 2;
                    setColor(event, '#EE7600');
                }
                else if (result == 3) {
                    rating = 3;
                    setColor(event, '#FFFF00');
                }
                else if (result == 4) {
                    rating = 4;
                    setColor(event, '#00FF00');
                }
                else if (result == 5) {
                    rating = 5;
                    setColor(event, '#0000FF');
                }
                else {
                    bootbox.alert("Please, select one rating!");
                }
                event.feature.setProperty('Rating', rating);
            }
        }
    });
}
function dPath(event) {
    bootbox.confirm({
        message: "Delete this path?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result == true) {
                map.data.remove(event.feature);
            }
        }
    });
}
function setColor(event, value) {
    color = value;
    map.data.overrideStyle(event.feature, {
        strokeColor: value
    });
    event.feature.setProperty("Color", value);
}
