const active_button_color = "hsl(129, 67%, 64%)";

function buildLeftMenu(){
  //add left-menu title
  $('#left-menu').append('<p class="left-menu-name">CHAPTERS</p>');

  //add chapter number to (main) left-menu
  for(var i=0;i<chapters.length;i++){
    //add a chapter button, note that here onClick calls subchapterClick on the first subchapter
    //console.log(subchapters[0])
    $('#left-menu').append("<span id=left-chapter-"+chapters[i]["id"]+" class='left-chapter' onclick=subchapterClick("+subchapters.indexOf(chapters[i]["subchapters"][0])+");>" +chapters[i]["id"]+ "</span>");


    //add submenu for the chapter
    $('#left-chapter-'+chapters[i]["id"]).after("<div id=left-menu-sub-"+chapters[i]["id"]+" class='left-menu-sub' style= top:"+$('#left-chapter-'+chapters[i]["id"]).position().top+"px;'></div>")
    //add subchapter buttons in submenu
    for (var j=0;j<chapters[i]["subchapters"].length;j++){
      $("#left-menu-sub-"+chapters[i]["id"]).append("<span id=left-subchapter-"+chapters[i]["subchapters"][j]["id"]+" class='left-subchapter' onclick=subchapterClick("+subchapters.indexOf(chapters[i]["subchapters"][j])+");>" +chapters[i]["subchapters"][j]["id"].split('-')[1]+ "</span>");
    }
    $(".left-menu-sub").hide()
  }



  //add key-press event listener (should be moved elsewhere)
  document.addEventListener("keydown", function(event) {
    console.log(event.which)
    //clicked right-arrow or down-arrow, and ignore edge case (last subchapter)
    if ((event.which == '39' || event.which == '40')&&(subchapters.indexOf(active_subchapter)<(subchapters.length-1))){
      subchapterClick(subchapters.indexOf(active_subchapter)+1);
    }
    //clicked left-arrow or up-arrow, and ignore edge case (first subchapter)
    else if((event.which == '37' || event.which == '38')&&(subchapters.indexOf(active_subchapter)>0)){
      subchapterClick(subchapters.indexOf(active_subchapter)-1);
    }
  });

}




function subchapterClick(indexOfsubchapter){

  active_subchapter = subchapters[indexOfsubchapter];

  //[right-menu] hide all subchapters (text) except active one
  $(".right-subchapter").hide()
  $("#right-subchapter-"+active_subchapter["id"]).slideDown( "slow",  function() {
    // Animation complete.
  });

  //[left-menu] set the color on clicked chapter button (and not others)
  $('.left-chapter').css('background-color', 'black')
  $('#left-chapter-'+active_subchapter["chapter"]["id"]).css('background-color', 'hsl(129, 67%, 64%)')

  //[left-menu] display submenu of active chapter (and not others)
  $(".left-menu-sub").hide()
  $("#left-menu-sub-"+active_subchapter["chapter"]["id"]).show()

  //[left-menu] set the color on clicked chapter button (and not others)
  $('.left-subchapter').css('background-color', 'black')
  $('#left-subchapter-'+active_subchapter["id"]).css('background-color', 'hsl(129, 67%, 64%)')

  display_figure(active_subchapter)

}
