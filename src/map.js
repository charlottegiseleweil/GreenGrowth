 // Countries to show

 const COUNTRIES = [
    'United States of America',
    'Costa Rica',
    'Ecuador',
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
 var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
 map.addLayer(layer);      // Adding layer to the map

function filter_countries(data) {
    if (COUNTRIES.includes(data.properties.sovereignt)) 
        return true;
};

 // Add OpenStreetMap tile layer to map element
 $.getJSON('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson', function(data) {
    L.geoJson(data, {filter: filter_countries}).addTo(map);
  });