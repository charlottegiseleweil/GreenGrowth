 // Countries to show
 const COUNTRIES = [
    'Ecuador',
    'United States of America',
    'Brazil',
    'United Kingdom',
    'France',
    'Kenya',
    'South Africa',
    'Myanmar',
    'China',
    'Mongolia',
    'Indonesia',
    'Australia',
    'Costa Rica'
 ]

 //filter out the countries which have no related case study
 function filter_countries(data) {
     if (COUNTRIES.includes(data.properties.admin)){
         return true;
     }

     return false;
 };

 // create Leaflet Map
 var map = L.map('map', {
    center: [40.0, 80.0],
    zoom: 2.35,
    zoomSnap: 0.2
});

// define tile layer
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 2
});


var myStyle = {
"color": "#ff7800",
"weight": 0.5,
"opacity": 0.65
};

// reset highlightning on filtered countries on mouse hover
function onEachFeature(feature, layer) {

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: handleCountryClick,
        //click: data_loader.countries[layer.feature.properties.name].click(),
    });
}

function highlightFeature(e){
  if (e.target.feature.properties.name!=data_loader.active_country.name){
    e.target.setStyle({
        weight: 0.5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
  }
}

function activeHighlight(e){
  e.target.setStyle({
      weight: 0.5,
      color: 'red',
      dashArray: '',
      fillOpacity: 0.25
  });
}


function resetHighlight(e) {
  if (e.target.feature.properties.name!=data_loader.active_country.name){
    geojson.resetStyle(e.target);
  }
}

function zoom_to_case(subchapter){
  lat = subchapter["loc_view"].split(',')[0];
  long = subchapter["loc_view"].split(',')[1];
  zoom = subchapter["loc_view"].split(',')[2]
  map.setView([lat, long],zoom);
}

function zoom_to_country(country){
  console.log(country)
  lat = country["loc_view"].split(',')[0];
  long = country["loc_view"].split(',')[1];
  zoom = country["loc_view"].split(',')[2]
  map.setView([lat, long],zoom);
}

function resetAllLayers(){
  geojson.eachLayer(function(layer){
    if (this.name==data_loader.active_country){
      geojson.resetStyle(e.target);
    }
  });
}
