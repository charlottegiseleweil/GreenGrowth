let browse_types = ['Chapter','Mechanism','Country'];
var mechanism_chapters=[];
function buildBottomMenu(){
  for(i in browse_types){
    let type = browse_types[i];
    $('#bottom-menu').append("<span id='bottom-menu-"+type+"' class='bottom-menu-element' title="+type+" onclick='changeBrowseType(\""+type+"\");'>"+type+"</span>");
  }
  $('#bottom-menu-'+data_loader.browse_type).css('background-color', 'hsl(129, 67%, 64%)');
}

function buildMechanismMenu(){
  var flag=true;
  for(mechanism in data_loader.mechanism_types){
    console.log(mechanism,"mech");    
    $('#mechanism-menu').append("<span id='mechanism-menu-"+mechanism.split(" ").join("-")+"' class='mechanism-menu-element' onclick='changeMechanismType(\""+mechanism+"\");'>"+mechanism+"</span>");
    if(flag){
      $('#mechanism-menu-'+mechanism.split(" ").join("-")).css('background-color', 'hsl(129, 67%, 64%)');  
      $('#mechanism-img-div').append("<img class='mechanism-img' src='./static/mechanisms/government.png' />");      
      flag=false;
    }
  }
  $('#mechanism-menu').hide();  
}

async function changeBrowseType(type){

  data_loader.browse_type=type;
  //clean the map of dynamic figures
  clean_layers();
  //[left-menu] set the color on clicked browse type button (and not others)
  $('.bottom-menu-element').css('background-color', 'black')
  $('#bottom-menu-'+data_loader.browse_type).css('background-color', 'hsl(129, 67%, 64%)')
  //set world as active country
  data_loader.active_country = data_loader.countries['World'];
  //resets layers
  refreshLayers()
  //zoom to world
  zoom_to(data_loader.active_country);
  //rebuild dataframes
  await data_loader.prepareDataframes();
  buildRightMenu();
  buildLeftMenu();
  if (data_loader.browse_type=='Mechanism'){
    //openNav();
    console.log('mechanism overlay');
    $('#right-menu-body').hide();   
    $('#mechanism-menu').show()
    $('#mechanism-img-div').show();                
    $('#mechanism-menu').show();       
  }
  else{
    console.log("is null");
    $('#mechanism-menu').hide();    
    $('#right-menu-body').show();    
  }
}

function changeMechanismType(type){
  let file_name = "";
  if (type.includes("-")){
    file_name = type.split("-")[0].toLowerCase();
  }
  else
    file_name = type.split(" ")[0].toLowerCase();

  $('#mechanism-img-div').html("");            
  $('.mechanism-menu-element').css('background-color', 'hsl(4, 72%, 55%, 0.81)');
  $('#mechanism-menu-'+type.split(" ").join("-")).css('background-color', 'hsl(129, 67%, 64%)');
  $('#mechanism-img-div').append("<img class='mechanism-img' src='./static/mechanisms/"+file_name+".png' />");
  data_loader.mechanism_chapters = mechanism_types[type];  
  changeBrowseType('Mechanism');
}
