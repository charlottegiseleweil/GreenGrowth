let browse_types = ['Chapter','Mechanism','Country'];

function buildBottomMenu(){
  for(i in browse_types){
    let type = browse_types[i];
    $('#bottom-menu').append("<span id='bottom-menu-"+type+"' class='bottom-menu-element' title="+type+" onclick='changeBrowseType(\""+type+"\");'>"+type+"</span>")
  }
  $('#bottom-menu-'+data_loader.browse_type).css('background-color', 'hsl(129, 67%, 64%)')
}

function changeBrowseType(type){
  data_loader.browse_type=type;
  //[left-menu] set the color on clicked chapter button (and not others)
  $('.bottom-menu-element').css('background-color', 'black')
  $('#bottom-menu-'+data_loader.browse_type).css('background-color', 'hsl(129, 67%, 64%)')

}
