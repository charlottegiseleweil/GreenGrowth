
//add key-press event listener
function startKeyListener(){
  document.addEventListener("keydown", function(event) {
    //clicked right-arrow or down-arrow, and ignore edge case (last subchapter)
    if ((event.which == '39' || event.which == '40')&&(Object.keys(data_loader.next_subchapter_id).includes(data_loader.active_subchapter.id))){
      subchapterClick(data_loader.next_subchapter_id[data_loader.active_subchapter.id].split('-')[0],data_loader.next_subchapter_id[data_loader.active_subchapter.id].split('-')[1]);

    }
    //clicked left-arrow or up-arrow, and ignore edge case (first subchapter)
    else if((event.which == '37' || event.which == '38')&&(Object.keys(data_loader.previous_subchapter_id).includes(data_loader.active_subchapter.id))){
      subchapterClick(data_loader.previous_subchapter_id[data_loader.active_subchapter.id].split('-')[0],data_loader.previous_subchapter_id[data_loader.active_subchapter.id].split('-')[1]);
    }
  });
}
