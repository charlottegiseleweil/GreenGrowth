

function buildLeftMenu(){
  let all_chapters_temp =[];
  d3.csv("./data/case_studies.csv").then(function(case_studies){
    //adding chapter values
    for(var i=0;i<case_studies.length;i++){
      if (!only_dynamic || case_studies[i]['dynamic']=='TRUE'){
        if (!(all_chapters_temp.includes(case_studies[i]["ch_no"]))){
          $('#left-menu').append("<span id=left-chapter-"+case_studies[i]["ch_no"]+" class='dot' onclick=chapterClick("+case_studies[i]["ch_no"]+");>" +case_studies[i]['ch_no']+ "</span>");
          all_chapters_temp.push(case_studies[i]["ch_no"])
        }
      }
    }
    $('#left-menu').append('<p class="left-menu-name">CHAPTERS</p>');

  });
}

function chapterClick(chapter){
  //scroll to location in right-menu (as 0.5sec animation)
  scroll_anim = true;
  active_block = chapter+'';
  $('#right-menu').stop().animate({scrollTop:$('#right-menu').scrollTop() + $('#right-chapter-'+chapter).offset().top - $('#right-menu').position().top}, 500, 'swing');
  timer_scroll = setTimeout(function() {
    $('#right-menu').css('overflow', 'auto');
    scroll_anim = false;
  }, 600);
}

function subchapterClick(chapter, subno){
  //scroll to location in right-menu (as 0.5sec animation)
  scroll_anim = true;
  active_block = chapter+'-'+subno;

  $('#right-menu').stop().animate({scrollTop:$('#right-menu').scrollTop() -scroll_margin  + $('#right-subchapter-'+chapter+'-'+subno).offset().top - $('#right-menu').position().top +1}, 500, 'swing');
  timer_scroll = setTimeout(function() {
      $('#right-menu').css('overflow', 'auto');
      scroll_anim = false;
  }, 600);

}
