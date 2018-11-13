 // Countries to show

 const COUNTRIES = [
    'Costa Rica',
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
 var map = L.map('map',{  center: [20.0, 0.0], zoom: 3});

 var CartoDB_Voyager = new L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

map.addLayer(CartoDB_Voyager);      // Adding layer to the map

function onClick(e) {
    /*popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    */
   // CLICK EVENT
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function onEachFeature(feature, layer) {

    console.log(feature);

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var geojson;
// ... our listeners

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
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
    geojson = L.geoJson(data, {filter: filter_countries, 
        style: myStyle,
        onEachFeature: onEachFeature}).addTo(map);
});