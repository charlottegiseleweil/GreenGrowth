





//used in right-menu.js
let chapters = [];
let subchapters = [];
let active_subchapter_id;


//used as data changers
let only_dynamic_figs = false;

function readFiles(){

  // read csv file containing cases information
  d3.csv("./data/case_studies.csv").then(function(case_studies){
    //iterate over each case studie
    let ch_count = 0;
    for(var i=0;i<case_studies.length;i++){
      if (!only_dynamic || case_studies[i]['dynamic']=='TRUE'){
        subchapter_id = case_studies[i]["number"].replace(".","-")
        chapter_id = case_studies[i]["ch_no"]
        if (!(chapter in chapters)){
          chapters.push({});
          chapters[ch_count]["id"]=chapter_id;
          chapters[ch_count]["title"]=case_studies[i]["ch_title"];
          chapters[ch_count]["subchapters"] = [];
          subchapters_in_chapter[chapter] = [];
        }
        subchapters.push({});
        subchapters[i]["id"] = subchapter_id;
        subchapters[i]["title"] = case_studies[i]["name"];
        subchapters[i]["summary"] = case_studies[i]['summary'];
        subchapter[i]["loc_view"] = case_studies[i]['loc_view'];

        subchapter[i]["chapter"] = chapters[ch_count];
        chapters[ch_count]["subchapters"].push(subchapters[i]);


        active_subchapter = subchapters[0];

      }
    }
  });
}


  // read csv file containing figure information
  d3.csv('./data/figures.csv').then(function(figures){
    for(var i=0;i<figures.length;i++){
      if (figures[i]['static']=='TRUE'){
        for(var j=0; j<subchapters.length;j++){
          if(figures[i]["case_no"].replace('.','-') == subchapters[j]["id"]){
            subchapter[j]["has_static_fig"] = true;
            subchapter[j]["static_fig_title"] = figures[i]['name']
          }
          else{
            subchapter[j]["has_static_fig"] = false;
          }
        }

      }
    }
  });




}
