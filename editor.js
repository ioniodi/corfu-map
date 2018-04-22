// The Google Map.
var map;

var geoJsonOutput;
var show_hide_json_btn;
var downloadLink;

function init() {
  // Initialise the map.
  map = new google.maps.Map(document.getElementById('map-holder'), {
    center: {lat: 39.623675, lng: 19.923615},
    zoom: 16,
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

  bindDataLayerListeners(map.data);

  // Retrieve HTML elements.
  var mapContainer = document.getElementById('map-holder');
  geoJsonOutput = document.getElementById('geojson-output');
  show_hide_json_btn = document.getElementById('show_hide_geojson');
  downloadLink = document.getElementById('download-link');
	
  map.data.addListener('click', function(event) {
        active_feature = event;
        add_rating_popup(event);
    });
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
  dataLayer.addListener('addfeature', refreshGeoJsonFromData);
  dataLayer.addListener('removefeature', refreshGeoJsonFromData);
  dataLayer.addListener('setgeometry', refreshGeoJsonFromData);
}
function add_rating_popup(data) {
    if(info_window) {
        info_window.close();
    }
    info_window = new google.maps.InfoWindow({
        content: '<h3>Average Rating: '+get_avg(data.feature.getProperty("ratings")).toFixed(1)+'</h3><h3>Add new rating</h3><select id="new_rating"><option value="1">nope(1)</option><option value="2">meh(2)</option><option value="3">maybe(3)</option><option value="4">ok(4)</option><option value="5">axne(5)</option></select>' +
        '\t&nbsp;\t&nbsp;<button onclick="add_rating()">Add Rating</button><br><br><br><a onclick="remove_active_feature()" href="#">Remove this</a>',
        position: data.latLng
    });
    info_window.open(map);
    google.maps.event.addListener(info_window,'closeclick',function(){
        active_feature = null;
    });
}
function remove_all_features() {
    var alert = confirm("Are you sure?");
    if (alert == true) {
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });
        refreshGeoJsonFromData();
    }
}
function remove_active_feature() {
    if(active_feature) {
        map.data.remove(active_feature.feature);
        close_infowindow();
    }
    refreshGeoJsonFromData();
}
