// The Google Map.
var map;
var scale="unknown";
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
	var color = "#f5f5f5";
        if (feature.getProperty("Rating") == null && feature.getProperty("Color") == null ) {
            feature.setProperty("Rating", scale);
            feature.setProperty("Color", scale);
        }
        if (feature.getProperty("Color") != scale) {
            var color = feature.getProperty("Color");
        }
        return ({
            strokeColor: color,
            strokeWeight:4 
        });

    });
  bindDataLayerListeners(map.data);
  //load rating
  map.data.loadGeoJson("data/2016201.geojson");
  map.data.addListener('mouseover',function (event){map.data.overrideStyle(event.feature,{strokeWeight:5});});
  map.data.addListener('mouseout',function (event){map.data.overrideStyle(event.feature,{strokeWeight:3});});
  //rate path with click
  map.data.addListener('click',function (event){ scaleOfPath(event)});
  //delete path with right click
  map.data.addListener('rightclick',function (event){erasePath(event)});
  
  // Retrieve HTML elements.
  var mapContainer = document.getElementById('map-holder');
  geoJsonOutput = document.getElementById('geojson-output');
  downloadLink = document.getElementById('download-link');
}

google.maps.event.addDomListener(window, 'load', init);

// Refresh different components from other components.
function refreshGeoJsonFromData() {
  map.data.toGeoJson(function(geoJson) {
    geoJsonOutput.value = JSON.stringify(geoJson);
    refreshDownloadLinkFromGeoJson();
  });
}

// Refresh download link.
function refreshDownloadLinkFromGeoJson() {
  downloadLink.href = "data:;base64," + btoa(geoJsonOutput.value);
}

// Apply listeners to refresh the GeoJson display on a given data layer.
function bindDataLayerListeners(dataLayer) {
  dataLayer.addListener('setproperty', refreshGeoJsonFromData);
  dataLayer.addListener('addfeature', refreshGeoJsonFromData);
  dataLayer.addListener('removefeature', refreshGeoJsonFromData);
  dataLayer.addListener('setgeometry', refreshGeoJsonFromData);
}
function geojsonOutput(){
  var a=document.getElementById("geojson-output");
  if (a.style.display=="none"){
      a.style.display="block";
  } else {
      a.style.display="none";
  }
}
function eraseThemAll() {
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
function erasePath(event) {
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
function scaleOfPath (event) {
    bootbox.prompt({
        title: "Path rating",
        inputType: 'checkbox',
        backdrop: true,
        inputOptions: [
            {
                text: '1',
                scale: '1',
            },
            {
                text: '2',
                scale: '2',
            },
            {
                text: '3',
                scale: '3',
            },
            {
                text: '4',
                scale: '4',
            },
            {
                text: '5',
                scale: '5',
            }
        ],
        callback: function (result) {
            if (result != null) {

                var rating = "unknown";

                if (result == 1) {
                    rating = 1;
                    setColor(event, '#190000');
                }
                else if (result == 2) {
                    rating = 2;
                    setColor(event, '#660000');
                }
                else if (result == 3) {
                    rating = 3;
                    setColor(event, '#990000');
                }
                else if (result == 4) {
                    rating = 4;
                    setColor(event, '#CC0000');
                }
                else if (result == 5) {
                    rating = 5;
                    setColor(event, '#FF0000');
                }
                else {
                    bootbox.alert("Please, select one rating!");
                }
                event.feature.setProperty('Rating', rating);
            }
        }
    });
}

