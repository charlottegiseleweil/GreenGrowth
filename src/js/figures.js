let previous_active_case = '0-0';
var color;
// display dynamic figures (on map) for cases (subchapter) that have one
function display_figure(case_){
  //if (true){
    clean_layers()
    switch(case_.id){
        case '6-1':
            case_6_1_fig2();
        //case_6_1_fig2()
            break
        case '6-2':
            data_loader.cases['6-2'].show();        
            break
        case '6-3':
            case_6_3_fig1();
            break
        case '7-1':
            case_7_1_show_layers();
            break
        case '7-2':
            case_7_2_fig1_layer.addTo(map);
            break
        case '7-3':
            data_loader.cases['7-3'].show();        
            break
        case '7-4':
            case_7_4_fig1_layer.addTo(map);
            break
        case '8-1':
            case_8_1_fig1();
            break
        case '8-2':
            console.log("8-2");
            data_loader.cases['8-2'].show();
            break
        case '9-1':
            case_9_1_fig1();
            break
        case '10-3':
            data_loader.cases['10-3'].show();
            break
        case '13-1':
            data_loader.cases['13-1'].show();
            break
        }
    previous_active_case = case_;
  //}
}



function case_7_1_show_layers(){
    for (var layer in case_7_1_fig1_layer_group['layers']){
        map.addLayer(case_7_1_fig1_layer_group['layers'][layer]);
    }
};


function case_6_1_fig2() {
    clean_layers();
    $("#button-1").css('background-color','#39ac73');
    choropleth_map_objs['2016geo-2'].addTo(map)//add choropleth layer
    choropleth_map_objs['legend-2'].addTo(map);//add legend
    add_legend_to_right_menu(choropleth_map_objs['legend-2'],"6-1","Land enrolled in CRP (%)");
};

// add choropleth of case 6.1 fig3 to map
function case_6_1_fig3() {
    clean_layers();
    $("#button-2").css('background-color','#39ac73');
    choropleth_map_objs['2016geo-3'].addTo(map)
    choropleth_map_objs['legend-3'].addTo(map);
    add_legend_to_right_menu(choropleth_map_objs['legend-3'],"6-1","Soil rental rate (USD/ha)");
};

// creating choropleth layer given values for each county data as parameter
function case_6_1_choropleth_from_csv(data, year_list,grades,percent,fig){
    choropleth_fips['grades']=grades;
    layers=[]

    for (year_idx=0;year_idx<year_list.length;year_idx++){

        year = year_list[year_idx];

        for(var i=0;i< data.length;i++){
            if (percent){
                var sum = sum_values(data,year);
                choropleth_fips[ data[i]['FIPS']]= (parseInt( data[i][year].replace('.',''))/sum)*10000;
            }
            else{
                choropleth_fips[data[i]['FIPS']]= parseInt( data[i][year])/2.4711;
            }
        }
        let colors=[]
        if(fig==3){
            colors = ['#ffffff', '#FFEDA0', '#E31A1C', '#BD0026', '#800026']
            choropleth_map_objs[year+'geo-'+fig] = L.geoJson(choropleth_map_county, {style: style_red, time: year})
        }
        else{
            colors = ['#ffffff', '#71c7ec', '#189ad3', '#107dac', '#005073']
            choropleth_map_objs[year+'geo-'+fig] = L.geoJson(choropleth_map_county, {style: style_blue, time: year})
        }

        layers.push(choropleth_map_objs[year+'geo-'+fig]);

        choropleth_map_objs['legend-'+fig] = L.control({position: 'bottomleft'});

        choropleth_map_objs['legend-'+fig].onAdd = function (map){
            var div = L.DomUtil.create('div', 'info legend');
            if(fig=='2'){
                categories = ['0%','0 - 1%','1 - 5%','5 - 10%','> 10%'];
            }
            else if(fig=='3'){
                categories = ['0 USD/ha','0 - 20 USD/ha','20 - 40 USD/ha','40 - 50 USD/ha','> 80 USD/ha'];
            }

            lgnd = [];

            for (var i = 0; i < categories.length; i++) {
                div.innerHTML +=  lgnd.push('<i style="background:' + colors[i] + '"></i> ' + (categories[i]));
            }

            div.innerHTML = lgnd.join('<br>');
            return div;


    }
    if (year_list.length>1){
        var layerGroup = L.layerGroup(layers);
        //initiate slider, follow = 1 means, show one feature at a time
        //choropleth_map_objs['slider'] = L.control.sliderControl({position: "topleft",layer:layerGroup, follow: 1});
    }
}
}
// add png of south africa on map
function case_6_3_fig1() {
    var lg;
      var imageUrl = './data/sonuc.png';

      case_6_3_fig1_legend = L.control({position: 'bottomleft'});
      geojson.eachLayer(function(layer) {
          if (layer.feature.properties.name == 'South Africa') {
              layer.setStyle({fillOpacity: 0});
          }
      });

      case_6_3_fig1_legend.onAdd = function (map) {
          var div = L.DomUtil.create('div', 'info legend');
          categories = ['0 or no data','0 - 5%','5 - 10%','> 10%','Clearing areas'];
          colors = ['#ffffff', '#EBB57D', '#CF6042', '#980001', '#386507']
          lgnd = [];

          for (var i = 0; i < categories.length; i++) {
              div.innerHTML +=  lgnd.push('<i style="background:' + colors[i] + '"></i> ' + (categories[i]));
          }

          div.innerHTML = lgnd.join('<br>');
          return div;
          };
      //add legend
      case_6_3_fig1_legend.addTo(map);
      add_legend_to_right_menu(case_6_3_fig1_legend,"6-3","Invasive Alien Species (%)");
      imageBounds = [[-22.046289062500017, 33.80013281250005], [-34.885742187500006, 15.747558593750045]];
      case_6_3_fig1_layer = L.imageOverlay(imageUrl, imageBounds).addTo(map);//add image as overlay on the map using boundaries of South Africa


};

function case_7_1_create_layers(){
    let colors=['#71c7ec', 'red', 'yellow', '#ffffff'];
    let overlay_maps={}
    for (var i in case_7_1_fig1_layer){
        color=colors[i];
        overlay_maps[i] = new L.Shapefile(case_7_1_fig1_layer[i], {style:style});
        console.log("7.1",i,case_7_1_fig1_layer[i]);
    }
//create layer control by adding layer groups
    case_7_1_fig1_layer_group['layers']=overlay_maps;
    return;
}



function case_8_1_fig1() {
    //add layers of ARPA
    case_8_1_fig1_layer1.addTo(map);
    case_8_1_fig1_layer2.addTo(map);
    case_8_1_fig1_layer3.addTo(map);

    case_8_1_fig1_legend = L.control({position: 'bottomleft'});

    //create legend
    case_8_1_fig1_legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        categories = ['Amazon Basin','ARPA System','Amazon River'];
        colors = ["rgb(102, 91, 206)", "rgb(110, 168, 117)", "rgb(84, 131, 244)"]
        lgnd = [];

        for (var i = 0; i < categories.length; i++) {
            div.innerHTML +=  lgnd.push('<i style="background:' + colors[i] + '"></i> ' + (categories[i]));
        }

        div.innerHTML = lgnd.join('<br>');
        return div;
    };

    case_8_1_fig1_legend.addTo(map);
    add_legend_to_right_menu(case_8_1_fig1_legend,"8-1","Amazon Region Protected Area (ARPA) System");

};

// add water fund markers
function case_9_1_fig1() {
    data=case_9_1_fig1_data;
    //case_6_1_button_active = '1'

    case_no = 9.1;
    fig_no = 1;
    //init marker lists of each phase
    waterfund_markers['phase_'] = [];
    waterfund_markers['phase_0'] = [];
    waterfund_markers['phase_1'] = [];
    waterfund_markers['phase_2'] = [];
    waterfund_markers['phase_3'] = [];
    waterfund_markers['phase_4'] = [];
    waterfund_markers['phase_5'] = [];

    // iterate over water funds
    for(var i=0;i< data.length;i++){
        //create marker
        var marker = L.marker([data[i]['Latitude'],data[i]['Longitude']], {
            icon: L.divIcon({
              html: '<i class="fa fa-tint fa-lg" aria-hidden="true" style="color:'+get_marker_color('phase_'+data[i]['Phase_Code'])+'"></i>',
              className: 'myDivIcon'
            })}
        );

        //set values in popup
        if (data[i]['Phase']==('Operation'||'Maturity')){
            marker.bindPopup("<b>Phase:</b>" +data[i]['Phase']+"<br>"+"<b>City:</b>"+data[i]['City']
            +"<br>"+"<b>Country:</b>"+data[i]['Country']+"<br>"+"<b>State:</b>"+data[i]['State']
            +"<br>"+"<b>Operational since:</b>"+data[i]['Operational']).on('mouseover', function (e) {
                this.openPopup();
            }).on('mouseout', function (e) {
                this.closePopup();
            });
        }
        else{
            marker.bindPopup("<b>Phase:</b>"+data[i]['Phase']+"<br>"+"<b>City:</b>"+data[i]['City']
            +"<br>"+"<b>Country:</b>"+data[i]['Country']+"<br>"+"<b>State:</b>"+data[i]['State']).on('mouseover', function (e) {
                this.openPopup();
            }).on('mouseout', function (e) {
                this.closePopup();
            });;
        }
        waterfund_markers['phase_'+data[i]['Phase_Code']].push(marker);
        //waterfund_objs[i]=marker
    }
    //create layer groups containing markers for each case
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
    //create layer control by adding layer groups
    waterfund_objs['con_layers']=L.control.layers(null,overlayMaps,{collapsed:false, position: 'bottomleft'}).addTo(map);
    $('.leaflet-control-layers-selector:checked')
    add_legend_to_right_menu(waterfund_objs['con_layers'],"9-1","Water Funds phases");
    waterfund_bool=true;
}

function clean_layers(){
  if(previous_active_case.id =='6-1'){
    $('#button-1').css('background-color', 'rgba(255, 255, 255, 0.8)');
    $('#button-2').css('background-color', 'rgba(255, 255, 255, 0.8)');
    map.removeControl(choropleth_map_objs['legend-2']);
    map.removeControl(choropleth_map_objs['legend-3']);
    //map.removeControl(choropleth_map_objs['slider']);

    Object.keys(choropleth_map_objs).forEach(function(key) {
        map.removeLayer(choropleth_map_objs[key]);
    });

  }

  //case_6_3_fig1
  else if(previous_active_case.id=='6-3'){
    map.removeLayer(case_6_3_fig1_layer);
    map.removeControl(case_6_3_fig1_legend);
    geojson.eachLayer(function(layer) {

        if (layer.feature.properties.name == 'South Africa') {
            //layer.setStyle({fillOpacity: 0});
            geojson.resetStyle(layer);
        }
    });
  }
  //case_7_1_fig1
  else if(previous_active_case.id=='7-1'){
    for (var layer in case_7_1_fig1_layer_group['layers']){
        map.removeLayer(case_7_1_fig1_layer_group['layers'][layer])
    }
    }

  //case_7_2_fig1
  else if(previous_active_case.id=='7-2'){
    map.removeLayer(case_7_2_fig1_layer);
  }

  //case_7_4_fig1
  else if(previous_active_case.id=='7-4'){
    map.removeLayer(case_7_4_fig1_layer);
  }

  //case_8_1_fig1
  else if(previous_active_case.id=='8-1'){
    map.removeLayer(case_8_1_fig1_layer1);
    map.removeLayer(case_8_1_fig1_layer2);
    map.removeLayer(case_8_1_fig1_layer3);
    map.removeControl(case_8_1_fig1_legend);
  }
  else if(previous_active_case.id=='8-2'){
    data_loader.cases['8-2'].hide();
  }
  //case_9_1_fig1
  else if(previous_active_case.id=='9-1'){
    waterfund_markers=[]
    waterfund_objs['con_layers'].remove(map);
    waterfund_objs['phase_'].clearLayers();
    waterfund_objs['phase_0'].clearLayers();
    waterfund_objs['phase_1'].clearLayers();
    waterfund_objs['phase_2'].clearLayers();
    waterfund_objs['phase_3'].clearLayers();
    waterfund_objs['phase_4'].clearLayers();
    waterfund_objs['phase_5'].clearLayers();
  }
  else if(previous_active_case.id=='10-3'){
    data_loader.cases['10-3'].hide();
  }
  else if(previous_active_case.id=='13-1'){
    data_loader.cases['13-1'].hide();
  }
  else if(previous_active_case.id=='6-2'){
    data_loader.cases['6-2'].hide();
  }
  else if(previous_active_case.id=='7-3'){
    data_loader.cases['7-3'].hide();
  }
}

//create legends, give grades as parameter
function legend(grades){
    var div = L.DomUtil.create('div', 'info legend'),
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        if (i==0){
            div.innerHTML += '<i style="background:' + getColor(grades[i],grades) + '"></i> ' + (grades[i + 1]) + '<br>';
        }
        else{
            div.innerHTML += '<i style="background:' + getColor(grades[i] + 1,grades) + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    }
    return div;
}

//get color of water fund marker
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

// get colors of legend
function getColor_reddish(d,grades) {
    return d > grades[4] ?  '#800026' :
           d > grades[3] ?  '#BD0026' :
           d > grades[2] ?  '#E31A1C' :
           d > grades[1] ?  '#FFEDA0' :
                            '#FFFFFF' ;
}

function getColor_blueish(d,grades) {
    return d > grades[4] ?  '#005073' :
           d > grades[3] ?  '#107dac' :
           d > grades[2] ?  '#189ad3' :
           d > grades[1] ?  '#71c7ec' :
                            '#FFFFFF' ;
}
//return sum of given array
function sum_values(data,column){
    var sum=0.0;
    for(var i=0;i<data.length;i++){
        sum+=parseFloat(data[i][column].replace('.',''));
    }
    return sum
}

//get colors of choropleth
function style_blue(feature) {
    return {
        fillColor: getColor_blueish(choropleth_fips[feature.properties.fips],choropleth_fips['grades']),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}
function style_red(feature) {
    return {
        fillColor: getColor_reddish(choropleth_fips[feature.properties.fips],choropleth_fips['grades']),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function style(feature) {
    return {
        fillColor: color,
        weight: 2,
        opacity: 1,
        color: color,
        dashArray: '3',
        fillOpacity: 0.7
    };
}

//set map to show whole world
function view_world(){
  map.setView([20.0, 0.0], 3);
  return
}

function add_legend_to_right_menu(legend,id, title){
        var htmlObject = legend.getContainer();//get slider container

        var newpos = document.getElementById('right-case-'+id);//set time slider
        var legend_height = htmlObject.clientHeight;
        //console.log("height",legend_height);
        function setParent(el, newParent)
        {
        newParent.appendChild(el);
        el.style.float='None';
        el.style.marginLeft="30%";
        el.style.width = "40%";
        el.style.fontSize = "0.9vw";
        el.style.backgroundColor="rgb(230, 224, 224)";
        }
        setParent(htmlObject, newpos);
        $('#right-case-legend').remove();
        $('#right-case-'+id).append('<p id="right-case-legend" class="figure-text">' + title+ '</p>');
    }
