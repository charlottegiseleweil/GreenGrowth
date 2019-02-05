const active_button_color = "hsl(129, 67%, 64%)";
let case_id_display;

function buildLeftMenu(){
  //clear left menu, in case it's being overwritten
  $('#left-menu').html("");
  //add left-menu title
  groups = data_loader.groups;
  cases = data_loader.cases;
  //add group number to (main) left-menu
  $('#left-menu').append("<span id=left-group-home class='left-group-helper' title='Refresh' onclick=home_menu();><i class='fas fa-globe-africa'></i></span>");
  $('#left-menu').append("<span id=left-group-question class='left-group-helper' title='Tutorial' onclick=tutorial();><i class='fas fa-question'></i></span>");
  $('#left-menu').append("<span id=left-group-about class='left-group-helper' title='About Us' onclick=openAbout();><i class='fas fa-address-card'></i></span><hr>");
//  $('#left-menu').append("<span id='left-group-mechanism' class='left-group-helper mechanism-button' title='Mechanisms' onclick=openNav();><i class='fas fa-info'></i></span><hr>");

  add_tooltip("#left-menu #left-group-home");
  add_tooltip("#left-menu #left-group-question");
  add_tooltip("#left-menu #left-group-about");
  refresh_left_menu();
  //$('#left-menu').append("<span id=left-group-0 class='left-group' title='Overview' onclick=caseClick("+0+","+1+");>" +0+ "</span>");
}

function caseClick(group_id,case_id){
  if(data_loader.browse_type=="Mechanism")
    {
      console.log("case click");
      $('#mechanism-img-div').hide();                
      $('#mechanism-menu').hide();   
      $('#right-menu-body').show();   
    }
  //if group is clicked, go to first case, except for intro
  if(case_id==0) case_id = data_loader.groups[group_id].cases[0].id;
  //else case_id = group_id + '-' + case_sub_id

  data_loader.active_case = data_loader.cases[case_id];
  //console.log(group_id)
  //console.log(case_id)
  //update group title
  if (group_id==0||data_loader.browse_type=='Country') $('#right-subtitle').html(data_loader.active_case.group.title)
  else $('#right-subtitle').html(data_loader.active_case.group.id +': '+data_loader.active_case.group.title)

  //[right-menu] hide all cases (text) except active one
  $(".right-case").hide()
  $("#right-case-"+case_id).slideDown( "slow",  function() {
    //console.log("Animation complete");
  });

  //[left-menu] set the color on clicked group button (and not others)
  $('.left-group').css('background-color', 'black')
  $('#left-group-'+group_id).css('background-color', 'hsl(129, 67%, 64%)')

  //[left-menu] display submenu of active group (and not others)
  $(".left-menu-sub").hide()
  $("#left-menu-sub-"+group_id).show()

  //[left-menu] set the color on clicked case button (and not others)
  $('.left-case').css('background-color', 'black')
  $('#left-case-'+case_id).css('background-color', 'hsl(129, 67%, 64%)')


  //set new active country
  data_loader.active_country =data_loader.cases[case_id].country;
  refreshLayers();
  display_figure(cases[case_id])

}

async function home_menu(){

  //clean the map of dynamic figues
  clean_layers();
  //set world as active country
  data_loader.active_country = data_loader.countries['World'];
  //set chapter as browse type
  data_loader.browse_type = 'Chapter'
  //resets layers
  buildLeftMenu();
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
      show: { duration: 800 },
      position: { my: "left center", at: "right+10 center" }
    }
  );
}

function openAbout() {
  document.getElementById("myNav").style.width = "100%";
}

function openNav() {
  document.getElementById("myNav").style.width = "100%";
  console.log("open nav",data_loader.browse_type);
  if(data_loader.browse_type=='Mechanism'){
    //$("#myNav").load("static/mechanism.html");
  }
  else if(data_loader.browse_type=='Chapter'){
    $("#myNav").load("static/chapter.html", function() {
      $("#nav-title").html('Chapters');
      for(var i=1; i<Object.keys(data_loader.groups).length; i++){
        current_group=data_loader.groups[Object.keys(data_loader.groups)[i]];
        $("#chapter-nav-list").append('<li id="nav-item-'+current_group.id+'" class="nav-item"></li>');
        $("#nav-item-"+current_group.id).append('<a class="nav-link active" href="javascript:void(0)" onclick="changeImage(this)" name="'+current_group.id+'">'+current_group.id+': '+current_group.title+'</a>')
      }
    });
  }

  else if(data_loader.browse_type=='Country'){
    $("#myNav").load("static/chapter.html", function() {
      $("#nav-title").html('Countries');
      for(var i=1; i<Object.keys(data_loader.groups).length; i++){
        current_group=data_loader.groups[Object.keys(data_loader.groups)[i]];
        $("#chapter-nav-list").append('<li id="nav-item-'+current_group.id+'" class="nav-item"></li>');
        $("#nav-item-"+current_group.id).append('<a class="nav-link active" href="javascript:void(0)" onclick="changeImage(this)" name="'+current_group.id+'">'+current_group.title+'</a>')
      }
    });
  }
  
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

function changeImage(e) {
  $(".mechanism-img").attr("src","./static/mechanisms/"+e.name+".png");
}


function refresh_left_menu(){
  for (var i in groups){
    current_group = groups[i];
    //add a group button, note that here onClick calls caseClick on the first case
    if (i==0) $('#left-menu').append("<span id=left-group-"+current_group.id+" class='left-group' title='"+current_group.title+"' onclick=caseClick(\""+i+"\","+0+");><i class='fas fa-circle'></span>");
    else $('#left-menu').append("<span id=left-group-"+current_group.id+" class='left-group' title='"+current_group.title+"' onclick=caseClick(\""+i+"\","+0+");>" +current_group.id+ "</span>");

    add_tooltip("#left-menu #left-group-"+current_group.id);

    if(current_group.id!=0){ //special case for arrival page
      //add submenu for the group
      $('#left-group-'+current_group.id).after("<div id=left-menu-sub-"+current_group.id+" class='left-menu-sub'></div>")
      //add case buttons in submenu
      for (var j=0;j<current_group.cases.length;j++){
        if(data_loader.browse_type=='Chapter'||data_loader.browse_type=='Mechanism')
          $("#left-menu-sub-"+current_group.id).append("<span id=left-case-"+current_group.cases[j].id+" class='left-case' title='"+current_group.cases[j].title+"'onclick=caseClick(\""+i+"\",\""+current_group.cases[j].id+"\");>" +current_group.cases[j].id.split('-')[1]+ "</span>");
        else if(data_loader.browse_type =='Country'){
          case_id_display = j+1;
          //$("#left-menu-sub-"+current_group.id).append("<span id=left-case-"+current_group.cases[j].id+" class='left-case' title='"+current_group.cases[j].title+"'onclick=caseClick(\""+i+"\",\""+current_group.cases[j].id+"\");>" +current_group.cases[j].id.split('-')[1]+ "</span>");
          $("#left-menu-sub-"+current_group.id).append("<span id=left-case-"+current_group.cases[j].id+" class='left-case' title='"+current_group.cases[j].title+"'onclick=caseClick(\""+i+"\",\""+current_group.cases[j].id+"\");>"+case_id_display+"</span>");
        }
        add_tooltip("#left-menu-sub-"+current_group.id+" #left-case-"+current_group.cases[j].id);
      }
      $("#left-menu-sub-"+current_group.id).append('<p class="left-menu-cases-name">CASES</p>');      
    }
  }
  if (data_loader.browse_type == 'Country')
    $('#left-menu').append('<p class="left-menu-name">COUNTRY</p>');
  else
    $('#left-menu').append('<p class="left-menu-name">CHAPTERS</p>');
    
  //[left-menu] set the color on active group button
  $('#left-group-'+data_loader.active_case.group.id).css('background-color', 'hsl(129, 67%, 64%)')

  //[left-menu] display submenu of active group (and not others)
  $(".left-menu-sub").hide()
  $("#left-menu-sub-"+data_loader.active_case.group.id).show()

  //[left-menu] set the color on active case button
  $('#left-case-'+data_loader.active_case.id).css('background-color', 'hsl(129, 67%, 64%)')  
}
