function buildLeftMenu(){
  let all_chapters_temp =[];
  d3.csv("./data/case_studies.csv").then(function(case_studies){
    //adding chapter values
    for(var i=0;i<case_studies.length;i++){
      if (!only_dynamic || case_studies[i]['dynamic']=='TRUE'){
        if (!(all_chapters_temp.includes(case_studies[i]["ch_no"]))){
          $('#left-menu').append("<span id=left-chapter-"+case_studies[i]["ch_no"]+" class='left-chapter' onclick=subchapterClick("+case_studies[i]["ch_no"]+",0);>" +case_studies[i]['ch_no']+ "</span>");
          all_chapters_temp.push(case_studies[i]["ch_no"])
        }
      }
    }
    $('#left-menu').append('<p class="left-menu-name">CHAPTERS</p>');

  });

  document.addEventListener("keydown", function(event) {
    //clicked right-arrow or down-arrow
    if (event.which == '39' || event.which == '40'){
      console.log(active_subchapter)
      active_subchapter = subchapters[subchapters.indexOf(active_subchapter)+1];
      console.log(active_subchapter)
      subchapterClick(active_subchapter.split('-')[0], active_subchapter.split('-')[1]);
    }
    //clicked left-arrow or up-arrow
    else if(event.which == '37' || event.which == '38' ){
      active_subchapter = subchapters[subchapters.indexOf(active_subchapter)-1];
      subchapterClick(active_subchapter.split('-')[0], active_subchapter.split('-')[1]);
    }
  });

}


function subchapterClick(chapter, subno){

  //if a chapter was clicked
  if (subno =='0'){
    //use first subchapter
    active_subchapter= subchapters_in_chapter[chapter][0];
  }
  //if a subchapter was clicked
  else{
    active_subchapter = chapter+'-'+subno;
  }
  $(".subchapter").hide()
  $("#right-subchapter-"+active_subchapter).slideDown( "slow",  function() {
    // Animation complete.
  });

  //set the color on clicked chapter button (and not others)
  $('.left-chapter').css('background-color', 'black')
  $('#left-chapter-'+chapter).css('background-color', 'hsl(129, 67%, 64%)')

  let subchaps = subchapters_in_chapter[chapter];
  let width = subchaps.length*3.5 + 2
  $('#left-chapter-'+chapter).after("<div id=left-menu-sub style='top:"+$('#left-chapter-'+chapter).position().top+"px; width:4vh; left:4vh;'></div>")
  for (var i=0;i<subchapters_in_chapter[chapter].length;i++){
    $('#left-menu-sub').append("<span id=left-subchapter-"+subchaps[i]+" class='left-subchapter' onclick=subchapterClick("+subchaps[i].toString().split('-')[0]+','+subchaps[i].toString().split('-')[1]+");>" +subchaps[i].toString().split('-')[1]+ "</span>");
  }



  $('.left-subchapter').css('background-color', 'black')
  $('#left-subchapter-'+active_subchapter).css('background-color', 'hsl(129, 67%, 64%)')

  display_figure(active_subchapter)
  console.log(active_subchapter)
}
