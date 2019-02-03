class DataLoader {

    constructor(){

        this.geojson;
        this.chapters = [];
        this.subchapters = [];
        this.active_subchapter = null;
        this.countries = [];
        this.active_country = null;
        this.browse_type = 'Chapter';
        this.progress_bar = {
            progress: 0,
            get _progress() { return this.progress; },
            set _progress(value) { this.progress = value; $('.progress-bar').css({'width': this.progress + '%'}) }
          };

    }

    //read csv files, meanwhile update progress bar and create all leaflet layers on pre-loading page
    async preloadDynamicFigures() {
        //preload 6_1-1
        lineplot_data = await d3.csv("data/line_plot.csv");

        for(var i=0;i<lineplot_data.length;i++){
            data_points_acres.push({x: parseInt(lineplot_data[i]['yr'],10) ,y:lineplot_data[i]['Total_Acres']/1000000})
            data_points_money.push({x: parseInt(lineplot_data[i]['yr'],10),y:lineplot_data[i]['Total_Money']/1000000})
        }

        this.progress_bar._progress += 20;

        //preload case_6_1-2
        choropleth_map_county = await shp("data/county/counties");
        this.progress_bar._progress += 20;
        var data = await $.getJSON('data/mitigation_bank.json');
        case_6_1_fig2_data = await d3.csv("data/acres_new.csv");

        case_6_1_choropleth_from_csv(case_6_1_fig2_data, ['2014','2015','2016'],[0, 0, 1, 5, 10],true,2);

        //preload case_6_1-3
        case_6_1_fig3_data = await d3.csv("data/acres_payments.csv");
        case_6_1_choropleth_from_csv(case_6_1_fig3_data, ['2016'],[0, 0, 20, 40, 80],false,3);
        this.progress_bar._progress += 20;


        //preload case 7_2-1
        case_7_2_fig1_layer = L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                let label = String(feature.properties.NUMPOINTS)
                return new L.circleMarker(latlng, geojsonMarkerOptions).bindTooltip(label, {permanent: true, opacity: 0.7}).openTooltip();
            }
        });


        this.progress_bar._progress += 20;
        //preload case_7_4-1
        var geojson = await shp("data/forest/forest.offset.projects.updated2017");
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



        case_9_1_fig1_data = await d3.csv("data/Water_Funds.csv");
        geojson = await shp("data/brazil/ucs_arpa_br_mma_snuc_2017_w");
        case_8_1_fig1_layer1 = L.geoJson(geojson, {style: {"color": "#00994c","opacity": 0.65}});

        data = await $.getJSON('data/brazil/amapoly_ivb.json');
        case_8_1_fig1_layer2 = L.geoJson(data, {style: {"color": "#665BCE"}});

        data = await $.getJSON('data/brazil/amazonriver_865.json');
        case_8_1_fig1_layer3 = L.geoJson(data, {style: {"weight": 5}});

        this.progress_bar._progress += 20;

        setTimeout(function(){$('.progress').trigger('loaded')}, 600);
    }

async prepareDataframes(){
    //reset values
    this.chapters = [];
    this.subchapters = [];
    // read csv file containing cases information
    var case_studies = await d3.csv("./data/case_studies.csv");
    //iterate over each case studie
    let ch_id=-1;
    let sub_ch_id = 0;
    let current_chapter = null;
    let country = null;

    var csv_countries = await d3.csv('./data/countries.csv');
    for(var i=0;i<csv_countries.length;i++){
      this.countries[csv_countries[i]["name"]] = new Country(csv_countries[i])
    }
    if (this.active_country == null)
      this.active_country = this.countries['World'];

    for(var i=0;i<case_studies.length;i++){
      if ((!only_dynamic_figs || case_studies[i]['dynamic']=='TRUE')
          &&(data_loader.active_country.name=='World' || data_loader.active_country.name ==case_studies[i]["country"])){

        //fetch and populate with the actual data
        if (ch_id != case_studies[i]["ch_no"]){
          if (current_chapter!=null)
              this.chapters[ch_id]=current_chapter;
          ch_id = case_studies[i]["ch_no"];
          current_chapter = new Chapter(case_studies[i]);
        }
        country = this.countries[case_studies[i]["country"]]
        let new_subchapter = new Subchapter(sub_ch_id,case_studies[i],current_chapter, country)
        this.subchapters[new_subchapter.id]= new_subchapter;
        current_chapter.add_subchapter(new_subchapter);
        sub_ch_id++;
      }
    }
    //if ((ch_id != case_studies[i]["ch_no"])&&(current_chapter!=null))
      //    this.chapters[ch_id]=current_chapter;
    this.active_subchapter = this.subchapters[Object.keys(this.subchapters)[0]]
    this.chapters[ch_id]=current_chapter;

    // read csv file containing figure information
    var figures = await d3.csv('./data/figures.csv');
    for(var i=0;i<figures.length;i++){
      if (figures[i]['static']=='TRUE'){
        for(var j in this.subchapters){
          if(figures[i]["case_no"].replace('.','-') == this.subchapters[j]["id"]){
            this.subchapters[j]["has_static_fig"] = true;
            this.subchapters[j]["static_fig_title"] = figures[i]['name']
          }
        }

      }
    }


    console.log(this.subchapters)
    console.log(this.chapters)
    console.log(this.countries)

  }
}

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
var data_points_acres= [];
var data_points_money=[];

//marker options
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
