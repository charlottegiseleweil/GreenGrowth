async function construct_cases(){

    //////////////////CHAPTER 6//////////////////////
    // Case 6-1
    console.log("cases",data_loader.cases);    
        data_loader.cases['6-1'].create_data = async function(a){
            //preload 6_1-1
            d3.csv("data/line_plot.csv",function(lineplot_data){
                    data_points_acres.push({x: parseInt(lineplot_data['yr'],10) ,y:lineplot_data['Total_Acres']/1000000})
                    data_points_money.push({x: parseInt(lineplot_data['yr'],10),y:lineplot_data['Total_Money']/1000000})
            });
            choropleth_map_county = await shp("data/county/counties");            
            case_6_1_fig2_data = await  d3.csv("data/acres_new.csv");
            case_6_1_choropleth_from_csv(case_6_1_fig2_data, ['2016'],[0, 0, 1, 5, 10],true,2);
    
            //preload case_6_1-3
            case_6_1_fig3_data = await d3.csv("data/acres_payments.csv");
            case_6_1_choropleth_from_csv(case_6_1_fig3_data, ['2016'],[0, 0, 20, 40, 80],false,3);
            return;
        }
        data_loader.cases['6-1'].show = function(a){

            console.log(" overloaded "+a);
        }
        
        data_loader.cases['6-1'].hide = function(a){
            console.log(" overloaded "+a);
        }

    ///////////Case 6-2///////////
    data_loader.cases['6-2'].create_data = async function(a){
        let files=["Aqueducts","Croton_","Incityflow","NY_City","Tunnels","dfw_hudson_river_morphology"];
        colors = ['#ffffff', '#71c7ec', '#189ad3', '#107dac', '#005073',"#214587"]        
        let kml_layer = omnivore.kml("data/6-2/doc.kml");
        add_shape_file('6-2',files,colors,kml_layer);
        return;
    }

    //show
    data_loader.cases['6-2'].show = async function(a){
        for (var layer in data_loader.cases['6-2'].layers){
            map.addLayer(data_loader.cases['6-2'].layers[layer]);
        }
    console.log("6-2")        
        return;
    }
    //hide
    data_loader.cases['6-2'].hide = async function(a){
        for (var layer in data_loader.cases['6-2'].layers){
            map.removeLayer(data_loader.cases['6-2'].layers[layer]);
        }
        return;
    }
    
    /////////case 7-1/////////
    data_loader.cases['7-1'].create_data = async function(a){
        let case_7_1_files=["NHDArea","NHDLine","WBDLine"];
        for (var file in case_7_1_files){
            let shape_file = await shp("data/7.1/"+case_7_1_files[file]);
            case_7_1_fig1_layer.push(shape_file);
        }
        case_7_1_create_layers();
        return;
    }

    //case 7-2
    data_loader.cases['7-2'].create_data = async function(a){
        var data = await $.getJSON('data/mitigation_bank.json');
        case_7_2_fig1_layer = L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                let label = String(feature.properties.NUMPOINTS)
                return new L.circleMarker(latlng, geojsonMarkerOptions).bindTooltip(label, {permanent: true, opacity: 0.7}).openTooltip();
            }
        });
        console.log("---7-2");
        return;
    }

    ///////////// 7-3 //////////////
    data_loader.cases['7-3'].create_data = async function(a){
        let files=["cb_2017_us_state_500k"];
        colors = ['#ffffff']        
        await add_shape_file('7-3',files,colors);
        var markers = [];
        
        d3.csv("data/7-3/CA_Conservation Banks.csv",function(mitigation_data){
            console.log("mit_data",mitigation_data['Name']);
            
            //create marker
            var marker = L.marker([mitigation_data['Y'],mitigation_data['X']], {
                icon: L.divIcon({
                  html: '<i class="fa fa-leaf fa-lg" aria-hidden="true" style="color:green"#234523"></i>',
                  className: 'myDivIcon'
                })}
            );            
            //set values in popup
            marker.bindPopup("<b>Name:</b>" +mitigation_data['Name']+"<br><b>Bank Type:</b>" +mitigation_data['Bank Type']+"<br>"+"<b>Bank Status:</b>"+mitigation_data['Bank Status']).on('mouseover', function (e) {
                this.openPopup();
            }).on('mouseout', function (e) {
                this.closePopup();
            });
//            overlay_maps[mitigation_data['Name']] = marker;      
            //data_loader.cases['7-3'].layers[mitigation_data['Name']]= marker;
            markers.push(marker);
        });
        //map.addLayer(markers);

        data_loader.cases['7-3'].layers["markers"]=markers;
        return;
    }

    //show
    data_loader.cases['7-3'].show = async function(a){
        for (var i in data_loader.cases['7-3'].layers["markers"])
            data_loader.cases['7-3'].layers["markers"][i].addTo(map);
        data_loader.cases['7-3'].layers[0].addTo(map)
    }
    
    //hide
    data_loader.cases['7-3'].hide = async function(a){
        map.removeLayer(data_loader.cases['7-3'].layers[0])
        for (var i in data_loader.cases['7-3'].layers["markers"])
            map.removeLayer(data_loader.cases['7-3'].layers["markers"][i])
        
        return;
    }
    


    //case 7-4
    data_loader.cases['7-4'].create_data = async function(a){
        var geojson = await shp("data/forest/forest.offset.projects.updated2017");
        case_7_4_fig1_layer = L.geoJson(geojson, {
            pointToLayer: function (feature, latlng) {
                return new L.marker(latlng, {
                    icon: L.divIcon({
                    html: '<i class="fa fa-tree" aria-hidden="true" style="color:blue"></i>',
                    className: 'myDivIcon'
                    })
                }).bindPopup('<i>'+String(feature.properties.NAME)+'</i><br>'+String(feature.properties.Area2)+' <strong>hectares.</strong>').on('mouseover', function (e) {
                    this.openPopup();
                }).on('mouseout', function (e) {
                    this.closePopup();
                });
            }
        })
        console.log("---7-4");        
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
        console.log("---8-1");
        return;
    }    
    //case 9-1
    data_loader.cases['9-1'].create_data = async function(a){
        case_9_1_fig1_data = await d3.csv("data/Water_Funds.csv");
        return;
    }


    ////////case 8-2//////////
    //create
    data_loader.cases['8-2'].create_data = async function(a){
         //"NCED_Polygons_08152017"
         colors=['#E31A1C'];         
         let files=["Agg_per_county_all_stats"];
        add_shape_file('8-2',files,colors);
        return;
    }
    //show
    data_loader.cases['8-2'].show = async function(a){
        for (var layer in data_loader.cases['8-2'].layers){
            map.addLayer(data_loader.cases['8-2'].layers[layer]);
        }
    console.log("8-2")        
        return;
    }
    //hide
    data_loader.cases['8-2'].hide = async function(a){
        for (var layer in data_loader.cases['8-2'].layers){
            map.removeLayer(data_loader.cases['8-2'].layers[layer]);
        }
        return;
    }

    ///////10-3/////////
    //create
    data_loader.cases['10-3'].create_data = async function(a){
        //"NCED_Polygons_08152017"
        colors=['#E31A1C'];        
        let files=["mdb_boundary"];
        add_shape_file('10-3',files,colors);        
    return;
    }
    //show
    data_loader.cases['10-3'].show = async function(a){
        for (var layer in data_loader.cases['10-3'].layers){
            map.addLayer(data_loader.cases['10-3'].layers[layer]);
        }
    console.log("10-3")        
        return;
    }
    //hide
    data_loader.cases['10-3'].hide = async function(a){
        for (var layer in data_loader.cases['10-3'].layers){
            map.removeLayer(data_loader.cases['10-3'].layers[layer]);
        }
        return;
    }

     ///////13-1/////////
    //create
    data_loader.cases['13-1'].create_data = async function(a){
        //"NCED_Polygons_08152017"
        colors=['#E31A1C'];        
        let files=["guanacaste"];
        add_shape_file('13-1',files,colors);        
    return;
    }
    //show
    data_loader.cases['13-1'].show = async function(a){
        for (var layer in data_loader.cases['13-1'].layers){
            map.addLayer(data_loader.cases['13-1'].layers[layer]);
        }
    console.log("13-1")        
        return;
    }
    //hide
    data_loader.cases['13-1'].hide = async function(a){
        for (var layer in data_loader.cases['13-1'].layers){
            map.removeLayer(data_loader.cases['13-1'].layers[layer]);
        }
        return;
    }

    data_loader.preloadDynamicFigures();   
    return "cases";
}


function style(feature) {
    console.log(color);
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