async function construct_cases(){

    //////////////////CHAPTER 6//////////////////////
    // Case 6-1
    //console.log("cases",data_loader.cases);
        //create
        data_loader.cases['6-1'].create_data = async function(){
            //preload 6_1-1
            d3.csv("data/line_plot.csv",function(lineplot_data){
                    data_points_acres.push({x: parseInt(lineplot_data['yr'],10) ,y:lineplot_data['Total_Acres']/1000000})
                    data_points_money.push({x: parseInt(lineplot_data['yr'],10),y:lineplot_data['Total_Money']/1000000})
            });
            choropleth_map_county = await shp("data/county/counties");
            case_6_1_fig2_data = await  d3.csv("data/acres_new.csv");
            choropleth_from_csv(case_6_1_fig2_data, ['2016'],[0, 0, 1, 5, 10],true,1);

            //preload case_6_1-3
            case_6_1_fig3_data = await d3.csv("data/acres_payments.csv");
            choropleth_from_csv(case_6_1_fig3_data, ['2016'],[0, 0, 20, 40, 80],false,2);
            return;
        }
        //show
        data_loader.cases['6-1'].show = function(button_id){
            clean_layers();
            //console.log(button_id,"button",choropleth_map_objs,'legend-'+button_id);
            description=["Land enrolled in CRP (%)","Soil rental rate (USD/ha)"];
            $("#button-"+button_id).css('background-color','#39ac73');
            choropleth_map_objs['2016geo-'+button_id].addTo(map)//add choropleth layer
            choropleth_map_objs['legend-'+button_id].addTo(map);//add legend
            add_legend_to_right_menu(choropleth_map_objs['legend-'+button_id],"6-1",description[0]);
        }
        //hide
        data_loader.cases['6-1'].hide = function(){
            $('#button-1').css('background-color', 'rgba(255, 255, 255, 0.8)');
            $('#button-2').css('background-color', 'rgba(255, 255, 255, 0.8)');
            map.removeControl(choropleth_map_objs['legend-1']);
            map.removeControl(choropleth_map_objs['legend-2']);
            //map.removeControl(choropleth_map_objs['slider']);

            Object.keys(choropleth_map_objs).forEach(function(key) {
                map.removeLayer(choropleth_map_objs[key]);
            });
        }

    ///////////Case 6-2///////////
    data_loader.cases['6-2'].create_data = async function(a){
        let files=["Aqueducts","Croton_","Incityflow","NY_City","Tunnels","dfw_hudson_river_morphology"];
        colors = ['#ffffff', '#71c7ec', '#189ad3', '#107dac', '#005073',"#214587"]
        let kml_layer = omnivore.kml("data/6-2/doc.kml");
        add_shape_file(this.id,files,colors,kml_layer);
        return;
    }

    //show
    data_loader.cases['6-2'].show = async function(a){
        for (var layer in this.layers){
            map.addLayer(this.layers[layer]);
        }
    //console.log("6-2")
        return;
    }
    //hide
    data_loader.cases['6-2'].hide = async function(a){
        for (var layer in this.layers){
            map.removeLayer(this.layers[layer]);
        }
        return;
    }

    data_loader.cases['6-3'].show = async function(a){
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

        return;
    }
    data_loader.cases['6-3'].hide = async function(a){
        map.removeLayer(case_6_3_fig1_layer);
        map.removeControl(case_6_3_fig1_legend);
        geojson.eachLayer(function(layer) {

            if (layer.feature.properties.name == 'South Africa') {
                //layer.setStyle({fillOpacity: 0});
                geojson.resetStyle(layer);
            }
        });
        return;
    }

    /////////case 7-1/////////
    data_loader.cases['7-1'].create_data = async function(a){
        let case_7_1_files=["NHDArea","NHDLine","WBDLine"];
        for (var file in case_7_1_files){
            let shape_file = await shp("data/7.1/"+case_7_1_files[file]);
            case_7_1_fig1_layer.push(shape_file);
        }
        let colors=['#71c7ec', 'red', 'yellow', '#ffffff'];
        let overlay_maps={}
        for (var i in case_7_1_fig1_layer){
            color=colors[i];
            overlay_maps[i] = new L.Shapefile(case_7_1_fig1_layer[i], {style:style});
            //console.log("7.1",i,case_7_1_fig1_layer[i]);
        }
    //create layer control by adding layer groups
        case_7_1_fig1_layer_group['layers']=overlay_maps;
        return;
    }

    data_loader.cases['7-1'].show = async function(a){
        for (var layer in case_7_1_fig1_layer_group['layers']){
            map.addLayer(case_7_1_fig1_layer_group['layers'][layer]);
        }
        return;
    }
    data_loader.cases['7-1'].hide = async function(a){
        for (var layer in case_7_1_fig1_layer_group['layers']){
            map.removeLayer(case_7_1_fig1_layer_group['layers'][layer])
        }
        return;
    }
    //case 7-2
    data_loader.cases['7-2'].create_data = async function(a){
      var myIcon = L.icon({
         iconUrl: './static/marker/pin24.png',
         iconRetinaUrl: './static/marker/pin48.png',
         iconSize: [29, 24],
         iconAnchor: [9, 21],
         popupAnchor: [0, -14]
       });

       case_7_2_fig1_clusters = L.markerClusterGroup();

       for ( var i = 0; i < markers_7_2.length; ++i )
       {
         var popup = '<b>'+markers_7_2[i].Name+'</b>' +
                     '<br/><u>Bank Type:</u> ' + markers_7_2[i].Bank_Type +
                     '<br/><u>Bank Status:</u> ' + markers_7_2[i].Bank_Status;

         var m = L.marker( [markers_7_2[i].lat, markers_7_2[i].lng], {icon: myIcon} )
                         .bindPopup( popup );

         case_7_2_fig1_clusters.addLayer( m );
       }
      return;
    }
    data_loader.cases['7-2'].show = async function(a){
        map.addLayer(case_7_2_fig1_clusters);
        return;
    }
    data_loader.cases['7-2'].hide = async function(a){
        map.removeLayer(case_7_2_fig1_clusters);
        return;
    }
    ///////////// 7-3 //////////////
    data_loader.cases['7-3'].create_data = async function(a){
        var markers = [];

        case_7_3_fig1_clusters = L.markerClusterGroup();

        d3.csv("data/7-3/CA_Conservation Banks.csv",function(mitigation_data){


          var popup = "<b>"+mitigation_data['Name']+"</b>"
                    +"<br><u>Bank Type:</u>"+mitigation_data['Bank Type']+"<br>"
                    +"<u>Bank Status:</u>"+mitigation_data['Bank Status'];
          //create marker
          var m = L.marker([mitigation_data['Y'],mitigation_data['X']], {icon:
            L.divIcon({
            html: '<i class="fa fa-leaf fa-lg" aria-hidden="true" style="color:blue"#234523"></i>',
            className: 'myDivIcon'
            })}).bindPopup( popup );
            case_7_3_fig1_clusters.addLayer(m);
            //markers.push(marker);
        });
        //map.addLayer(markers);
        //this.layers["markers"]=markers;
        return;
    }

    //show
    data_loader.cases['7-3'].show = async function(a){
      map.addLayer(case_7_3_fig1_clusters);
      return;
    }


    //hide
    data_loader.cases['7-3'].hide = async function(a){
      map.removeLayer(case_7_3_fig1_clusters);
      return;
    }

    //case 7-4
    data_loader.cases['7-4'].create_data = async function(a){
      case_7_4_fig1_clusters = L.markerClusterGroup();

      for ( var i = 0; i < markers_7_4.length; ++i )
      {
        var popup = '<b>'+markers_7_4[i].Name+'</b>' +
                    '<br/><u>Area:</u> ' + markers_7_4[i].Area

        var m = L.marker([markers_7_4[i].Lat, markers_7_4[i].Long], {icon: L.divIcon({
                            html: '<i class="fa fa-tree fa-lg" aria-hidden="true" style="color:blue"></i>',
                            className: 'myDivIcon'
                            })})
                        .bindPopup( popup );

        case_7_4_fig1_clusters.addLayer( m );
      }
      return;
    }
    data_loader.cases['7-4'].show = async function(a){
        map.addLayer(case_7_4_fig1_clusters);
        return;
    }
    data_loader.cases['7-4'].hide = async function(a){
        map.removeLayer(case_7_4_fig1_clusters);
        return;
    }
    //case 8-1
    data_loader.cases['8-1'].create_data = async function(a){
        geojson = await shp("data/brazil/ucs_arpa_br_mma_snuc_2017_w");
        case_8_1_fig1_layer1 = L.geoJson(geojson, {style: {"color": "#00994c","opacity": 0.65}});

        data = await $.getJSON('data/brazil/amapoly_ivb.json');
        case_8_1_fig1_layer2 = L.geoJson(data, {style: {"color": "#665BCE"}});

        data = await $.getJSON('data/brazil/amazonriver_865.json');
        case_8_1_fig1_layer3 = L.geoJson(data, {style: {"weight": 5}});
        //console.log("---8-1");
        return;
    }
    //show
    data_loader.cases['8-1'].show = async function(a){
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
        return;
    }
    //show
    data_loader.cases['8-1'].hide = async function(a){
            map.removeLayer(case_8_1_fig1_layer1);
            map.removeLayer(case_8_1_fig1_layer2);
            map.removeLayer(case_8_1_fig1_layer3);
            map.removeControl(case_8_1_fig1_legend);
        return;
    }

    //case 9-1
    data_loader.cases['9-1'].create_data = async function(a){
        case_9_1_fig1_data = await d3.csv("data/Water_Funds.csv");
        return;
    }
    data_loader.cases['9-1'].show = async function(a){
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
        return;
    }
    data_loader.cases['9-1'].hide = async function(a){
        waterfund_markers=[]
        waterfund_objs['con_layers'].remove(map);
        waterfund_objs['phase_'].clearLayers();
        waterfund_objs['phase_0'].clearLayers();
        waterfund_objs['phase_1'].clearLayers();
        waterfund_objs['phase_2'].clearLayers();
        waterfund_objs['phase_3'].clearLayers();
        waterfund_objs['phase_4'].clearLayers();
        waterfund_objs['phase_5'].clearLayers();
        return;
    }


    /*
    ////////case 8-2//////////
    //create
    data_loader.cases['8-2'].create_data = async function(a){
         //"NCED_Polygons_08152017"
         colors=['#E31A1C'];
         let files=["Agg_per_county_all_stats"];
        add_shape_file(this.id,files,colors);
        return;
    }
    //show
    data_loader.cases['8-2'].show = async function(a){
        for (var layer in this.layers){
            map.addLayer(this.layers[layer]);
        }
    console.log("8-2")
        return;
    }
    //hide
    data_loader.cases['8-2'].hide = async function(a){
        for (var layer in this.layers){
            map.removeLayer(this.layers[layer]);
        }
        return;
    }
  */

    ///////10-3/////////
    //create
    data_loader.cases['10-3'].create_data = async function(a){
        //"NCED_Polygons_08152017"
        colors=['#E31A1C'];
        let files=["mdb_boundary"];
        add_shape_file(this.id,files,colors);
    return;
    }
    //show
    data_loader.cases['10-3'].show = async function(a){
        for (var layer in this.layers){
            map.addLayer(this.layers[layer]);
        }
    //console.log("10-3")
        return;
    }
    //hide
    data_loader.cases['10-3'].hide = async function(a){
        for (var layer in this.layers){
            map.removeLayer(this.layers[layer]);
        }
        return;
    }

     ///////13-1/////////
    //create
    data_loader.cases['13-1'].create_data = async function(a){
        //"NCED_Polygons_08152017"
        colors=['#E31A1C'];
        let files=["guanacaste"];
        add_shape_file(this.id,files,colors);
    return;
    }
    //show
    data_loader.cases['13-1'].show = async function(a){
        for (var layer in this.layers){
            map.addLayer(this.layers[layer]);
        }
    //console.log("13-1")
        return;
    }
    //hide
    data_loader.cases['13-1'].hide = async function(a){
        for (var layer in this.layers){
            map.removeLayer(this.layers[layer]);
        }
        return;
    }

    //data_loader.preloadDynamicFigures();
    return "cases";
}


function style(feature) {
    //console.log(color);
    return {
        fillColor: color,
        weight: 2,
        opacity: 1,
        color: color,
        dashArray: '3',
        fillOpacity: 0.7
    };
}


async function add_shape_file(id,files,colors,additional_layer){
    for (var file in files){
        let shape_file = await shp("data/"+id+'/'+files[file]);
        data_loader.cases[id].files.push(shape_file);
    }
    let overlay_maps={}
    for (var i in data_loader.cases[id].files){
        shape = data_loader.cases[id].files[i];
        color=colors[i]
        overlay_maps[i] = new L.Shapefile(shape, {style:style});
    }
    if (additional_layer!=null){
        i+=1
        overlay_maps[i] = additional_layer;
    }
//create layer control by adding layer groups
data_loader.cases[id].layers=overlay_maps;
}
