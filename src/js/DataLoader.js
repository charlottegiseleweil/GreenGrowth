class DataLoader {

    constructor(){

        this.geojson;
        this.chapters = [];
        this.selected_chapter_ids = []
        this.cases = {};
        this.active_case = null;
        this.selected_case_ids = [];
        this.countries = [];
        this.mechanisms = {};
        this.active_country = null;
        this.browsing_all_cases = true;
        this.progress_bar = {
            progress: 0,
            get _progress() { return this.progress; },
            set _progress(value) { this.progress = value; $('.progress-bar').css({'width': this.progress + '%'}) }
          };

    }

    //read csv files, meanwhile update progress bar and create all leaflet layers on pre-loading page
    async preloadDynamicFigures() {
        //preload 6_1-1
        await data_loader.cases['6-1'].create_data();
        this.progress_bar._progress += 10;
        await data_loader.cases['6-2'].create_data();
        this.progress_bar._progress += 10;
        await data_loader.cases['7-1'].create_data();
        this.progress_bar._progress += 10;
        await data_loader.cases['7-2'].create_data();
        this.progress_bar._progress += 10;
        await data_loader.cases['7-3'].create_data();
        this.progress_bar._progress += 10;
        await data_loader.cases['7-4'].create_data();
        this.progress_bar._progress += 10;
        await data_loader.cases['9-1'].create_data();
        this.progress_bar._progress += 10;
        await data_loader.cases['8-1'].create_data();
        await data_loader.cases['8-2'].create_data();
        await data_loader.cases['9-2'].create_data();
        this.progress_bar._progress += 10;
        await data_loader.cases['10-3'].create_data();
        await data_loader.cases['11-2'].create_data();
        this.progress_bar._progress += 10;
        await data_loader.cases['13-1'].create_data();
        this.progress_bar._progress += 10;

        setTimeout(function(){$('.progress').trigger('loaded')}, 600);
        $('#country-display-panel-reg').hide()
        return "-dynamic";

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

    let case_id = 0;

    //add intro chapter
    if(this.active_country.name=='World'){
      var other_elems = await d3.csv("./data/other_elements.csv");
      let intro_chapter = new Chapter(other_elems[0]["ch_no"],other_elems[0]["ch_title"]);
      this.chapters[intro_chapter.id]= intro_chapter;
      let intro_case = new Case(case_id,other_elems[0],intro_chapter, this.countries['World'])
      this.chapters[intro_chapter.id].add_case(intro_case);
      this.cases[intro_case.id]= intro_case;
      this.cases[intro_case.id]['titleSecond'] = other_elems[0]["nameSecond"]
      this.cases[intro_case.id]['summarySecond'] = other_elems[0]["summarySecond"]
      case_id++;
    }
    let chapter_id=null;
    let previous_chapter = null;
    let current_chapter = null;
    let current_country = null;
    let current_mechanism = null;
    let country = null;
    // read csv file containing cases information
    var case_studies = await d3.csv("./data/case_studies.csv");

    //iterate over each case study
    for(var i=0;i<case_studies.length;i++){
      if ((!only_dynamic_figs || case_studies[i]['dynamic']=='TRUE')){

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

    //console.log("Mechanism",this.mechanisms);
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
    //console.log("return prep",this.cases);
    //construct_cases();
    return "prep";
  }

  async  selectCases(){
    this.selected_case_ids = [];
    this.selected_chapter_ids = [];
    for (var i in this.cases){
    //  console.log(this.active_country.name)
    //console.log('test111')
    //console.log(this.cases[i]['country'])
       if(this.active_country.name=='World'||this.active_country.name==this.cases[i].country.name){
         this.selected_case_ids.push(this.cases[i].id)
         if(!this.selected_chapter_ids.includes(this.cases[i].chapter.id)){
           this.selected_chapter_ids.push(this.cases[i].chapter.id)
         }
       }
    }
    //console.log(this.active_case)
    this.active_case = this.cases[this.selected_case_ids[0]]
  }

}



//used as data selecter
let only_dynamic_figs = false;
var data_loaded=false;
//used in figures (must clean)
var choropleth_fips={}
var choropleth_map_objs = {}
var waterfund_objs={}
var waterfund_markers={}
//var case_6_1_button_active;
var lineplot_data;
var case_6_1_fig3_data;
var case_6_1_fig2_data;
var case_7_1_fig1_layer = [];
var case_7_1_fig1_layer_group = {};
var case_7_2_fig1_clusters;
var case_7_2_fig1_legend;
var case_7_3_fig1_clusters;
var case_7_3_fig1_legend;
var case_7_4_fig1_clusters;
var case_7_4_fig1_legend;
var case_9_1_fig1_data;
var choropleth_map_county;
var progress_bar = 0;
var case_8_1_fig1_layer1;
var case_8_1_fig1_layer2;
var case_8_1_fig1_layer3;
var case_8_2_fig1_data;
var case_8_2_fig1_data_percent = [];
var case_11_2_fig1_layer;
var case_11_2_fig1_legend;
var choropleth_map_objs_8_2;
var data_points_acres= [];
var data_points_money=[];
var test = null;

//marker options
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
