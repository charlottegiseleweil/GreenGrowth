function buildLeftMenu(){
  //add left-menu title
  $('#left-menu').append('<p class="left-menu-name">CHAPTERS</p>');

  //add chapter number to (main) left-menu
  let all_chapters_temp =[];
  console.log(Object.keys(subchapters_in_chapter).length)
  for(var i=0;i<Object.keys(subchapters_in_chapter).length;i++){
    console.log('est')
    chap_temp = subchapters_in_chapter[i]
    console.log(chap_temp)
    $('#left-menu').append("<span id=left-chapter-"+chap_temp+" class='left-chapter' onclick=subchapterClick("+chap_temp+",0);>" +chap_temp+ "</span>");
  }

  //add submenus for each chapter and corresponding subchapters
  /*
  let subchaps = subchapters_in_chapter[chapter];
  $('#left-chapter-'+chapter).after("<div id=left-menu-sub"+chapter+" style= top:"+$('#left-chapter-'+chapter).position().top+"px;'></div>")
  for (var i=0;i<subchapters_in_chapter[chapter].length;i++){
    $('#left-menu-sub').append("<span id=left-subchapter-"+subchaps[i]+" class='left-subchapter' onclick=subchapterClick("+subchaps[i].toString().split('-')[0]+','+subchaps[i].toString().split('-')[1]+");>" +subchaps[i].toString().split('-')[1]+ "</span>");
  }
  */



  //add key-press event listener (should be moved elsewhere)
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
  $(".right-subchapter").hide()
  $("#right-subchapter-"+active_subchapter).slideDown( "slow",  function() {
    // Animation complete.
  });

  //set the color on clicked chapter button (and not others)
  $('.left-chapter').css('background-color', 'black')
  $('#left-chapter-'+chapter).css('background-color', 'hsl(129, 67%, 64%)')

  $('.left-subchapter').css('background-color', 'black')
  $('#left-subchapter-'+active_subchapter).css('background-color', 'hsl(129, 67%, 64%)')

  display_figure(active_subchapter)
  console.log(active_subchapter)
}
