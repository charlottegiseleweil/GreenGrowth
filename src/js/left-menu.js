const active_button_color = "hsl(129, 67%, 64%)";
let case_id_display;

function buildLeftMenu(){
  //clear left menu, in case it's being overwritten
  $('#left-menu').html("");
  //add left-menu title
//  chapters = data_loader.chapters;
//  cases = data_loader.cases;
  //add chapter number to (main) left-menu
  $('#left-menu').append("<span id=left-chapter-home class='left-chapter-helper' title='Home' onclick=home_menu();><i class='fas fa-globe-africa'></i></span>");
  $('#left-menu').append("<span id=left-chapter-question class='left-chapter-helper' title='Tutorial' onclick=tutorial();><i class='fas fa-question'></i></span>");
  $('#left-menu').append("<span id=left-chapter-about class='left-chapter-helper' title='About' onclick=openAbout();><i class='fas fa-address-card'></i></span><hr>");
  //$('#left-menu').append("<span id='left-chapter-mechanism' class='left-chapter-helper mechanism-button' title='Mechanisms' onclick=openNav();><i class='fas fa-cog'></i></span><hr>");

  add_tooltip("#left-menu #left-chapter-home");
  add_tooltip("#left-menu #left-chapter-question");
  add_tooltip("#left-menu #left-chapter-about");
  add_tooltip("#left-menu #left-chapter-mechanism");


  refresh_left_menu();
}

function caseClick(chapter_id,case_id){

  //if chapter is clicked, go to first case, except for intro
  if(case_id==0){
    for (var j=0;j< data_loader.chapters[chapter_id].cases.length;j++){
      if(data_loader.selected_case_ids.includes(data_loader.chapters[chapter_id].cases[j].id)){
         case_id = data_loader.chapters[chapter_id].cases[j].id;
         break;
      }
    }
  }



  data_loader.active_case = data_loader.cases[case_id];

  //set new active country
  data_loader.active_country =data_loader.cases[case_id].country;
  refreshLayers();
  zoom_to(cases[case_id], false)
  display_figure(cases[case_id])


  //special handling for intro case, resets to default
  if(data_loader.active_case.chapter.id=="0") {
      //update chapter title
      $('#right-subtitle').html(data_loader.active_case.chapter.title)
      //home_menu();
  }
  else{
    //update chapter title
    $('#right-subtitle').html(data_loader.active_case.chapter.id +': '+data_loader.active_case.chapter.title)
  }
  //[right-menu] hide all cases (text) except active one
  $(".right-case").hide()
  $("#right-case-"+case_id).show();
  //$("#right-case-"+case_id).slideDown( "slow",  function() {});

  //[left-menu] set the color on clicked chapter button (and not others)
  $('.left-chapter').css('background-color', 'black')
  $('#left-chapter-'+chapter_id).css('background-color', 'hsl(129, 67%, 64%)')

  //[left-menu] display submenu of active chapter (and not others)
  $(".left-menu-sub").hide()
  $("#left-menu-sub-"+chapter_id).show()

  //[left-menu] set the color on clicked case button (and not others)
  $('.left-case').css('background-color', 'black')
  $('#left-case-'+case_id).css('background-color', 'hsl(129, 67%, 64%)')

  $('#right-menu').scrollTop(0)

}

async function home_menu(){

  //clean the map of dynamic figues
  await clean_layers();

  //set world as active country
  data_loader.active_country = data_loader.countries['World'];
  //browsing all cases again
  data_loader.browsing_all_cases = true;
  //use all data again
  await data_loader.selectCases()
  //resets layers
  await refreshLayers();
  await buildRightMenu();
  await buildLeftMenu();
  //zoom to world
  zoom_to(data_loader.active_country, true);
  console.log("moved to: "+data_loader.active_country.name);
  $(".tooltip").hide();
  //remove country name display
  $("#country-display-panel-reg").hide();

}

function tutorial(){
intro.start();
}

function add_tooltip(path){
  $(path).tooltip(
    {
      show: { duration: 800 },
      position: { my: "left center", at: "right+10 center" }
    }
  );
}

function openAbout() {
  document.getElementById("myNav").style.width = "100%";
  $("#myNav").load("static/about.html");
}

function openNav() {
  home_menu();
  document.getElementById("myNav").style.width = "100%";
  $("#myNav").load("static/mechanism.html", function(){
  });
  $('#first-mech').click();

}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

async function mechanismCaseClick(case_id){
  await closeNav();
  caseClick(case_id.split("-")[0],case_id);
}



function refresh_left_menu(){
  for (var i in data_loader.selected_chapter_ids){
    current_chapter = data_loader.chapters[data_loader.selected_chapter_ids[i]];

    if(current_chapter.id!=0){ //special case for arrival page
      //add submenu for the chapter
      $('#left-menu').append("<div id=left-menu-sub-"+current_chapter.id+" class='left-menu-sub' ></div>")
      //add case buttons in submenu
      for (var j=0;j<current_chapter.cases.length;j++){
        if(data_loader.selected_case_ids.includes(current_chapter.cases[j].id)){
          $("#left-menu-sub-"+current_chapter.id).append("<span id=left-case-"+current_chapter.cases[j].id+" class='left-case' title='"+current_chapter.cases[j].title+"'onclick=caseClick(\""+current_chapter.id+"\",\""+current_chapter.cases[j].id+"\");>" +current_chapter.cases[j].id.split('-')[1]+ "</span>");
          if(current_chapter.cases[j].has_dynamic_fig=="TRUE")
            $("#left-case-"+current_chapter.cases[j].id).addClass("left-dot-dynamic")
          add_tooltip("#left-menu-sub-"+current_chapter.id+" #left-case-"+current_chapter.cases[j].id);
        }
      }
      $("#left-menu-sub-"+current_chapter.id).append('<p class="left-menu-cases-name">CASES</p>');
    }



    //add a chapter button, note that here onClick calls caseClick on the first case
    if (data_loader.selected_chapter_ids[i]==0) $('#left-menu').append("<span id=left-chapter-"+current_chapter.id+" class='left-chapter' title='"+current_chapter.title+"' onclick=caseClick(\""+current_chapter.id+"\","+0+");><i class='fas fa-circle'></span>");
    else{
      $('#left-menu').append("<span id=left-chapter-"+current_chapter.id+" class='left-chapter' title='"+current_chapter.title+"' onclick=caseClick(\""+current_chapter.id+"\","+0+");>" +current_chapter.id+ "</span>");
      for (var j=0;j<current_chapter.cases.length;j++){
        if(current_chapter.cases[j].has_dynamic_fig=="TRUE")
          $("#left-chapter-"+current_chapter.id).addClass("left-dot-dynamic")
      }
    }
    add_tooltip("#left-menu #left-chapter-"+current_chapter.id);

  }

  $('#left-menu').append('<p class="left-menu-name">'+"CHAPTERS"+'</p>');
  //back button when browsing a country
  if(data_loader.browsing_all_cases){
    $('#back-button-panel').hide();
  }
  else{
    $('#back-button-panel').show();
    //$('#back-button-panel').show();
  }


  //[left-menu] set the color on active chapter button
  $('#left-chapter-'+data_loader.active_case.chapter.id).css('background-color', 'hsl(129, 67%, 64%)')

  //[left-menu] display submenu of active chapter (and not others)
  $(".left-menu-sub").hide()
  $("#left-menu-sub-"+data_loader.active_case.chapter.id).show();

  //[left-menu] set the color on active case button
  $('#left-case-'+data_loader.active_case.id).css('background-color', 'hsl(129, 67%, 64%)')
}
function load_mechanism(){
    data_loader.mechanisms[Object.keys(data_loader.mechanisms)[0]].list_chapters_on_overlay();

}
