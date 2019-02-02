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
    'Australia'
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
    center: [20.0, 0.0],
    zoom: 3,
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
        mouseout: resetHighlight,
    });
}


function resetHighlight(e) {
    if(e.target.feature.properties.name == 'South Africa'&&data_loader.active_subchapter=='6-3'){
      e.target.setStyle({fillOpacity: 0});
    }
    else{
      geojson.resetStyle(e.target);
    }
}
