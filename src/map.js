 // Countries to show

 const ZOOM = 3;
 var case_studies;
 var markers = {}
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
 
d3.csv("./case_new.csv").then(function(case_studies){
    console.log(case_studies.length)
    var case_dictionary={}
    for(var i=0;i<case_studies.length;i++){
        if (!(case_studies[i]["Location"] in case_dictionary)){
            case_dictionary[case_studies[i]["Location"]]=[];
            case_dictionary[case_studies[i]["Location"]].push(case_studies[i]);
        }
        else{
            case_dictionary[case_studies[i]["Location"]].push(case_studies[i])
        }
        console.log(i+" "+case_studies[i]["Location"]);
    }
    console.log(case_studies.columns)
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
        console.log("onclick")
        //console.log(e)
        if (map.getZoom() != ZOOM) {
            map.setView([20.0, 0.0], ZOOM);
            sidebar.hide();  
            //console.log("len markers:", markers);
            
            Object.keys(markers).forEach(function(key) {
                //console.log(key, markers[key]);
                map.removeLayer(markers[key]);        
            });    
            console.log("remove")
        }
    }

    var onMarkerClick = function(e){
        clicked_case = this.options.marker_obj;
        $("p").text("");
        for (var j=0;j<case_studies.columns.length;j++)
        {
            $("p").append("<b>"+case_studies.columns[j]+": </b>"+clicked_case[String(case_studies.columns[j])]+"<br/>")
            
        } 
        sidebar.show();
    }

    function zoomToFeature(e) {
        if (map.getZoom() != ZOOM) {
            return;
        }
        console.log("zoom")
        
        //console.log("zoom "+e)
        var sidebar_container = sidebar.getContainer();
        $("h1").text(e.sourceTarget.feature.properties.name);
        var key=e.sourceTarget.feature.properties.name;
        if (key in case_dictionary)
        {   
            for (var i = 0;i<case_dictionary[key].length;i++)
            {   
                //console.log(i);
                markers[i] = L.marker([case_dictionary[key][i]["lat"],case_dictionary[key][i]["lng"]],{marker_obj: case_dictionary[key][i]});
                markers[i].on('click', onMarkerClick);
                markers[i].addTo(map);
            
                $("p").append("<br/>")
            }
        }
        
        //console.log(case_studies);
        //console.log(":(");
        //sidebar.show();    
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
            /* console.log(data.properties.name);
            console.log("multi "+data.geometry.coordinates.length)        
            for (var multi_polygon=0;multi_polygon<data.geometry.coordinates.length; multi_polygon++){
                var lat = 0;
                var lng = 0; 
                var len = data.geometry.coordinates[multi_polygon][0].length;
                console.log(len)
                for ( var i=0; i < len; ++i ) {
                    lat+=data.geometry.coordinates[multi_polygon][0][i][1];
                    lng+=data.geometry.coordinates[multi_polygon][0][i][0];
                }
                lat/=len;
                lng/=len;
                //console.log(lat,lng);
                var marker = L.marker([lat,lng]).addTo(map).on('click', function () {
                    sidebar.toggle();
                });
            } */
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

    var sidebar = L.control.sidebar('sidebar', {
    position: 'left'
    });

    map.addControl(sidebar);
    //sidebar.show();

});
 