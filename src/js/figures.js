let previous_active_case = '0-0';
var color;
// display dynamic figures (on map) for cases (subchapter) that have one
function display_figure(case_){
  //if (true){
    clean_layers()
    if (case_.id!=null){
        if (case_.id=='6-1')
            data_loader.cases[case_.id].show(1);
        else
            data_loader.cases[case_.id].show();
    }
    previous_active_case = case_;
  //}
}

function clean_layers(){
    console.log("hide case id:",previous_active_case.id)
    if (previous_active_case.id != null)
        data_loader.cases[previous_active_case.id].hide();
}

// creating choropleth layer given values for each county data as parameter
function choropleth_from_csv(data, year_list,grades,percent,fig){
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
        if(fig==2){
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
            let categories=[];
            if(fig=='1'){
                categories = ['0%','0 - 1%','1 - 5%','5 - 10%','> 10%'];
            }
            else if(fig=='2'){
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
    return phase == 'phase_0'||phase == 'phase_1'||phase == 'phase_' ?  '#eea551cf' : //hsl(4, 72%, 55%, 0.81) #DF453A
           phase == 'phase_2'||phase == 'phase_3' ? '#e6e600' :
           phase == 'phase_5'||phase ==  'phase_4' ?'#1AFF05' :
                                'white';
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

function style_blue_8_2(feature) {
    return {

        fillColor: getColor_blueish(feature.properties.Percent_Co*100,[0, 1, 20, 40, 80]),
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
