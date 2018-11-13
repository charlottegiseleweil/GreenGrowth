 // Countries to show

 const ZOOM = 3;

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
 
 // Create variable to hold map element, give initial settings to map
 var map = L.map('map',{  center: [20.0, 0.0], zoom: ZOOM, zoomControl:false});
 map.scrollWheelZoom.disable();

 var CartoDB_Voyager = new L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

map.addLayer(CartoDB_Voyager);      // Adding layer to the map

function onClick(e) {
   if (map.getZoom() != ZOOM) {
       map.setView([20.0, 0.0], ZOOM);
   } 
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 0.5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var geojson;

var myStyle = {
    "color": "#ff7800",
    "weight": 0.5,
    "opacity": 0.65
};

map.on('click', onClick);

function filter_countries(data) {
    if (COUNTRIES.includes(data.properties.admin)){
        return true;
    } 

    return false;   
};

 // Add OpenStreetMap tile layer to map element
 $.getJSON('countries.geojson', function(data) {    
    geojson = L.geoJson(data, {
        filter: filter_countries, 
        style: myStyle,
        onEachFeature: onEachFeature,
        scrollWheelZoom: false}).addTo(map);
});