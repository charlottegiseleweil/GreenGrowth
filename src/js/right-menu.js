let all_chapters = [];
let all_subchapters =[];
let chapter_dict = {};
let timer;
let only_dynamic = true;
let case_location_view = {};
let scroll_anim = false;
const scroll_margin = 8;
let blocks = [];
let active_block;
let body_scroll_pos = $('#right-menu').scrollTop();

function buildRightMenu(){

  d3.csv("./data/case_studies.csv").then(function(case_studies){
    $('#right-menu-body').append("<div id=title></div>")
    $('#title').append("<h2> Pathways to Green Growth</h2>")
    $('#title').append("<h3> Mainstreaming natural capital into policy and finance: international case studies </h3>")
    blocks.push('title')

    for(var i=0;i<case_studies.length;i++){
      if (!only_dynamic || case_studies[i]['dynamic']=='TRUE'){
        chapter = case_studies[i]["ch_no"]
        subchapter = case_studies[i]["number"].replace(".","-")
        if (!(all_chapters.includes(chapter))){
          //Division for chapter
          $('#right-menu-body').append("<div id=right-chapter-"+chapter+"></div>")
          //Chapter Title
          $('#right-chapter-'+chapter).append("<hr><h4>Chapter "+chapter+": "+case_studies[i]['ch_title']+"</h4>")
          chapter_dict[chapter] = [];
          all_chapters.push(chapter)
          blocks.push(chapter);

        }
        chapter_dict[chapter].push(subchapter);
        //Subchapter title
        $('#right-chapter-'+chapter).append("<h5 id=right-subchapter-"+subchapter+">"+subchapter+": "+case_studies[i]['name']+"</h5>")
        //Subchapter summary
        $('#right-subchapter-'+subchapter).after("<p id="+subchapter+"-summary>"+case_studies[i]['summary']+"</p>")
        all_subchapters.push(subchapter);
        blocks.push(subchapter);
        //treat specific figures or images of each case
        right_menu_figures(chapter, subchapter);
        case_location_view[subchapter] = case_studies[i]['location_view']

      }
    }
    active_block = blocks[0];
    $('#right-menu-body').after('<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>')
  });
  }

function onScroll(){
  //animate scrolling
  if (scroll_anim == false){
    $('#right-menu').css('overflow-y', 'scroll');
    //console.log(active_block)
    scroll_anim = true;
    //scrolling down
    if($('#right-menu').scrollTop()>body_scroll_pos && blocks.indexOf(active_block)!=(blocks.length-1)){
      active_block = blocks[blocks.indexOf(active_block)+1]
    }
    //scrolling up
    else if ($('#right-menu').scrollTop()<body_scroll_pos && blocks.indexOf(active_block)!=0){
      active_block = blocks[blocks.indexOf(active_block)-1]
    }
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
    for (var i=0;i<all_subchapters.length;i++){
      if (($('#right-menu-body').scrollTop()+ scroll_margin)>=($('#right-subchapter-'+all_subchapters[i]).offset().top - $('#right-menu').position().top)){
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
            if (chapter < all_subchapters[subchapter_scroll_pos]){
              subchapter = all_subchapters[subchapter_scroll_pos];
            }
            else subchapter = 0;


            for (var i=0;i<chapter_dict[chapter].length;i++){
              $('#left-subchapter-'+chapter_dict[chapter][i]).css('background-color', 'black')
            }
            //console.log(subchapter)
            if (subchapter != -1){
              $('#left-subchapter-'+subchapter).css('background-color', 'hsl(129, 67%, 64%)')
            }
            display_figure(subchapter)
          });
        }

      });
    }, 100);



}
