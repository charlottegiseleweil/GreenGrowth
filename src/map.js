 // Countries to show

 const ZOOM = 2.5;
 var case_dictionary={};
 var figure_dictionary={};
 var map = L.map('map',{  center: [20.0, 0.0], zoom:ZOOM, zoomSnap: 0.2, zoomControl:false});
 new L.Control.Zoom({ position: 'topright' }).addTo(map);
 var choropleth_fips={}
 var choropleth_map_objs = {}
 var waterfund_objs={}
 var waterfund_markers={}



 is_active_chapter = {}
 is_active_subchapter = {}
 is_active_fig = {}
 case_location_view = {}
 case_country = {}
 figure_layers = {}

 chapter = 'chapter'
 subchapter = 'subchapter'

 active_country = "None"


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

        //$('undo_img').append('<a onclick="create_main_content_table();">')
    });
});

d3.csv("./figures.csv").then(function(figures){
        for(var i=0;i<figures.length;i++){
            //console.log(figures[i]);
            if (!(figures[i]['case_no'] in figure_dictionary)){
                figure_dictionary[figures[i]['case_no']]=[];
                figure_dictionary[figures[i]['case_no']].push(figures[i]);
            }
            else{
                figure_dictionary[figures[i]['case_no']].push(figures[i]);
            }
        is_active_fig[[figures[i]['case_no'],figures[i]['fig_no']]] = false;
        }
        //console.log(figure_dictionary);
        read_cases();

});

function read_cases(){
    d3.csv("./case_studies.csv").then(function(case_studies){
      //console.log(case_studies.length)
        for(var i=0;i<case_studies.length;i++){
            if (!(case_studies[i]["ch_no"] in case_dictionary)){
                case_dictionary[case_studies[i]["ch_no"]]=[];
                case_dictionary[case_studies[i]["ch_no"]].push(case_studies[i]);
            }
            else{
                case_dictionary[case_studies[i]["ch_no"]].push(case_studies[i])
            }
            case_location_view[case_studies[i]["number"]] = case_studies[i]["location_view"];
            is_active_chapter[case_studies[i]["ch_no"]] = false;
            is_active_subchapter[case_studies[i]['number']] = false;
            case_country[case_studies[i]['number']] = case_studies[i]["country"]
        }

        //console.log(case_dictionary);

        var CartoDB_Voyager = new L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        });

        map.addLayer(CartoDB_Voyager);      // Adding layer to the map

        //map.scrollWheelZoom.disable();
        //map.dragging.disable();

        $.getJSON('countries.geojson', function(data) {
            geojson = L.geoJson(data, {
                filter: filter_countries,
                style: myStyle,
                onEachFeature: onEachFeature,
                scrollWheelZoom: false}).addTo(map);
        });
        table_is_main_content = true;
        create_main_content_table();
    });
}



//Extending the DOM to remove elements
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function empty_content_table(){
  //applies if main content table is active
  if(table_is_main_content){
    Object.keys(case_dictionary).forEach(function(key) {
      //see if id exists and delete
      if(!!document.getElementById('active-'+key+'')){
      document.getElementById('active-'+key+'').remove();
      }
    });
  }

  //applies if a sub content table is active
  else{
    Object.keys(is_active_subchapter).forEach(function(case_no) {
      //see if id exists and delete
      if(!!document.getElementById(case_no.replace(".","-")+'-submenu')){
        document.getElementById(case_no.replace(".","-")+'-submenu').remove();
      }
      if(!!document.getElementById('link'+case_no)){
        document.getElementById('link'+case_no).remove();
      }

    });
    //document.getElementById('chapter-table').remove()
  }

  //reset all activity dictionnary to false
  Object.keys(is_active_fig).forEach(function(key) {
    is_active_fig[key] =false;
  });
  Object.keys(is_active_subchapter).forEach(function(key) {
    is_active_subchapter[key] =false;
  });
  Object.keys(is_active_chapter).forEach(function(key) {
    is_active_chapter[key] =false;
  });



}

function create_main_content_table(){

    document.getElementById("sidebar-title").innerHTML = "<b>International Environmental Projects</b>";
    empty_content_table();
    table_is_main_content = true;
    Object.keys(case_dictionary).forEach(function(key) {
        //Append chapters to chapter-table
        $('#chapter-table').append('<li id="active-'+key+'"></li>');
        $('#chapter-table #active-'+key+'').append('<a href="#'+key+'-submenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle" onclick="chapter_click('+key+');"><b>Ch '+key+ " &nbsp; </b>"+ case_dictionary[key][0]["ch_title"]+'</a>')
        $('#chapter-table #active-'+key+'').append('<ul class="collapse list-unstyled" id="'+key+'-submenu">')
        //Append subchapters in chapters
        let row_id=0;
        case_dictionary[key].forEach(function(rowData){
            $('#chapter-table #active-'+key+' #'+key+'-submenu').append('<li><a href="#'+rowData['number'].replace(".","-")+'-submenu" data-toggle="collapse" aria-expanded="false class="dropdown-toggle" onclick="subchapter_click('+rowData['number']+');"> <b>'+rowData['number']+'&nbsp; </b>'+rowData['name']+'<span style="float:right;">&#9662;</span> </a></li>')
            //console.log("if",'#chapter-table #active-'+key+' #'+key+'-submenu');
            $('#chapter-table #active-'+key+' #'+key+'-submenu').append('<ul class="collapse list-unstyled" id="'+rowData['number'].replace(".","-")+'-submenu">')
            $('#chapter-table #active-'+key+' #'+key+'-submenu #'+rowData['number'].replace(".","-")+'-submenu').append('<li class="submenu">'+case_dictionary[key][row_id]['summary']+'</li>')
            //console.log('#chapter-table #active-'+key+' #'+key+'-submenu #'+rowData['number'].replace(".","-")+'-submenu')
            row_id+=1;
            //Append figures in subchapter if existing
            if(rowData['number'] in figure_dictionary){
                figure_dictionary[rowData['number']].forEach(function(figure){
                    if (figure['dynamic'] == 'TRUE'){
                      $('#chapter-table #active-'+key+' #'+key+'-submenu #'+rowData['number'].replace(".","-")+'-submenu').append('<li><a href="#'+rowData['number'].replace(".","-")+'-'+figure['fig_no']+'-detail" data-toggle="collapse" aria-expanded="false class="dropdown-toggle onclick="case_'+rowData['number'].toString().replace(".","_")+'_fig'+figure['fig_no']+'();"><u>Figure:</u> '+figure['name']+'<span style="float:right;">&#9662;</span> </a></li>')
                    }
                    else {
                      $('#chapter-table #active-'+key+' #'+key+'-submenu #'+rowData['number'].replace(".","-")+'-submenu').append('<li><a href="#'+rowData['number'].replace(".","-")+'-'+figure['fig_no']+'-detail" data-toggle="collapse" aria-expanded="false class="dropdown-toggle onclick="static_fig'+'('+figure['case_no']+','+figure['fig_no']+');"><u>Figure:</u> '+figure['name']+'<span style="float:right;">&#9662;</span> </a></li>')
                    }
                    $('#chapter-table #active-'+key+' #'+key+'-submenu #'+rowData['number'].replace(".","-")+'-submenu').append('<ul class="collapse list-unstyled" id="'+rowData['number'].replace(".","-")+'-'+figure['fig_no']+'-detail">');
                    if (figure['description']!=''){
                      $('#chapter-table #active-'+key+' #'+key+'-submenu #'+rowData['number'].replace(".","-")+'-submenu #'+rowData['number'].replace(".","-")+'-'+figure['fig_no']+'-detail').append('<li class="subsubmenu">'+figure['description']+'</li>');
                    }
                });
            }
            else{
                //console.log("else");
            }
        })
        //Add figure to chapter if existing, those are usually mechanisms
        if(key in figure_dictionary){
          figure_dictionary[key].forEach(function(figure){
            $('#chapter-table #active-'+key+' #'+key+'-submenu').append('<li><a href="#'+key+'-'+figure['fig_no']+'-detail" data-toggle="collapse" aria-expanded="false class="dropdown-toggle" onclick="static_fig'+'('+figure['case_no']+','+figure['fig_no']+');"><u>Figure:</u> '+figure['name']+'<span style="float:right;">&#9662;</span> </a></li>')
            $('#chapter-table #active-'+key+' #'+key+'-submenu').append('<ul class="collapse list-unstyled" id="'+key+'-'+figure['fig_no']+'-detail">')
            if (figure['description']!=''){
              $('#chapter-table #active-'+key+' #'+key+'-submenu #'+key+'-'+figure['fig_no']+'-detail').append('<li class="subsubmenu">'+figure['description']+'</li>')
            }
          });
        }

    })
    return 0;
}

function create_sub_content_table(){
  document.getElementById("sidebar-title").innerHTML = "<b>Cases in "+active_country+"</b>";
    empty_content_table();
    table_is_main_content =false;
    Object.keys(case_dictionary).forEach(function(key) {
        //Iterate over subchapters in chapters
        let row_id=0;
        case_dictionary[key].forEach(function(rowData){
          if(case_country[rowData['number']]==active_country){
              //$('#chapter-table').append('<li id="'+rowData['number'].replace(".","-")+'-submenu"');
              $('#chapter-table').append('<li id ="link'+rowData['number']+'" ><a href="#'+rowData['number'].replace(".","-")+'-submenu" data-toggle="collapse" aria-expanded="false class="dropdown-toggle" onclick="subchapter_click('+rowData['number']+');"> <b>'+rowData['number']+'&nbsp; </b>'+rowData['name']+'<span style="float:right;">&#9662;</span> </a></li>')
              //$('#chapter-table #'+rowData['number'].replace(".","-")+'-submenu').append('<a href="#'+rowData['number'].replace(".","-")+'-submenu" data-toggle="collapse" aria-expanded="false class="dropdown-toggle" onclick="subchapter_click('+rowData['number']+');"> <b>'+rowData['number']+'&nbsp; </b>'+rowData['name']+'<span style="float:right;">&#9662;</span> </a>')
              $('#chapter-table').append('<ul class="collapse list-unstyled" id="'+rowData['number'].replace(".","-")+'-submenu">')
              $('#chapter-table #'+rowData['number'].replace(".","-")+'-submenu').append('<li class="submenu">'+case_dictionary[key][row_id]['summary']+'</li>')
              //console.log('#chapter-table #active-'+key+' #'+key+'-submenu #'+rowData['number'].replace(".","-")+'-submenu')
              row_id+=1;
              //Append figures in subchapter if existing
              if(rowData['number'] in figure_dictionary){
                  figure_dictionary[rowData['number']].forEach(function(figure){
                      if (figure['dynamic'] == 'TRUE'){
                        $('#chapter-table #'+rowData['number'].replace(".","-")+'-submenu').append('<li><a href="#'+rowData['number'].replace(".","-")+'-'+figure['fig_no']+'-detail" data-toggle="collapse" aria-expanded="false class="dropdown-toggle onclick="case_'+rowData['number'].toString().replace(".","_")+'_fig'+figure['fig_no']+'();"><u>Figure:</u> '+figure['name']+'<span style="float:right;">&#9662;</span> </a></li>')
                      }
                      else {
                        $('#chapter-table #'+rowData['number'].replace(".","-")+'-submenu').append('<li><a href="#'+rowData['number'].replace(".","-")+'-'+figure['fig_no']+'-detail" data-toggle="collapse" aria-expanded="false class="dropdown-toggle onclick="static_fig'+'('+figure['case_no']+','+figure['fig_no']+');"><u>Figure:</u> '+figure['name']+'<span style="float:right;">&#9662;</span> </a></li>')
                      }
                      $('#chapter-table #'+rowData['number'].replace(".","-")+'-submenu').append('<ul class="collapse list-unstyled" id="'+rowData['number'].replace(".","-")+'-'+figure['fig_no']+'-detail">');
                      if (figure['description']!=''){
                        $('#chapter-table #'+rowData['number'].replace(".","-")+'-submenu #'+rowData['number'].replace(".","-")+'-'+figure['fig_no']+'-detail').append('<li class="subsubmenu">'+figure['description']+'</li>');
                      }
                  });
              }
              else{
                  //console.log("else");
              }
          }
        });
    })
}

function resetAll(){
  active_country = 'None';
  clean_layers();
  geojson.eachLayer(function(layer){
      geojson.resetStyle(layer);
  });
  create_main_content_table();
  view_world();
}

function handleCountryClick(e) {
    //if country clicked was active, go back back to default view
    if (active_country == e.target.feature.properties.name){
      map.setView([20.0, 0.0], ZOOM);
      active_country = 'None';
      //reset to default style
      setHighlightStyle(e);

      clean_layers();
      create_main_content_table();
    }
    //if new country was clicked
    else{
        //reset the style of previous active country
        if(active_country!='None'){
          geojson.eachLayer(function(layer){
            if (layer.feature.properties.name==active_country){
              geojson.resetStyle(layer);
            }
          });
        }

        //set new active country
        active_country = e.target.feature.properties.name;
        //create the new content table
        clean_layers();
        create_sub_content_table();

        setActiveStyle(e);
        //zoom to country
        map.fitBounds(e.target.getBounds());

        console.log(active_country);
        //create_table(e.target.feature.properties.name);
        //sidebar.show();
        //document.getElementById('country-name').innerHTML = e.target.feature.properties.name;

    }
}



function onEachFeature(feature, layer) {

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: handleCountryClick
    });
}

function highlightFeature(e) {
    var layer = e.target;
    if (active_country == layer.feature.properties.name){
      setActiveStyle(e);
    }
    else{
      setHighlightStyle(e);
    }
}

function resetHighlight(e) {
    var layer = e.target;
    if(layer.feature.properties.name == 'South Africa'&&is_active_fig[[6.3,1]]){
      layer.setStyle({fillOpacity: 0});
    }
    else if (active_country == layer.feature.properties.name){
      setActiveStyle(e);
    }
    else{
      geojson.resetStyle(e.target);
    }
}


function setActiveStyle(e){
  e.target.setStyle({
      weight: 0.5,
      color: 'red',
      dashArray: '',
      fillOpacity: 0.25
  });
}

function setHighlightStyle(e){
  e.target.setStyle({
      weight: 0.5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
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



function chapter_click(ch_no){
  clean_layers();
  view_world();
  handle_collapse(ch_no, 'chapter');
}

function subchapter_click(case_no){
  clean_layers();
  handle_view(case_no);
  handle_collapse(case_no, 'subchapter');
}


function static_fig(case_no, fig_no){
  clean_layers();
  handle_collapse([case_no,fig_no], 'fig');

  $("#dialogBox").dialog({
      open: function(event,ui) {
          $(".ui-widget-overlay").bind("click", function(event,ui) {
              $("#dialogBox").dialog("close");
          });
      },
      closeOnEscape: true,
      title: case_no.toString(),
      width: 600,
      modal: true,
      show: 500,
      //position: [0,0],
      position: {
        my: 'left top',
        at: 'right top',
        of: $('#sidebar'),
      },
  });

  fig_file = './static_figs/'+case_no.toString().replace('.','_')+'-'+fig_no+'.jpg';
  var el = document.getElementById("chartContainer");
  //console.log('Showing image: '+fig_file)
  el.innerHTML="<img src="+fig_file+" style='height: 100%; width: 100%;'>";
}


function case_6_1_fig1() {
    case_no = 6.1;
    fig_no = 1;
    clean_layers();
    wasActive = is_active_fig[[case_no,fig_no]];
    handle_collapse([case_no,fig_no], 'fig');

    if(!wasActive){
        d3.csv("./line_plot.csv").then(function(lineplot_data){

          //console.log("printed")
          //console.log(lineplot_data[0])
          data_points_acres=[];
          data_points_money=[];
          for(var i=0;i<lineplot_data.length;i++){
              data_points_acres.push({x: parseInt(lineplot_data[i]['yr'],10) ,y:lineplot_data[i]['Total_Acres']/1000000})
              data_points_money.push({x: parseInt(lineplot_data[i]['yr'],10),y:lineplot_data[i]['Total_Money']/1000000})
              //console.log(i+1," ",lineplot_data[i]['yr']," ", lineplot_data[i]['Total_Acres'], " ", lineplot_data[i]['Total_Money']);
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
              height: 450,
              width: 900,
              modal: true,
              show: 500
          });
          $(".ui-widget-overlay").css({"background-color": "#111111"});

          $("#chartContainer").CanvasJSChart(options);
        });
    }
};


function case_6_1_fig2() {
    case_no = 6.1;
    fig_no = 2;
    clean_layers();
    wasActive = is_active_fig[[case_no,fig_no]];
    handle_collapse([case_no,fig_no],'fig');
    if(!wasActive){
        case_6_1_choropleth_from_csv("acres_new",'2016',[0, 0, 1, 5, 10],true);
    }
};

function case_6_1_fig3() {
    case_no = 6.1;
    fig_no = 3;
    clean_layers();
    wasActive = is_active_fig[[case_no,fig_no]];
    handle_collapse([case_no,fig_no],'fig');
    if(!wasActive){
        case_6_1_choropleth_from_csv("acres_payments",'2016',[0, 0, 20, 40, 80],false);
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

function case_6_3_fig1() {
    case_no = 6.3;
    fig_no = 1;
    clean_layers();
    wasActive = is_active_fig[[case_no,fig_no]];
    handle_collapse([case_no,fig_no],'fig');
    var lg;
    if(!wasActive){
        var imageUrl = './sonuc.png';

        geojson.eachLayer(function(layer) {
            if (layer.feature.properties.name == 'South Africa') {
                layer.setStyle({fillOpacity: 0});
            }
        });

        case_6_3_fig1_legend = L.control({position: 'topleft'});

        case_6_3_fig1_legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend bg-color');
            categories = ['0 or no data','0 - 5%','5 - 10%','> 10%','Clearing areas'];
            colors = ['#ffffff', '#EBB57D', '#CF6042', '#980001', '#386507']
            lgnd = ["<strong>Legend</strong>"];

            for (var i = 0; i < categories.length; i++) {
                div.innerHTML +=  lgnd.push('<i class="circle border" style="background:' + colors[i] + '"></i> ' + (categories[i]));
            }

            div.innerHTML = lgnd.join('<br>');
            return div;
            };

        case_6_3_fig1_legend.addTo(map);

        imageBounds = [[-22.046289062500017, 33.80013281250005], [-34.885742187500006, 15.747558593750045]];
        case_6_3_fig1_layer = L.imageOverlay(imageUrl, imageBounds).addTo(map);

    }
};

function case_7_2_fig1() {
    case_no = 7.2;
    fig_no = 1;
    clean_layers();
    wasActive = is_active_fig[[case_no,fig_no]];
    handle_collapse([case_no,fig_no],'fig');

    if(!wasActive) {

        //var added_geojson;
        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };


        $.getJSON('files/mitigation_bank.json', function(data) {
            case_7_2_fig1_layer = L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                    label = String(feature.properties.NUMPOINTS)
                    return new L.circleMarker(latlng, geojsonMarkerOptions).bindTooltip(label, {permanent: true, opacity: 0.7}).openTooltip();
                }
            }).addTo(map);
            //console.log(added_geojson);
        });
    }
};

function case_7_4_fig1() {
    case_no = 7.4;
    fig_no = 1;
    clean_layers();
    wasActive = is_active_fig[[case_no,fig_no]];
    handle_collapse([case_no,fig_no],'fig');

    if(!wasActive){

        shp("files/forest/forest.offset.projects.updated2017").then(function(geojson){
            case_7_4_fig1_layer = L.geoJson(geojson, {
                pointToLayer: function (feature, latlng) {
                    //console.log(feature);
                    return new L.marker(latlng, {
                        icon: L.divIcon({
                          html: '<i class="fa fa-tree" aria-hidden="true" style="color:green"></i>',
                          className: 'myDivIcon'
                        })
                      }).bindPopup('<i>'+String(feature.properties.NAME)+'</i><br>'+String(feature.properties.Area2)+' <strong>hectares.</strong>').on('mouseover', function (e) {
                        this.openPopup();
                    }).on('mouseout', function (e) {
                        this.closePopup();
                    });
                }
            }).addTo(map);
        });
    }
};

function case_8_1_fig1() {
    case_no = 8.1;
    fig_no = 1;
    clean_layers();
    wasActive = is_active_fig[[case_no,fig_no]];
    handle_collapse([case_no,fig_no],'fig');

    if(!wasActive) {

        shp("files/brazil/ucs_arpa_br_mma_snuc_2017_w").then(function(geojson){
            case_8_1_fig1_layer1 = L.geoJson(geojson, {style: {
                "color": "#00994c",
                "opacity": 0.65
                }
            }).addTo(map);
        }).then(
            $.getJSON('files/brazil/amapoly_ivb.json', function(data) {
                case_8_1_fig1_layer2 = L.geoJson(data, {style: {
                    "opacity": 0.2
                    }
                }).addTo(map);
            })
        ).then(
            $.getJSON('files/brazil/amazonriver_865.json', function(data) {
                case_8_1_fig1_layer3 = L.geoJson(data, {style: {
                    "weight": 5
                    }
                }).addTo(map);
            })
        ).then(() => {
            case_8_1_fig1_legend = L.control({position: 'topleft'});
            case_8_1_fig1_legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend bg-color');
                categories = ['Amazon Basin','ARPA System','Amazon River main stream'];
                colors = ["rgb(215, 225, 244)", "rgb(110, 168, 117)", "rgb(84, 131, 244)"]
                lgnd = ["<strong>Legend</strong>"];

                for (var i = 0; i < categories.length; i++) {
                    div.innerHTML +=  lgnd.push('<i class="circle border" style="background:' + colors[i] + '"></i> ' + (categories[i]));
                }

                div.innerHTML = lgnd.join('<br>');
                return div;
             };

            //x.addTo(map)
        });

    }
};
function get_marker_color(phase){
    return phase == 'phase_' ?  'Maroon' :
           phase == 'phase_0' ?  'LightCoral' :
           phase == 'phase_1' ?  'SteelBlue' :
           phase == 'phase_2' ? 'Aqua' :
           phase == 'phase_3' ?'Chartreuse' :
           phase == 'phase_4' ?'#00FA9A' :
           phase == 'phase_5' ?'Green' :
                                'Aquamarine';
           
}
function case_9_1_fig1() {
    map.setView([20.0, 0.0], 2.7);    
    case_no = 9.1;
    fig_no = 1;
    clean_layers();
    wasActive = is_active_fig[[case_no,fig_no]];
    handle_collapse([case_no,fig_no],'fig');
    //console.log("9.1 clicked", waterfund_bool)
    if(!wasActive){
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
                console.log(get_marker_color('phase_'+data[i]['Phase_Code']));
                
                var marker = L.marker([data[i]['Latitude'],data[i]['Longitude']], {
                    icon: L.divIcon({
                      html: '<i class="fa fa-tint fa-lg" aria-hidden="true" style="color:'+get_marker_color('phase_'+data[i]['Phase_Code'])+'"></i>',
                      className: 'myDivIcon'
                    })}
                );
                //waterfund_objs[i];//.addTo(map);
                if (data[i]['Phase']==('Operation'||'Maturity')){
                    marker.bindPopup("<b>Phase:</b>" +data[i]['Phase']+"<br>"+"<b>City:</b>"+data[i]['City']
                    +"<br>"+"<b>Country:</b>"+data[i]['Country']+"<br>"+"<b>State:</b>"+data[i]['State']+"<br>"+"<b>State:</b>"+data[i]['State']
                    +"<br>"+"<b>Operational since:</b>"+data[i]['Operational']).on('mouseover', function (e) {
                        this.openPopup();
                    }).on('mouseout', function (e) {
                        this.closePopup();
                    });
                }
                else{
                    marker.bindPopup("<b>Phase:</b>"+data[i]['Phase']+"<br>"+"<b>City:</b>"+data[i]['City']
                    +"<br>"+"<b>Country:</b>"+data[i]['Country']+"<br>"+"<b>State:</b>"+data[i]['State']+"<br>","<b>State:</b>"+data[i]['State']).on('mouseover', function (e) {
                        this.openPopup();
                    }).on('mouseout', function (e) {
                        this.closePopup();
                    });;
                }
                waterfund_markers['phase_'+data[i]['Phase_Code']].push(marker);
                //waterfund_objs[i]=marker
            }
            waterfund_objs['phase_'] = L.layerGroup(waterfund_markers['phase_']).addTo(map);
            waterfund_objs['phase_0'] = L.layerGroup(waterfund_markers['phase_0']).addTo(map);
            waterfund_objs['phase_1'] = L.layerGroup(waterfund_markers['phase_1']).addTo(map);
            waterfund_objs['phase_2'] = L.layerGroup(waterfund_markers['phase_2']).addTo(map);
            waterfund_objs['phase_3'] = L.layerGroup(waterfund_markers['phase_3']).addTo(map);
            waterfund_objs['phase_4'] = L.layerGroup(waterfund_markers['phase_4']).addTo(map);
            waterfund_objs['phase_5'] = L.layerGroup(waterfund_markers['phase_5']).addTo(map);
            var overlayMaps = {
                "Being Explored":               waterfund_objs['phase_'] ,
                "Phase 0: Pre-Feasibility ":    waterfund_objs['phase_0'],
                "Phase 1: Feasibility ":        waterfund_objs['phase_1'],
                "Phase 2: Design":              waterfund_objs['phase_2'],
                "Phase 3: Creation":            waterfund_objs['phase_3'],
                "Phase 4: Operation":           waterfund_objs['phase_4'],
                "Phase 5: Maturity":            waterfund_objs['phase_5']
            };
            waterfund_objs['con_layers']=L.control.layers(null,overlayMaps,{collapsed:false, position: 'topleft'}).addTo(map);
            $('.leaflet-control-layers-selector:checked')
        });
        waterfund_bool=true;
    }
}

function case_6_1_choropleth_from_csv(data_file,year,grades,percent){
    d3.csv("./"+data_file+".csv").then(function(data){
        choropleth_fips['grades']=grades;
        var sum = sum_values(data,year);
        //console.log(sum,"SUM in heactares",(sum*0.40468564)/1000000,"millions");
        for(var i=0;i< data.length;i++){
            if (percent){
                choropleth_fips[ data[i]['FIPS']]= (parseInt( data[i][year].replace('.',''))/sum)*10000;
            }
            else{
                choropleth_fips[data[i]['FIPS']]= parseInt( data[i][year])/2.4711;
            }
    }

        //console.log("printed")
        shp("files/county/counties").then(function(geojson){
            choropleth_map_objs['geo'] = L.geoJson(geojson, {style: style})
            choropleth_map_objs['geo'].addTo(map);
            //console.log("after",Object.keys(choropleth_map_objs).length)
        });

        choropleth_map_objs['legend'] = L.control({position: 'topleft'});

        choropleth_map_objs['legend'].onAdd = function (map) {
            return legend(grades)
        };
        choropleth_map_objs['legend'].addTo(map);
    });
}


function sum_values(data,column){
    var sum=0.0;
    for(var i=0;i<data.length;i++){
        sum+=parseFloat(data[i][column].replace('.',''));
    }
    return sum
}

function view_world(){
  map.setView([20.0, 0.0], ZOOM);
  return
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


function handle_view(case_no){

  //User clicked on active subchapter: reset
  if(is_active_subchapter[case_no]){
    if (table_is_main_content) view_world();
    else {
      geojson.eachLayer(function(layer) {
        if (layer.feature.properties.name == active_country) {
            map.fitBounds(layer.getBounds());
        }
      });

    }
   }
  else{
    lat = case_location_view[case_no].split(',')[0];
    long = case_location_view[case_no].split(',')[1];
    zoom = case_location_view[case_no].split(',')[2]
    map.setView([lat, long],zoom);
  }
}

function clean_layers(){

  //case_6_1_fig2 and case_6_1_fig3
  if(is_active_fig[[6.1,2]]||is_active_fig[[6.1,3]]){
    //remove choropleth
    map.removeControl(choropleth_map_objs['legend']);
    Object.keys(choropleth_map_objs).forEach(function(key) {
        map.removeLayer(choropleth_map_objs[key]);
    });
  }
  //case_6_3_fig1
  else if(is_active_fig[[6.3,1]]){
    map.removeLayer(case_6_3_fig1_layer);
    geojson.eachLayer(function(layer) {
        if (layer.feature.properties.name == 'South Africa') {
            geojson.resetStyle(layer);
        }
    });
    map.removeControl(case_6_3_fig1_legend);
  }
  //case_7_2_fig1
  else if(is_active_fig[[7.2,1]]){
    map.removeLayer(case_7_2_fig1_layer);
  }
  //case_7_4_fig1
  else if(is_active_fig[[7.4,1]]){
    map.removeLayer(case_7_4_fig1_layer);
  }
  //case_8_1_fig1
  else if(is_active_fig[[8.1,1]]){
    map.removeLayer(case_8_1_fig1_layer1);
    map.removeLayer(case_8_1_fig1_layer2);
    map.removeLayer(case_8_1_fig1_layer3);
    map.removeControl(case_8_1_fig1_legend);
  }
  //case_9_1_fig1
  else if(is_active_fig[[9.1,1]]){    
    waterfund_markers=[]
    //remove objs
    Object.keys(waterfund_objs).forEach(function(key) {
        if(key=='con_layers'){
            waterfund_objs[key].remove(map)
        }
        else{
          waterfund_objs[key].clearLayers();
        }
    });
    Object.keys(waterfund_markers).forEach(function(key) {
        map.removeLayer(waterfund_markers[key]);
    });    
  }
}

function handle_collapse(input, collapse_type){

  if(collapse_type==='chapter'){
    ch_no = input;
    case_no = 'none';
    fig_no = 'none';
  }

  if(collapse_type=='subchapter'){
    ch_no = input.toString().split('.')[0]
    case_no = input;
    fig_no = 'none';
  }
  else if(collapse_type=='fig'){
    ch_no  = input[0].toString().split('.')[0]
    case_no = input[0];
    fig_no = input[1]
  }

  //chapter collapse
  Object.keys(is_active_chapter).forEach(function(ch_no_tmp){
    if (is_active_chapter[ch_no_tmp]==true
      && !(ch_no == ch_no_tmp)){
      if (table_is_main_content) link_fill = ' #active-'+ch_no_tmp+' #'+ch_no_tmp+'-submenu';
      else link_fill = '';
      $('#chapter-table'+link_fill).collapse('toggle');
      is_active_chapter[ch_no_tmp] = false;
    }
  });
  //$('#chapter-table #active-'+ch_no_tmp+' #'+ch_no_tmp+'-submenu').collapse('toggle');

  //subchapter collapse
  Object.keys(is_active_subchapter).forEach(function(case_no_tmp){
    if (is_active_subchapter[case_no_tmp]==true
      && !(case_no == case_no_tmp)){
      ch_no_tmp = case_no_tmp.toString().split('.')[0]
      if (table_is_main_content) link_fill = ' #active-'+ch_no_tmp+' #'+ch_no_tmp+'-submenu';
      else link_fill = '';
      $('#chapter-table'+link_fill+' #'+case_no_tmp.toString().replace('.','-')+'-submenu').collapse('toggle');
      is_active_subchapter[case_no_tmp] = false;
    }
  });



  //figure description collapse
  Object.keys(is_active_fig).forEach(function(key){
    case_no_tmp = key.toString().split(',')[0];
    fig_no_tmp = key.toString().split(',')[1];
    if (is_active_fig[[case_no_tmp,fig_no_tmp]]==true
      && !(case_no==case_no_tmp && fig_no == fig_no_tmp)){
      ch_no_tmp = case_no_tmp.toString().split('.')[0]
      if (table_is_main_content) link_fill = ' #active-'+ch_no_tmp+' #'+ch_no_tmp+'-submenu';
      else link_fill = '';
      //if figure in chapter ulist
      if ((case_no_tmp.toString().split('.')).length==1){
        $('#chapter-table'+link_fill+' #'+ch_no_tmp+'-'+fig_no_tmp+'-detail').collapse('toggle');
      }
      //if figure in subchapter ulist
      else{
      $('#chapter-table'+link_fill+' #'+case_no_tmp.toString().replace('.','-')+'-submenu #'+case_no_tmp.toString().replace('.','-')+'-'+fig_no_tmp+'-detail').collapse('toggle');
      }
      is_active_fig[[case_no_tmp,fig_no_tmp]]=false;
    }
  });

  if(collapse_type=='chapter'){
    if(is_active_chapter[ch_no]==false) is_active_chapter[ch_no] = true;
    else is_active_chapter[ch_no] = false;
  }
  if(collapse_type=='subchapter'){
    if(is_active_subchapter[case_no]==false) is_active_subchapter[case_no] = true;
    else is_active_subchapter[case_no] = false;
  }
  else if(collapse_type=='fig'){
    if(is_active_fig[[case_no,fig_no]]==false) is_active_fig[[case_no,fig_no]]=true;
    else is_active_fig[[case_no,fig_no]]=false;
  }

}

/*

$("#chapter-table").on('click','tr',function(e) {
    //console.log("js chapters");
    if ( $( "#info-panel" ).is( ":hidden" ) ) {
        // Get information
        showDetails(e.currentTarget.cells[0].innerText);
        $( "#info-panel" ).slideDown('slow');
      }  else {
          // Refresh information
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
*/

/*
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
*/
