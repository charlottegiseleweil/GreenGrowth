class DataLoader {

    constructor(){

        this.geojson;
        this.chapters = [];
        this.cases = [];
        this.active_case = null;
        this.countries = [];
        this.mechanisms = {};
        this.active_country = null;
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

        case_6_1_choropleth_from_csv(case_6_1_fig2_data, ['2016'],[0, 0, 1, 5, 10],true,2);

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
    //reset data
    this.chapters = [];
    this.cases = [];
    //read csv file containing countries information
    var csv_countries = await d3.csv('./data/countries.csv');
    for(var i=0;i<csv_countries.length;i++){
      this.countries[csv_countries[i]["name"]] = new Country(csv_countries[i])
    }
    if (this.active_country == null)
      this.active_country = this.countries['World'];

    //read csv file containing mechanism information
    var csv_mechanisms = await d3.csv('./data/mechanisms.csv');
    for(var i=0;i<csv_mechanisms.length;i++){
      let new_mechanism = new Mechanism(csv_mechanisms[i]["name"], csv_mechanisms[i]["code"]);
      this.mechanisms[new_mechanism.name] = new_mechanism;
    }
    console.log("mechanisms",this.mechanisms);
    
    //add intro chapter
    if(this.active_country.name=='World'){
      var other_elems = await d3.csv("./data/other_elements.csv");
      let intro_chapter = new Chapter(other_elems[0]["ch_no"],other_elems[0]["ch_title"]);
      this.chapters[intro_chapter.id]= intro_chapter;
      let intro_case = new Case(0,other_elems[0],intro_chapter, this.countries['World'])
      this.chapters[intro_chapter.id].add_case(intro_case);
      this.cases[intro_case.id]= intro_case;
    }

    let chapter_id=1;
    let case_id = 1;
    let previous_chapter = null;
    let current_chapter = null;
    let current_country = null;
    let current_mechanism = null;
    let country = null;
    // read csv file containing cases information
    var case_studies = await d3.csv("./data/case_studies.csv");


    console.log(data_loader.active_country)
    console.log(case_studies[i]['country'])
    //iterate over each case study
    for(var i=0;i<case_studies.length;i++){
      if ((!only_dynamic_figs || case_studies[i]['dynamic']=='TRUE')
      &&(this.active_country.name=='World'||this.active_country.name==case_studies[i]['country'])){

        //fetch and populate with the actual data
        if (chapter_id != case_studies[i]["ch_no"]){
          if (current_chapter!=null)
              this.chapters[chapter_id]=current_chapter;
          chapter_id = case_studies[i]["ch_no"];
          current_chapter = new Chapter(case_studies[i]["ch_no"],case_studies[i]["ch_title"]);
        }
        current_country=  this.countries[case_studies[i]["country"]];
        current_mechanism=  this.mechanisms[case_studies[i]["mechanism"]];
        let new_case = new Case(case_id,case_studies[i],current_chapter, current_country, current_mechanism);
        if (current_mechanism){
            this.mechanisms[current_mechanism.name].add_case(new_case);
        }
        current_chapter.add_case(new_case);
        this.cases[new_case.id]= new_case;
        case_id++;
      }
    }

    console.log("Mechanism",this.mechanisms);
    this.chapters[chapter_id]=current_chapter;
    this.active_case = this.cases[Object.keys(this.cases)[0]]


    // read csv file containing figure information
    var figures = await d3.csv('./data/figures.csv');
    for(var i=0;i<figures.length;i++){
      if (figures[i]['static']=='TRUE'){
        for(var j in this.cases){
          if(figures[i]["case_no"].replace('.','-') == this.cases[j]["id"]){
            this.cases[j]["has_static_fig"] = true;
            this.cases[j]["static_fig_title"] = figures[i]['name']
          }
        }

      }
    }

  }
}

//used as data selecter
let only_dynamic_figs = false;

//used in figures (must clean)
var choropleth_fips={}
var choropleth_map_objs = {}
var waterfund_objs={}
var waterfund_markers={}
//var case_6_1_button_active;
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

