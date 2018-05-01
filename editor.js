// The Google Map.
var map;
var geoJsonOutput;
var show_hide_json_btn;
var downloadLink;
var info_window;
var active_feature;

function init() {
  // Initialise the map.
  map = new google.maps.Map(document.getElementById('map-holder'), {
    center: {lat: 39.620406, lng: 19.913364},
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
	
    map.data.loadGeoJson("data/2013108_review.geojson");
    map.data.setStyle(function(feature) {
       var avg = get_avg(feature.getProperty('ratings'));
       var color = "hsl("+avg*24+",100%,50%)";
       return {
               fillColor: color,
               strokeColor: color,
               strokeWeight: 5
       }
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

function refresh_feature_style(feature) {
    map.data.overrideStyle(feature, function() {
        var avg = get_avg(feature.getProperty('ratings'));
        var color = "hsl("+avg*24+",100%,50%)";
        return {
            fillColor: color,
            strokeColor: color
        }
    });
}

google.maps.event.addDomListener(window, 'load', init);

function add_rating_popup(data) {
    if(info_window) {
        info_window.close();
    }
    info_window = new google.maps.InfoWindow({
        content: '<h3>Average Rating: '+get_avg(data.feature.getProperty("ratings")).toFixed(1)+'</h3><h3>Add new rating</h3><select id="new_rating"><option value="1">very bad(1)</option><option value="2">bad(2)</option><option value="3">normal(3)</option><option value="4">good(4)</option><option value="5">very good(5)</option></select>' +'\t&nbsp;\t&nbsp;<button onclick="add_rating()">Add Rating</button><br><br><br><a onclick="remove_active_feature()" href="#">Remove this</a>',position: data.latLng
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

function close_infowindow() {
    if(info_window) {
        info_window.close();
    }
    active_feature = null;
}

function add_rating() {
    if(active_feature) {
        var rating_value = document.getElementById('new_rating').value;
        var ratings = active_feature.feature.getProperty("ratings");
        if (!ratings) {
            ratings = [];
        }
        ratings.push(rating_value);
        active_feature.feature.setProperty("ratings", ratings);
        active_feature.feature.setProperty("rating", Math.floor(get_avg(ratings)));
    }
    refresh_feature_style(active_feature.feature);
    close_infowindow();
    refreshGeoJsonFromData();
}

function get_avg(arr) {
    if(arr && arr.length>0) {
        var avg = 0;
        arr.forEach(function (value) {
            avg += parseInt(value);
        });
        return avg / arr.length;
    }
    return 0;
}

function show_hide_json() {
    var status = geoJsonOutput.style.display==="block";
    geoJsonOutput.style.display = !status?"block":"none";
    show_hide_json_btn.innerText = status?"Show JSON":"Hide JSON";
}

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

function add_feature(feature) {
    feature.feature.setProperty("rating", "unknown");
    refreshGeoJsonFromData();
}

// Apply listeners to refresh the GeoJson display on a given data layer.
function bindDataLayerListeners(dataLayer) {
  dataLayer.addListener('addfeature', refreshGeoJsonFromData);
  dataLayer.addListener('removefeature', refreshGeoJsonFromData);
  dataLayer.addListener('setgeometry', refreshGeoJsonFromData);
}
