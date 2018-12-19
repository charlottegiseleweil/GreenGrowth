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

 function filter_countries(data) {
     if (COUNTRIES.includes(data.properties.admin)){
         return true;
     }

     return false;
 };


 var map = L.map('map', {
    center: [20.0, 0.0],
    zoom: 3,
    zoomSnap: 0.2
});


var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 2
});

function openingClick() {
    $(".opening-page").fadeOut( 1000, function() {
        $(".opening-page").remove();
        map.addLayer(Esri_WorldImagery);
        $(".mapbox").css({'display': 'block'});
        map.invalidateSize();

        $.getJSON('./data/countries.geojson', function(data) {
            geojson = L.geoJson(data, {
                filter: filter_countries,
                style: myStyle,
                onEachFeature: onEachFeature,
                scrollWheelZoom: false}).addTo(map);
        });

        //$( "#chapter2" ).load( "./chapter-templates/chapter2.html");
        //$( "#chapter6" ).load( "./chapter-templates/chapter6.html");

        var intro = introJs();
        
        intro.setOptions({
            steps: [
            { 
                intro: "This help menu will guide you through the steps necessary to use the app properly."
            },
            {
                element: '#left-menu',
                intro: 'You can see the current chapter and subchapter here. You can click the chapter you want to see.',
                position: 'right'
            },
            {
                element: '#right-menu',
                intro: 'You can use your mouse or up and down array keys to navigate between chapters. You can use buttons, time sliders and checkboxes to see dynamic figures in specific chapters.',
                position: 'left'
            },
            {
                element: '.leaflet-control-zoom',
                intro: 'You can zoom in and zoom out here. Also you can drag the map to see specific areas.',
                position:'down'
            }
            ],
            showStepNumbers:false 
      });

      intro.start();
        
        /*
        setTimeout(function(){
          console.log($('#chapter6').position().top)
          $('#right-menu').scrollTop($('#right-menu').scrollTop() + $('#chapter6').position().top);
        }, 1000);
        */
    });
}

var myStyle = {
"color": "#ff7800",
"weight": 0.5,
"opacity": 0.65
};

function onEachFeature(feature, layer) {

    layer.on({
        mouseout: resetHighlight,
    });
}


function resetHighlight(e) {
    if(e.target.feature.properties.name == 'South Africa'&&active_subchapter=='6-3'){
      e.target.setStyle({fillOpacity: 0});
    }
    else{
      geojson.resetStyle(e.target);
    }
}
