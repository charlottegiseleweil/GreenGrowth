 // Countries to show

 var map = L.map('map', {
    center: [20.0, 0.0],
    zoom: 3,
    zoomSnap: 0.2
});


var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 3
});

function openingClick() {
    $(".opening-page").fadeOut( 1000, function() {
        $(".opening-page").remove();
        map.addLayer(Esri_WorldImagery);
        $(".mapbox").css({'display': 'block'});
        map.invalidateSize();

        //$( "#chapter2" ).load( "./chapter-templates/chapter2.html");
        //$( "#chapter6" ).load( "./chapter-templates/chapter6.html");

        buildLeftMenu()
        buildRightMenu()
        /*
        setTimeout(function(){
          console.log($('#chapter6').position().top)
          $('#right-menu').scrollTop($('#right-menu').scrollTop() + $('#chapter6').position().top);
        }, 1000);
        */
    });
}
