var map;

// The HTML element that contains the drop container.
var dropContainer;
var panel;
var geoJsonInput;
var downloadLink;
var Color="";

//var deleteFlag=0;
//var mouseLocation;
function init() {
  // Initialise the map.
  map = new google.maps.Map(document.getElementById('map-holder'), {
    center: {lat: 39.624107, lng: 19.922318},
    zoom: 17,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeId: 'satellite'
  });
  map.data.setControls(['Point', 'LineString', 'Polygon']);
  map.data.setStyle({
    editable: true,
    draggable: true


  });
  bindDataLayerListeners(map.data);
  map.data.setStyle({
    strokeColor: '#000000',
    strokeWeight: 3
  });
  
  /*load json*/
map.data.loadGeoJson("data/2016187_review.json");
  /*add colors*/
      map.data.setStyle(function(feature) {
        ({
            strokeColor: feature.getProperty('color'),
            
          });
      })

/*click event triggers color change depending what we chose*/
  map.data.addListener('click', function(event) {
    event.feature.setProperty("color",Color);
    map.data.overrideStyle(event.feature, {strokeColor: Color});
    refreshGeoJsonFromData();
  });
  /*right click removes feature*/
  map.data.addListener('dblclick',function(event){
    map.data.remove(event.feature);
  });





  // Retrieve HTML elements.
  dropContainer = document.getElementById('drop-container');
  panel = document.getElementById('panel');
  var mapContainer = document.getElementById('map-holder');
  geoJsonInput = document.getElementById('geojson-input');
  downloadLink = document.getElementById('download-link');
    resizeGeoJsonInput();

  google.maps.event.addDomListener(window, 'resize', resizeGeoJsonInput);
}



function ShowMenu(control, e) {
        var posx = e.clientX +window.pageXOffset +'px'; //Left Position of Mouse Pointer
        var posy = e.clientY + window.pageYOffset + 'px'; //Top Position of Mouse Pointer
        document.getElementById(control).style.position = 'absolute';
        document.getElementById(control).style.display = 'inline';
        document.getElementById(control).style.left = posx;
        document.getElementById(control).style.top = posy;
    }
    function HideMenu(control) {

        document.getElementById(control).style.display = 'none';
    }

    /*we change a global variable named color depending the button*/
   function ChangeColor( i){
     if(i==5)
       Color="#ffd700";
     else if (i==4)
      Color="#006E1F";
    else if (i==3)
      Color="#0000FF";
    else if (i==2)
      Color="#FFFF66";
    else if(i==1)
      Color="#FF3300";
   }



google.maps.event.addDomListener(window, 'load', init);
/*Show geojson button*/
function showButton() {
        var my_disply = document.getElementById('geojson-input').style.display;
        if(my_disply == "block")
              document.getElementById('geojson-input').style.display = "none";
        else
              document.getElementById('geojson-input').style.display = "block";
     }
//CLear function
function Clear(){


  map.data.forEach(function(feature) {
    // If you want, check here for some constraints.
    map.data.remove(feature);

        });
}
// Refresh different components from other components.
function refreshGeoJsonFromData() {
  map.data.toGeoJson(function(geoJson) {
    geoJsonInput.value = JSON.stringify(geoJson, null, 2);
    refreshDownloadLinkFromGeoJson();
  });
}

// Refresh download link.
function refreshDownloadLinkFromGeoJson() {
  downloadLink.href = "data:;base64," + btoa(geoJsonInput.value);
}

// Apply listeners to refresh the GeoJson display on a given data layer.
function bindDataLayerListeners(dataLayer) {
  dataLayer.addListener('addfeature', refreshGeoJsonFromData);
  dataLayer.addListener('removefeature', refreshGeoJsonFromData);
  dataLayer.addListener('setgeometry', refreshGeoJsonFromData);
}

// Display the validity of geoJson.
function setGeoJsonValidity(newVal) {
  if (!newVal) {
    geoJsonInput.className = 'invalid';
  } else {
    geoJsonInput.className = '';
  }
}
function resizeGeoJsonInput() {
  var geoJsonInputRect = geoJsonInput.getBoundingClientRect();
  var panelRect = panel.getBoundingClientRect();
  geoJsonInput.style.height = panelRect.bottom - geoJsonInputRect.top - 8 + "px";
}
