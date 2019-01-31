let all_chapters = [];
let subchapters =[];
let timer;
let only_dynamic = false;
let case_location_view = {};
let scroll_anim = false;
const scroll_margin = 8;
let active_subchapter;
let body_scroll_pos = $('#right-menu').scrollTop();
figures = {}
var case_with_figure = []
var case_no_fig_title= {};
var subchapters_in_chapter = {};

// list of subchapters
let figure_list = ['2-1', '2-3', '6-2', '6-3', '7-4', '8-1', '9-2', '10-3', '10-5', '11-1', '13-1', '14-2', '15-2', '15-3', '16-1', '16-2', '17-1', '17-2'];

//build scrollable right menu containing descriptions of each chapter
function buildRightMenu(){

  // read csv file containing figure information
  d3.csv('./data/figures.csv').then(function(figures){
    for(var i=0;i<figures.length;i++){

      if (figures[i]['static']=='TRUE'){
        case_with_figure.push(figures[i]['case_no'].toString().replace('.','-'))// add case no
        case_no_fig_title[figures[i]['case_no'].toString().replace('.','-')] = figures[i]['name'] // add name of figure to dictionary(key figures case no)
      }
    }
  });
  //read case studies csv file containing details of each case study
  d3.csv("./data/case_studies.csv").then(function(case_studies){
    //iterate over case studies to add to right menu
    for(var i=0;i<case_studies.length;i++){
      if (!only_dynamic || case_studies[i]['dynamic']=='TRUE'){
        subchapter = case_studies[i]["number"].replace(".","-")
        chapter = case_studies[i]["ch_no"]
        console.log(chapter)
        if (!(chapter in subchapters_in_chapter)){
            subchapters_in_chapter[chapter] = [];
        }
        subchapters_in_chapter[chapter].push(subchapter);

        //Subchapter
        $('#right-menu-body').append("<p id=right-subchapter-"+subchapter+" class=subchapter></p>")
        //Subchapter title
        $("#right-subchapter-"+subchapter).append("<h5 id="+subchapter+"-title class=text-body>"+subchapter+": "+case_studies[i]['name']+"</h5>")
        $("#right-subchapter-"+subchapter).hide()
        //Subchapter summary
        if (figure_list.includes(subchapter)){
          $('#right-subchapter-'+subchapter).append("<p id="+subchapter+"-summary>" +'<img class="subchapter-img" src="./static/figure_and_images/'+ subchapter + '.jpg" alt="subchapter-image">'+case_studies[i]['summary']+'</p>');
        } else {
          $('#right-subchapter-'+subchapter).append("<p id="+subchapter+"-summary>"+case_studies[i]['summary']+ "class=text-body"+"</p>")
        }
        //console.log(right-subchapter-'+subchapter)

        subchapters.push(subchapter);
        //treat specific figures or images of each case
        right_menu_figures(subchapter);
        case_location_view[subchapter] = case_studies[i]['location_view']


        //

      }
    }
    console.log(subchapters)
    active_subchapter = subchapters[0];
    $("#right-subchapter-"+active_subchapter).show();
    /*
    $('#right-menu-body').append('<div style="padding:1%; text-align:justify;"><p><h3>Credits</h3>The case studies survey a range of policy and finance mechanisms that channel economic resources and other benefits towards securing and enhancing natural capital. These mechanisms typically also aim to increase equity and well-being, both through poverty alleviation and in access to ecosystem goods and services. Illustrative examples have been contributed by a range of experts who come from the natural and social sciences, government, private companies, financial institutions, and civil society organizations. These case studies were compiled by Lisa Mandle, James Salzman and Gretchen C. Daily and illustrated by Charlotte Weil. This application is developed by <b>Can Yilmaz Altinigne</b>, <b>Cyril van Schreven</b> and <b>Günes Yurdakul</b>.</p></div>')
    $('#right-menu-body').append('<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>')
    */
  });
  }

/*
function onScroll(){
  //animate scrolling
  if (scroll_anim == false){
    $('#right-menu').css('overflow-y', 'scroll');

    scroll_anim = true;
    //scrolling down
    if($('#right-menu').scrollTop()>body_scroll_pos && blocks.indexOf(active_block)!=(blocks.length-1)){
      active_block = blocks[blocks.indexOf(active_block)+1]
    }
    //scrolling up
    else if ($('#right-menu').scrollTop()<body_scroll_pos && blocks.indexOf(active_block)!=0){
      active_block = blocks[blocks.indexOf(active_block)-1]
    }
    //if title active, then stop scrolling for 0.5 sev
    if (active_block == 'title'){
      $('#right-menu').stop().animate({scrollTop:0}, 500, 'swing');
    }
    else if (active_block.split('-').length == 1){
      chapterClick(active_block)
    }
    else if (active_block.split('-').length == 2){
      subchapterClick(active_block.split('-')[0], active_block.split('-')[1])
    }
    timer_scroll = setTimeout(function() {
      $('#right-menu').css('overflow-y', 'auto');
      scroll_anim = false;
    }, 600);
  }
  body_scroll_pos = $('#right-menu').scrollTop();

  var chapter_pos_promise = new Promise(function(resolve, reject) {
    let chapter_scroll_pos = -1;
    for (var i=0;i<all_chapters.length;i++){
      if (($('#right-menu-body').scrollTop())>=($('#right-chapter-'+all_chapters[i]).offset().top - 1.5*$('#right-menu').position().top)){
        chapter_scroll_pos = i;
      }
      else break
    }
    resolve(chapter_scroll_pos);
  });

  var subchapter_pos_promise = new Promise(function(resolve, reject) {
    let subchapter_scroll_pos = -1;
    for (var i=0;i<subchapters.length;i++){
      if (($('#right-menu-body').scrollTop())>=($('#right-subchapter-'+subchapters[i]).offset().top -scroll_margin - $('#right-menu').position().top)){
        subchapter_scroll_pos = i;
      }
      else break
    }
    resolve(subchapter_scroll_pos);
  });

  //find at which chapter right menu is
  chapter_pos_promise.then(function(chapter_scroll_pos){
    chapter = all_chapters[chapter_scroll_pos]
    //set the color on clicked chapter button (and not others)
    for (var i=0;i<all_chapters.length;i++){
      $('#left-chapter-'+all_chapters[i]).css('background-color', 'black')
    }
    if (!(chapter_scroll_pos == -1)) $('#left-chapter-'+chapter).css('background-color', 'hsl(129, 67%, 64%)')
    })

    //starts if scrolling has stopped
    if(timer !== null) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {

      //to display left sub-menu
      chapter_pos_promise.then(function(chapter_scroll_pos){
        $('#left-menu-sub').remove();
        //$('#left-menu-sub').hide('slow', function(){ $('#left-menu-sub').remove();})
        if (chapter_scroll_pos == -1) display_figure('0')
        else{
          chapter = all_chapters[chapter_scroll_pos]
          let width = chapter_dict[chapter].length*3.5 + 2
          $('#left-chapter-'+chapter).after("<div id=left-menu-sub style='top:"+$('#left-chapter-'+chapter).position().top+"px; width:4vh; left:4vh;'></div>")
          for (var i=0;i<chapter_dict[chapter].length;i++){
            $('#left-menu-sub').append("<span id=left-subchapter-"+chapter_dict[chapter][i]+" class='dot-sub' onclick=subchapterClick("+chapter_dict[chapter][i].toString().split('-')[0]+','+chapter_dict[chapter][i].toString().split('-')[1]+");>" +chapter_dict[chapter][i].toString().split('-')[1]+ "</span>");
          }

          //find at which subchapter right menu is

          subchapter_pos_promise.then(function(subchapter_scroll_pos){
            if (chapter < subchapters[subchapter_scroll_pos]){
              subchapter = subchapters[subchapter_scroll_pos];
            }
            else subchapter = 0;

            for (var i=0;i<chapter_dict[chapter].length;i++){
              $('#left-subchapter-'+chapter_dict[chapter][i]).css('background-color', 'black')
            }

            if (subchapter != -1){
              $('#left-subchapter-'+subchapter).css('background-color', 'hsl(129, 67%, 64%)')
            }
            display_figure(subchapter)
          });
        }

      });
    }, 100);
}
*/
