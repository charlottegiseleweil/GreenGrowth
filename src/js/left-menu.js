const active_button_color = "hsl(129, 67%, 64%)";

function buildLeftMenu(){
  //clear left menu, in case it's being overwritten
  $('#left-menu').html("");
  //add left-menu title
  chapters = data_loader.chapters;
  subchapters = data_loader.subchapters;
  //add chapter number to (main) left-menu
  $('#left-menu').append("<span id=left-chapter-home class='left-chapter-helper' title='Refresh' onclick=home_menu();><i class='fas fa-globe-africa'></i></span>");
  $('#left-menu').append("<span id=left-chapter-question class='left-chapter-helper' title='Tutorial' onclick=tutorial();><i class='fas fa-question'></i></span>");
  $('#left-menu').append("<span id=left-chapter-question class='left-chapter-helper' title='About Us' onclick=openNav();><i class='fas fa-address-card'></i></span><hr>");

  add_tooltip("#left-menu #left-chapter-home");
  add_tooltip("#left-menu #left-chapter-question");
  add_tooltip("#left-menu #left-chapter-home");

  //$('#left-menu').append("<span id=left-chapter-0 class='left-chapter' title='Overview' onclick=subchapterClick("+0+","+1+");>" +0+ "</span>");

  for (var i in chapters){
    current_chapter = chapters[i];
    //add a chapter button, note that here onClick calls subchapterClick on the first subchapter
    $('#left-menu').append("<span id=left-chapter-"+current_chapter.id+" class='left-chapter' title='"+current_chapter.title+"' onclick=subchapterClick("+i+","+0+");>" +current_chapter.id+ "</span>");

    add_tooltip("#left-menu #left-chapter-"+current_chapter.id);

    if(current_chapter.id!=0){ //special case for arrival page
      //add submenu for the chapter
      $('#left-chapter-'+current_chapter.id).after("<div id=left-menu-sub-"+current_chapter.id+" class='left-menu-sub' style= top:"+$('#left-chapter-'+current_chapter.id).position().top+"px;'></div>")
      //add subchapter buttons in submenu
      for (var j=0;j<current_chapter.subchapters.length;j++){
        $("#left-menu-sub-"+current_chapter.id).append("<span id=left-subchapter-"+current_chapter.subchapters[j].id+" class='left-subchapter' title='"+current_chapter.subchapters[j].title+"'onclick=subchapterClick("+i+","+current_chapter.subchapters[j].id.split('-')[1]+");>" +current_chapter.subchapters[j].id.split('-')[1]+ "</span>");
        add_tooltip("#left-menu-sub-"+current_chapter.id+" #left-subchapter-"+current_chapter.subchapters[j].id);
      }
    }
  }

  $('#left-menu').append('<p class="left-menu-name">CHAPTERS</p>');

  //[left-menu] set the color on active chapter button
  $('#left-chapter-'+data_loader.active_subchapter.id.split('-')[0]).css('background-color', 'hsl(129, 67%, 64%)')

  //[left-menu] display submenu of active chapter (and not others)
  $(".left-menu-sub").hide()
  $("#left-menu-sub-"+data_loader.active_subchapter.id.split('-')[0]).show()

  //[left-menu] set the color on active subchapter button
  $('#left-subchapter-'+data_loader.active_subchapter.id).css('background-color', 'hsl(129, 67%, 64%)')



}

function subchapterClick(chapter_id,subchapter_sub_id){


  //if chapter is clicked, go to first subchapter
  if(subchapter_sub_id==0) subchapter_id = data_loader.chapters[chapter_id].subchapters[0].id;
  else subchapter_id = chapter_id + '-' + subchapter_sub_id

  data_loader.active_subchapter = data_loader.subchapters[subchapter_id];
  //console.log(chapter_id)
  //console.log(subchapter_id)
  //update chapter title
  if (chapter_id==0) $('#right-subtitle').html(data_loader.active_subchapter.chapter.title)
  else $('#right-subtitle').html(data_loader.active_subchapter.chapter.id +': '+data_loader.active_subchapter.chapter.title)

  //[right-menu] hide all subchapters (text) except active one
  $(".right-subchapter").hide()
  $("#right-subchapter-"+subchapter_id).slideDown( "slow",  function() {
    //console.log("Animation complete");
  });

  //[left-menu] set the color on clicked chapter button (and not others)
  $('.left-chapter').css('background-color', 'black')
  $('#left-chapter-'+chapter_id).css('background-color', 'hsl(129, 67%, 64%)')

  //[left-menu] display submenu of active chapter (and not others)
  $(".left-menu-sub").hide()
  $("#left-menu-sub-"+chapter_id).show()

  //[left-menu] set the color on clicked subchapter button (and not others)
  $('.left-subchapter').css('background-color', 'black')
  $('#left-subchapter-'+subchapter_id).css('background-color', 'hsl(129, 67%, 64%)')

  //set new active country
  data_loader.active_country =data_loader.subchapters[subchapter_id].country;
  refreshLayers();
  display_figure(subchapters[subchapter_id])

}

async function home_menu(){
  //set world as active country
  data_loader.active_country = data_loader.countries['World'];
  //resets layers
  refreshLayers()
  //zoom to world
  zoom_to(data_loader.active_country);
  console.log("moved to: "+data_loader.active_country.name);
  //use all data again
  await data_loader.prepareDataframes()
  //rebuild left and right menu
  buildRightMenu();
  buildLeftMenu();
}

function tutorial(){
intro.start();
}

function add_tooltip(path){
$(path).tooltip(
  {
    position: { my: "left center", at: "right+10 center" }
  }
);
}


function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}
