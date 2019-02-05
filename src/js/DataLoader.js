class DataLoader {

    constructor(){

        this.geojson;
        this.groups = [];
        this.cases = [];
        this.mechanism_chapters = ['6'];
        this.mechanism_types = {'Government Subsidies':['6'],'Regulatory-driven Mitigation':['7'],'Voluntary Conservation':['8'],'Water Funds':['9'],'Eco-Certification':['10'],'Impact Investing':['10']};        
        this.active_case = null;
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
    //reset data
    this.groups = [];
    this.cases = [];
    //read csv file containing countries information
    var csv_countries = await d3.csv('./data/countries.csv');
    for(var i=0;i<csv_countries.length;i++){
      this.countries[csv_countries[i]["name"]] = new Country(csv_countries[i])
      //if browsing by country, create groups dataframe here
      if (this.browse_type=='Country'&&csv_countries[i]["name"]!='World'){
        this.groups[csv_countries[i]["country_code"]] = new Group(csv_countries[i]["country_code"],csv_countries[i]["name"])
      }
    }
    if (this.active_country == null)
      this.active_country = this.countries['World'];

    //add intro group
    var other_elems = await d3.csv("./data/other_elements.csv");
    let intro_group = new Group(other_elems[0]["ch_no"],other_elems[0]["ch_title"]);
    this.groups[intro_group.id]= intro_group;
    let intro_case = new Case(0,other_elems[0],intro_group, this.countries['World'])
    this.groups[intro_group.id].add_case(intro_case);
    this.cases[intro_case.id]= intro_case;

    let group_id=1;
    let case_id = 1;
    let current_group = null;
    let current_country = null;
    let country = null;
    // read csv file containing cases information
    var case_studies = await d3.csv("./data/case_studies.csv");

    if(data_loader.browse_type=='Chapter'){

        //iterate over each case study
        for(var i=0;i<case_studies.length;i++){
          if ((!only_dynamic_figs || case_studies[i]['dynamic']=='TRUE')){

            //fetch and populate with the actual data
            if (group_id != case_studies[i]["ch_no"]){
              if (current_group!=null)
                  this.groups[group_id]=current_group;
              group_id = case_studies[i]["ch_no"];
              current_group = new Group(case_studies[i]["ch_no"],case_studies[i]["ch_title"]);
            }
            current_country=  this.countries[case_studies[i]["country"]];
            let new_case = new Case(case_id,case_studies[i],current_group, current_country)
            current_group.add_case(new_case);
            this.cases[new_case.id]= new_case;
            case_id++;
          }
        }
        this.groups[group_id]=current_group;
        this.active_case = this.cases[Object.keys(this.cases)[0]]
    }

    else if(data_loader.browse_type=='Country'){

        //iterate over each case study
        for(var k=0;k<Object.keys(this.countries).length;k++){
          console.log(this.countries[Object.keys(this.countries)[k]].name)
          for(var i=0;i<case_studies.length;i++){
            if ((!only_dynamic_figs || case_studies[i]['dynamic']=='TRUE')
                &&(case_studies[i]["country"]==this.countries[Object.keys(this.countries)[k]].name)){
              current_group = this.groups[this.countries[case_studies[i]["country"]].country_code]
              current_country=  this.countries[case_studies[i]["country"]];
              let new_case = new Case(case_id,case_studies[i],current_group, current_country)
              current_group.add_case(new_case);
              case_id++;
              this.cases[new_case.id]= new_case;

            }
          }
        }
        this.active_case = this.cases[Object.keys(this.cases)[0]]
    }

    else if(data_loader.browse_type=='Mechanism'){
        //iterate over each case study
        for(var i=0;i<case_studies.length;i++){
            if (data_loader.mechanism_chapters.includes(case_studies[i]["ch_no"])){
  
              //fetch and populate with the actual data
              if (group_id != case_studies[i]["ch_no"]){
                if (current_group!=null)
                    this.groups[group_id]=current_group;
                group_id = case_studies[i]["ch_no"];
                current_group = new Group(case_studies[i]["ch_no"],case_studies[i]["ch_title"]);
              }
              current_country=  this.countries[case_studies[i]["country"]];
              let new_case = new Case(case_id,case_studies[i],current_group, current_country)
              current_group.add_case(new_case);
              this.cases[new_case.id]= new_case;
              case_id++;
            }
          }
          this.groups[group_id]=current_group;
          this.active_case = this.cases[Object.keys(this.cases)[0]]
    }

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
    //console.log(this.cases)
    //console.log(this.groups)
    //console.log(this.countries)

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
