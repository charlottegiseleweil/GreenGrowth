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
    keyboard: false,
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

var Esri_WorldImagery1 = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var CartoDB_VoyagerOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
});

var countriesBaseStyle = {
"color": "#00cc00",
"weight": 0.7,
"fillOpacity": 0.35
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

function highlightFeature(layer){
  if(Object.keys(layer).includes('target'))
    layer = layer.target;
  //(data_loader.active_case.id =='0-1')&&
  if (layer.feature.properties.name!=data_loader.active_country.name){
    layer.setStyle({
        weight: 0.5,
        color: '#00cc00',
        dashArray: '',
        fillOpacity: 0.85
    });
  }
}

function activeHighlight(layer){
  if(Object.keys(layer).includes('target'))
    layer = layer.target;
  layer.setStyle({
      weight: 4,
      color: '#00cc00',//"#bb3e00",
      dashArray: '',
      fillOpacity: 0.1

  });
}


function resetHighlight(layer) {
  if(Object.keys(layer).includes('target'))
    layer = layer.target;
  if (layer.feature.properties.name!=data_loader.active_country.name){
    geojson.resetStyle(layer);
  }
}

function zoom_to(object, animate_){
  lat = object["loc_view"].split(',')[0];
  long = object["loc_view"].split(',')[1];
  zoom = object["loc_view"].split(',')[2]
  map.setView([lat, long],zoom, {animate: animate_});
}


function refreshLayers(){
  geojson.eachLayer(function(layer){
    if (layer.feature.properties.name==data_loader.active_country.name){
      activeHighlight(layer);
    }
    else{
      resetHighlight(layer);
    }
  });
}
