const active_button_color = "hsl(129, 67%, 64%)";

function buildLeftMenu(){
  //add left-menu title
  chapters = data_loader.chapters;
  subchapters = data_loader.subchapters;  
  //add chapter number to (main) left-menu
  for (var i in chapters){
    current_chapter = chapters[i];
    //add a chapter button, note that here onClick calls subchapterClick on the first subchapter
    $('#left-menu').append("<span id=left-chapter-"+current_chapter.id+" class='left-chapter' title='"+current_chapter.title+"' onclick=subchapterClick("+i+","+0+");>" +current_chapter.id+ "</span>");
    
    $("#left-menu #left-chapter-"+current_chapter.id).tooltip(
      {
        position: { my: "left center", at: "right+10 center" }
      }
    );
    
    //add submenu for the chapter
    $('#left-chapter-'+current_chapter.id).after("<div id=left-menu-sub-"+current_chapter.id+" class='left-menu-sub' style= top:"+$('#left-chapter-'+current_chapter.id).position().top+"px;'></div>")
    //add subchapter buttons in submenu
    for (var j=0;j<current_chapter.subchapters.length;j++){
      $("#left-menu-sub-"+current_chapter.id).append("<span id=left-subchapter-"+current_chapter.subchapters[j].id+" class='left-subchapter' title='"+current_chapter.subchapters[j].title+"'onclick=subchapterClick("+i+","+j+");>" +current_chapter.subchapters[j].id.split('-')[1]+ "</span>");
      
      $("#left-menu-sub-"+current_chapter.id+" #left-chapter-"+current_chapter.subchapters[j].id).tooltip(
        {
          position: { my: "left center", at: "right+10 center" }
        }
      );
    }
    $(".left-menu-sub").hide()
  }

  $('#left-menu').append('<p class="left-menu-name">CHAPTERS</p>');


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




function subchapterClick(chapter_id,subchapter_id){
  subchapter_id = data_loader.chapters[chapter_id].subchapters[subchapter_id].id;

  //[right-menu] hide all subchapters (text) except active one
  $(".right-subchapter").hide()
  $("#right-subchapter-"+subchapter_id).slideDown( "slow",  function() {
    // Animation complete.
    console.log("Animation complete");
  });

  //[left-menu] set the color on clicked chapter button (and not others)
  $('.left-chapter').css('background-color', 'black')
  $('#left-chapter-'+chapter_id).css('background-color', 'hsl(129, 67%, 64%)')

  //[left-menu] display submenu of active chapter (and not others)
  $(".left-menu-sub").hide()
  $("#left-menu-sub-"+chapter_id).show()

  //[left-menu] set the color on clicked chapter button (and not others)
  $('.left-subchapter').css('background-color', 'black')
  $('#left-subchapter-'+subchapter_id).css('background-color', 'hsl(129, 67%, 64%)')

  display_figure(data_loader.subchapters[subchapter_id])

}
