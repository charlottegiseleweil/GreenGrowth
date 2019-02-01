

//main Dataframes used in other js files
let chapters = [];
let subchapters = [];
let active_subchapter;

//used as data selecter
let only_dynamic_figs = false;

//used in figures (must clean)
var choropleth_fips={}
var choropleth_map_objs = {}
var waterfund_objs={}
var waterfund_markers={}
var case_6_1_button_active = '1'
var lineplot_data;
var case_6_1_fig3_data;
var case_6_1_fig2_data;
var case_7_2_fig1_layer;
var case_7_4_fig1_layer;
var case_9_1_fig1_data;
var choropleth_map_county;
var progress_bar = 0;
var case_8_1_fig1_layer1;
var case_8_1_fig1_layer2;
var case_8_1_fig1_layer3;

/*preload the data for dynamic figures
  and prepare the Dataframes used*/
$( 'body' ).ready(function() {
    // create progress bar
    $('.progress').bind('loaded',function(){
        $('.progress').hide();
        $('.entry-button').show();
    });
    //preload the data of the dynamic figures (slow)
    preloadDynamicFigures();

    //load and prepare dataframes
    prepareDataframes();
});


//read csv files, meanwhile update progress bar and create all leaflet layers on pre-loading page
const preloadDynamicFigures = async function() {
    //preload 6_1-1
    lineplot_data = await d3.csv("data/line_plot.csv");
    data_points_acres=[];
    data_points_money=[];

    for(var i=0;i<lineplot_data.length;i++){
        data_points_acres.push({x: parseInt(lineplot_data[i]['yr'],10) ,y:lineplot_data[i]['Total_Acres']/1000000})
        data_points_money.push({x: parseInt(lineplot_data[i]['yr'],10),y:lineplot_data[i]['Total_Money']/1000000})
    }

    progress_bar._progress += 20;

    //preload case_6_1-2
    choropleth_map_county = await shp("data/county/counties");
    data = await $.getJSON('data/mitigation_bank.json');
    case_6_1_fig2_data = await d3.csv("data/acres_new.csv");

    case_6_1_choropleth_from_csv(case_6_1_fig2_data, ['2014','2015','2016'],[0, 0, 1, 5, 10],true,2);

    //preload case_6_1-3
    case_6_1_fig3_data = await d3.csv("data/acres_payments.csv");
    case_6_1_choropleth_from_csv(case_6_1_fig3_data, ['2016'],[0, 0, 20, 40, 80],false,3);

    progress_bar._progress += 20;

    //preload case 7_2-1
    case_7_2_fig1_layer = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            label = String(feature.properties.NUMPOINTS)
            return new L.circleMarker(latlng, geojsonMarkerOptions).bindTooltip(label, {permanent: true, opacity: 0.7}).openTooltip();
        }
    });

    progress_bar._progress += 20;

    //preload case_7_4-1
    geojson = await shp("data/forest/forest.offset.projects.updated2017");
    case_7_4_fig1_layer = L.geoJson(geojson, {
        pointToLayer: function (feature, latlng) {
            return new L.marker(latlng, {
                icon: L.divIcon({
                html: '<i class="fa fa-tree" aria-hidden="true" style="color:lightgreen"></i>',
                className: 'myDivIcon'
                })
            }).bindPopup('<i>'+String(feature.properties.NAME)+'</i><br>'+String(feature.properties.Area2)+' <strong>hectares.</strong>').on('mouseover', function (e) {
                this.openPopup();
            }).on('mouseout', function (e) {
                this.closePopup();
            });
        }
    })

    progress_bar._progress += 20;

    case_9_1_fig1_data = await d3.csv("data/Water_Funds.csv");
    geojson = await shp("data/brazil/ucs_arpa_br_mma_snuc_2017_w");
    case_8_1_fig1_layer1 = L.geoJson(geojson, {style: {"color": "#00994c","opacity": 0.65}});

    data = await $.getJSON('data/brazil/amapoly_ivb.json');
    case_8_1_fig1_layer2 = L.geoJson(data, {style: {"color": "#665BCE"}});

    data = await $.getJSON('data/brazil/amazonriver_865.json');
    case_8_1_fig1_layer3 = L.geoJson(data, {style: {"weight": 5}});

    progress_bar._progress += 20;

    setTimeout(function(){$('.progress').trigger('loaded')}, 600);
}






const prepareDataframes = async function(){
  // read csv file containing cases information
  case_studies = await d3.csv("./data/case_studies.csv");
  //iterate over each case studie
  let ch_count = 0;
  let ch_ids_added = [];
  for(var i=0;i<case_studies.length;i++){
    if (!only_dynamic_figs || case_studies[i]['dynamic']=='TRUE'){

      //instantiate a subchapter and push it to the list
      subchapters.push(new Subchapter())

      //fetch and populate with the actual data
      subchapter_id = case_studies[i]["number"].replace(".","-");
      chapter_id = case_studies[i]["ch_no"];

      if (!(ch_ids_added.includes(chapter_id))){
        ch_ids_added.push(chapter_id);
        chapters.push(new Chapter());
        chapters[ch_count]["id"]=chapter_id;
        chapters[ch_count]["title"]=case_studies[i]["ch_title"];
        chapters[ch_count]["subchapters"] = [];
        ch_count++;
      }
      subchapters[i]["id"] = subchapter_id;
      subchapters[i]["title"] = case_studies[i]["name"];
      subchapters[i]["summary"] = case_studies[i]['summary'];
      subchapters[i]["loc_view"] = case_studies[i]['location_view'];
      subchapters[i]["chapter"] = chapters[ch_count-1];

      chapters[ch_count-1]["subchapters"].push(subchapters[i]);


      active_subchapter = subchapters[0];

    }
  }

  // read csv file containing figure information
  figures = await d3.csv('./data/figures.csv');
  for(var i=0;i<figures.length;i++){
    if (figures[i]['static']=='TRUE'){
      for(var j=0; j<subchapters.length;j++){
        if(figures[i]["case_no"].replace('.','-') == subchapters[j]["id"]){
          subchapters[j]["has_static_fig"] = true;
          subchapters[j]["static_fig_title"] = figures[i]['name']
        }
        else{
          subchapters[j]["has_static_fig"] = false;
        }
      }

    }
  }
  console.log(subchapters)
  console.log(chapters)

}

//marker options
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

//progress bar on loading page
var progress_bar = {
    progress: 0,
    get _progress() { return this.progress; },
    set _progress(value) { this.progress = value; $('.progress-bar').css({'width': this.progress + '%'}) }
  };

function Chapter(){
  this.id = 0;
  this.title = "none";
  this.subchapters = [];
}

function Subchapter(){
    this.id = 0;
    this.title = "none";
    this.summary = "none";
    this.chapter = "none";
    this.loc_view = "none";
    this.has_static_fig = false;
    this.static_fig_title = "none";
}
