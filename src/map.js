 // Countries to show

 const ZOOM = 2.5;
 var case_dictionary={};
 var figure_dictionary={};
 var map = L.map('map',{  center: [20.0, 0.0], zoom:ZOOM, zoomSnap: 0.5, zoomControl:false});
 new L.Control.Zoom({ position: 'bottomright' }).addTo(map); 
 choropleth_fips={}
 choropleth_bool=false;
 choropleth_map_objs = {}
 waterfund_objs={}
 waterfund_markers={}
 waterfund_bool=false;
 case_6_1_fig1_bool=false;

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
 
 $(document).ready(function () {    
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
});

d3.csv("./figures.csv").then(function(figures){
        for(var i=0;i<figures.length;i++){
            console.log(figures[i]);
            if (!(figures[i]['case_number'] in figure_dictionary)){
                figure_dictionary[figures[i]['case_number']]=[];
                figure_dictionary[figures[i]['case_number']].push(figures[i]);            
            }
            else{
                figure_dictionary[figures[i]['case_number']].push(figures[i]);                        
            }
        }       
        read_cases();
});

function read_cases(){
    d3.csv("./case_studies.csv").then(function(case_studies){
        for(var i=0;i<case_studies.length;i++){
            if (!(case_studies[i]["ch_no"] in case_dictionary)){
                case_dictionary[case_studies[i]["ch_no"]]=[];
                case_dictionary[case_studies[i]["ch_no"]].push(case_studies[i]);
            }
            else{
                case_dictionary[case_studies[i]["ch_no"]].push(case_studies[i])
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
        create_content_table();
    });
}
function create_content_table(){
    
    Object.keys(case_dictionary).forEach(function(key) {
        $('#chapter-table').append('<li id="active-'+key+'"></li>');
        $('#chapter-table #active-'+key+'').append('<a href="#'+key+'-submenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><b>Ch '+key+ " &nbsp; </b>"+ case_dictionary[key][0]["ch_title"]+'</a>')
        $('#chapter-table #active-'+key+'').append('<ul class="collapse list-unstyled" id="'+key+'-submenu">')        
        $('#chapter-table #active-'+key+' #'+key+'-submenu').append('<li class="submenu">'+case_dictionary[key][0]['summary']+'</li>')                        
        case_dictionary[key].forEach(function(rowData){
            $('#chapter-table #active-'+key+' #'+key+'-submenu').append('<li><a href="#'+rowData['number'].replace(".","-")+'-submenu" data-toggle="collapse" aria-expanded="false class="dropdown-toggle"> <b>'+rowData['number']+'&nbsp; </b>'+rowData['name']+'<span style="float:right;">&#9662;</span> </a></li>')            
            //console.log("figs|"+rowData['number']+'|');
            //console.log("figs",figure_dictionary, rowData['number'] in figure_dictionary);
            if(rowData['number'] in figure_dictionary){
                console.log("if",'#chapter-table #active-'+key+' #'+key+'-submenu');                
                $('#chapter-table #active-'+key+' #'+key+'-submenu').append('<ul class="collapse list-unstyled" id="'+rowData['number'].replace(".","-")+'-submenu">')        
                
                figure_dictionary[rowData['number']].forEach(function(figure){
                    $('#chapter-table #active-'+key+' #'+key+'-submenu #'+rowData['number'].replace(".","-")+'-submenu').append('<li><a href="#'+rowData['number'].replace(".","-")+'-'+figure['fig_no']+'-detail" data-toggle="collapse" aria-expanded="false class="dropdown-toggle onclick="case_'+rowData['number'].toString().replace(".","_")+'_fig'+figure['fig_no']+'();">'+figure['name']+'<span style="float:right;">&#9662;</span> </a></li>')             
                    $('#chapter-table #active-'+key+' #'+key+'-submenu #'+rowData['number'].replace(".","-")+'-submenu').append('<ul class="collapse list-unstyled" id="'+rowData['number'].replace(".","-")+'-'+figure['fig_no']+'-detail">');                                 
                    $('#chapter-table #active-'+key+' #'+key+'-submenu #'+rowData['number'].replace(".","-")+'-submenu #'+rowData['number'].replace(".","-")+'-'+figure['fig_no']+'-detail').append('<li class="subsubmenu">'+figure['description']+'</li>');                                 
                });
            }
            else{
                console.log("else");
            }
        })    
    })
}

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
        //sidebar.show();    
        map.fitBounds(e.target.getBounds());
        console.log(e.target.getBounds());
        document.getElementById('country-name').innerHTML = e.target.feature.properties.name;
        create_table(e.target.feature.properties.name);

    } else {
        map.setView([20.0, 0.0], ZOOM);
        //sidebar.hide();  
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

$("#chapter-table").on('click','tr',function(e) {  
    console.log("js chapters");
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
    //sidebar.hide();
    map.setView([20.0, 0.0], ZOOM);
    document.getElementById("cases").innerHTML = "";  

    if ($( "#info-panel" ).is(":visible")) {
        $( "#info-panel" ).slideUp('slow');
    }  
}); 

function showDetails(caseNumber) {
    //currentCountry = document.getElementById('country-name').innerText;
    caseCountry = case_dictionary[currentCountry];
    selected = {};

    for (let index = 0; index < caseCountry.length; index++) {
        if (caseCountry[index]['number'] == caseNumber){
            selected = caseCountry[index];
            break;
        }
    }
}


function case_6_1_fig1() {
    if(case_6_1_fig1_bool){
        case_6_1_fig1_bool=false;
    }
    else
    {
        d3.csv("./line_plot.csv").then(function(lineplot_data){
        
        console.log("printed")
        console.log(lineplot_data[0])
        data_points_acres=[];
        data_points_money=[];        
        for(var i=0;i<lineplot_data.length;i++){
            data_points_acres.push({x: parseInt(lineplot_data[i]['yr'],10) ,y:lineplot_data[i]['Total_Acres']/1000000})
            data_points_money.push({x: parseInt(lineplot_data[i]['yr'],10),y:lineplot_data[i]['Total_Money']/1000000})
            console.log(i+1," ",lineplot_data[i]['yr']," ", lineplot_data[i]['Total_Acres'], " ", lineplot_data[i]['Total_Money']);
        }
        var options={
            animationEnabled: true,
            title:{
                text: "CRP Enrollments and Payment"
            },
            toolTip: {
                shared: true
            },
            axisX: {
                title: "Year",
                suffix : "",
                valueFormatString:"$####"
            },
            axisY: {
                title: "Land Enrolled",
                titleFontColor: "#4F81BC",
                suffix : "M",
                lineColor: "#4F81BC",
                tickColor: "#4F81BC",
                valueFormatString:"$####"                
            },
            axisY2: {
                title: "CRP Payments",
                titleFontColor: "#C0504E",
                suffix : "M",
                lineColor: "#C0504E",
                tickColor: "#C0504E"
            },
            data: [{
                type: "spline",
                name: "Land Enrolled",
                xValueFormatString: "$####",
                yValueFormatString: "$####",
                dataPoints: data_points_acres
            },
            {
                type: "spline",  
                axisYType: "secondary",
                name: "CRP Payments",
                yValueFormatString: "$####",
                xValueFormatString: "$####",                
                dataPoints: data_points_money
            }]
        };

        $("#dialogBox").dialog({
            open: function(event,ui) {
                $(".ui-widget-overlay").bind("click", function(event,ui) {         
                    $("#dialogBox").dialog("close");
                });
            },
            closeOnEscape: true,
            title: "Line Plot",
            width: 900,
            modal: true,
            show: 500
        });
        $(".ui-widget-overlay").css({"background-color": "#111111"});
        $("#chartContainer").CanvasJSChart(options);
        case_6_1_fig1_bool=true;
    });
    }
};

function style(feature) {
    //console.log("Feature",feature.properties.fips)
    //console.log("geofips",choropleth_fips)
    return {
        fillColor: getColor(choropleth_fips[feature.properties.fips],choropleth_fips['grades']),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function sum_values(data,column){
    var sum=0.0;
    for(var i=0;i<data.length;i++){
        sum+=parseFloat(data[i][column].replace('.',''));
    }        
    return sum
}
function zoom_to_US(){

    map.setView([40.0, -105.0],4.5);        
    return
}
function case_6_1_fig2() {

    if(choropleth_bool){
        remove_choropleth();
        choropleth_bool=false; 
        map.setView([20.0, 0.0], ZOOM);        
    }
    else{
        zoom_to_US();
        choropleth_from_csv("acres_new",'2016',[0, 0, 1, 5, 10],true);
        choropleth_bool=true;
    }
};

function case_6_1_fig3() {
    
    if(choropleth_bool){
        remove_choropleth();
        choropleth_bool=false;    
        map.setView([20.0, 0.0], ZOOM);        
    }
    else{
        zoom_to_US();        
        choropleth_from_csv("acres_payments",'2016',[0, 0, 20, 40, 80],false);
        choropleth_bool=true;
    }
};


function case_3_1_fig1() {
    console.log("3.1 cilcked", waterfund_bool)
    if(waterfund_bool){
        waterfund_markers=[]
        remove_objs();
        waterfund_bool=false;
    }
    else{
        d3.csv("./Water_Funds.csv").then(function(data){
            waterfund_markers['phase_'] = [];       
            waterfund_markers['phase_0'] = [];       
            waterfund_markers['phase_1'] = [];       
            waterfund_markers['phase_2'] = [];       
            waterfund_markers['phase_3'] = [];       
            waterfund_markers['phase_4'] = [];       
            waterfund_markers['phase_5'] = [];   
            for(var i=0;i< data.length;i++){
                //console.log("Water fund",i," :",data[i]);
                var marker = L.marker([data[i]['Latitude'],data[i]['Longitude']]);
                //waterfund_objs[i];//.addTo(map); 
                if (data[i]['Phase']==('Operation'||'Maturity')){
                    marker.bindPopup("<b>Phase:</b>" +data[i]['Phase']+"<br>"+"<b>City:</b>"+data[i]['City']
                    +"<br>"+"<b>Country:</b>"+data[i]['Country']+"<br>"+"<b>State:</b>"+data[i]['State']+"<br>"+"<b>State:</b>"+data[i]['State']
                    +"<br>"+"<b>Operational since:</b>"+data[i]['Operational']);   
                }
                else{
                    marker.bindPopup("<b>Phase:</b>"+data[i]['Phase']+"<br>"+"<b>City:</b>"+data[i]['City']
                    +"<br>"+"<b>Country:</b>"+data[i]['Country']+"<br>"+"<b>State:</b>"+data[i]['State']+"<br>","<b>State:</b>"+data[i]['State']);               
                }
                waterfund_markers['phase_'+data[i]['Phase_Code']].push(marker);
                //waterfund_objs[i]=marker
            }
            waterfund_objs['phase_'] = L.layerGroup(waterfund_markers['phase_']);       
            waterfund_objs['phase_0'] = L.layerGroup(waterfund_markers['phase_0']);       
            waterfund_objs['phase_1'] = L.layerGroup(waterfund_markers['phase_1']);       
            waterfund_objs['phase_2'] = L.layerGroup(waterfund_markers['phase_2']);       
            waterfund_objs['phase_3'] = L.layerGroup(waterfund_markers['phase_3']);       
            waterfund_objs['phase_4'] = L.layerGroup(waterfund_markers['phase_4']);       
            waterfund_objs['phase_5'] = L.layerGroup(waterfund_markers['phase_5']);       
            var overlayMaps = {
                "Being Explored":               waterfund_objs['phase_'] ,
                "Phase 0: Pre-Feasibility ":    waterfund_objs['phase_0'],
                "Phase 1: Feasibility ":        waterfund_objs['phase_1'],
                "Phase 2: Design":              waterfund_objs['phase_2'],
                "Phase 3: Creation":            waterfund_objs['phase_3'],
                "Phase 4: Operation":           waterfund_objs['phase_4'],
                "Phase 5: Maturity":            waterfund_objs['phase_5']
            };
            waterfund_objs['con_layers']=L.control.layers(null,overlayMaps,{collapsed:false}).addTo(map);     
        });
        waterfund_bool=true;
    }
}

function remove_objs(){    
    Object.keys(waterfund_objs).forEach(function(key) {
        if(key=='con_layers'){
            waterfund_objs[key].remove(map)
        }
        else{
            console.log('key',key)
            waterfund_objs[key].clearLayers();
        }
                
    });   
    Object.keys(waterfund_markers).forEach(function(key) {
        console.log('key',key)
        map.removeLayer(waterfund_markers[key]);        
    });   
}

function choropleth_from_csv(data_file,year,grades,percent){
    d3.csv("./"+data_file+".csv").then(function(data){
        choropleth_fips['grades']=grades;
        var sum = sum_values(data,year);
        console.log(sum,"SUM in heactares",(sum*0.40468564)/1000000,"millions");
        for(var i=0;i< data.length;i++){
            if (percent){
                choropleth_fips[ data[i]['FIPS']]= (parseInt( data[i][year].replace('.',''))/sum)*10000;
            }
            else{
                choropleth_fips[data[i]['FIPS']]= parseInt( data[i][year])/2.4711;            
            }
    }

        console.log("printed")
        shp("files/counties").then(function(geojson){
            choropleth_map_objs['geo'] = L.geoJson(geojson, {style: style})
            choropleth_map_objs['geo'].addTo(map); 
            console.log("after",Object.keys(choropleth_map_objs).length)                
        });

        choropleth_map_objs['legend'] = L.control({position: 'bottomright'});
        
        choropleth_map_objs['legend'].onAdd = function (map) {
            return legend(grades)
        };
        choropleth_map_objs['legend'].addTo(map);
    });
}

function remove_choropleth(){
    map.removeControl(choropleth_map_objs['legend']);
    
    Object.keys(choropleth_map_objs).forEach(function(key) {
        console.log('key')
        map.removeLayer(choropleth_map_objs[key]);        
    });   
}

function legend(grades){
    var div = L.DomUtil.create('div', 'info legend'),
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        if (i==0){
            div.innerHTML += '<i style="background:' + getColor(grades[i],grades) + '"></i> ' + (grades[i + 1]) + '<br>';
        }
        else{
            div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1,grades) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    }
    return div;
}

function getColor(d,grades) {
    //console.log("getcolor",grades[1],grades[2])
    return d > grades[4] ?  '#800026' :
           d > grades[3] ?  '#BD0026' :
           d > grades[2] ?  '#E31A1C' :
           d > grades[1] ?  '#FFEDA0' :
                            '#FFFFFF' ;
}

