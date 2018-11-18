 // Countries to show

 const ZOOM = 3;
 var case_dictionary={};
 var map = L.map('map',{  center: [20.0, 0.0], zoom: ZOOM, zoomControl:false});

 var sidebar = L.control.sidebar('sidebar', {
    closeButton: false,
    position: 'left'
 });

map.addControl(sidebar);

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
 
d3.csv("./case_studies.csv").then(function(case_studies){

    for(var i=0;i<case_studies.length;i++){
        if (!(case_studies[i]["location"] in case_dictionary)){
            case_dictionary[case_studies[i]["location"]]=[];
            case_dictionary[case_studies[i]["location"]].push(case_studies[i]);
        }
        else{
            case_dictionary[case_studies[i]["location"]].push(case_studies[i])
        }
    }

    console.log(case_dictionary);

    var CartoDB_Voyager = new L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    });

    map.addLayer(CartoDB_Voyager);      // Adding layer to the map
    
    map.scrollWheelZoom.disable();
    map.dragging.disable();

    $.getJSON('countries.geojson', function(data) {    
        geojson = L.geoJson(data, {
            filter: filter_countries, 
            style: myStyle,
            onEachFeature: onEachFeature,
            scrollWheelZoom: false}).addTo(map);
    });
});

function create_table(country_name) {

    arr = case_dictionary[country_name];
    var tableBody = document.getElementById('cases');

    arr.forEach(function(rowData) {
        var row = document.createElement('tr');
        row.className = 'case-click'

        var added = document.createElement('td');
        added.appendChild(document.createTextNode(rowData['number']));
        row.appendChild(added);

        added = document.createElement('td');
        added.appendChild(document.createTextNode(rowData['name']));
        row.appendChild(added);
    
        tableBody.appendChild(row);
    });
}

function zoomToFeature(e) {
    if (map.getZoom() == ZOOM) {
        sidebar.show();    
        map.fitBounds(e.target.getBounds());
        console.log(e.target.getBounds());
        document.getElementById('country-name').innerHTML = e.target.feature.properties.name;
        create_table(e.target.feature.properties.name);

    } else {
        map.setView([20.0, 0.0], ZOOM);
        sidebar.hide();  
        document.getElementById("cases").innerHTML = "";  
    }  
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



function filter_countries(data) {
    if (COUNTRIES.includes(data.properties.admin)){
        return true;
    } 

    return false;   
};

// Add OpenStreetMap tile layer to map element


$("#case-table").on('click','tr',function(e) {  
    if ( $( "#info-panel" ).is( ":hidden" ) ) {
        // Bilgileri al
        showDetails(e.currentTarget.cells[0].innerText);
        $( "#info-panel" ).slideDown('slow');
      }  else {
          // Yenile bilgileri
        $( "#info-panel" ).slideUp('slow', () => {
            showDetails(e.currentTarget.cells[0].innerText);
        });
        
        $( "#info-panel" ).slideDown('slow');
      }
}); 

$(".close").on('click', () => {
    sidebar.hide();
    map.setView([20.0, 0.0], ZOOM);
    document.getElementById("cases").innerHTML = "";  

    if ($( "#info-panel" ).is(":visible")) {
        $( "#info-panel" ).slideUp('slow');
    }  
}); 

function showDetails(caseNumber) {
    currentCountry = document.getElementById('country-name').innerText;
    caseCountry = case_dictionary[currentCountry];
    selected = {};

    for (let index = 0; index < caseCountry.length; index++) {
        if (caseCountry[index]['number'] == caseNumber){
            selected = caseCountry[index];
            break;
        }
    }

    document.getElementById('case-name-heading').innerHTML = selected['name'];
    document.getElementById('chapter-no').innerHTML = selected['ch_no'];
    document.getElementById('chapter-name').innerHTML = selected['ch_title'];
    document.getElementById('case-summary').innerHTML = selected['summary'];
}
 
