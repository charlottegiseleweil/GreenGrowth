
//add key-press event listener
function startKeyListener(){
  document.addEventListener("keydown", function(event) {
    //clicked right-arrow or down-arrow, and ignore edge case (last subchapter)
    if ((event.which == '39' || event.which == '40')&&(data_loader.subchapters.indexOf(data_loader.active_subchapter)+1 <= Object.keys(data_loader.subchapters).length)){
      next_subchapter_id= Object.keys(data_loader.subchapters)[Object.keys(data_loader.subchapters).indexOf(data_loader.active_subchapter.id)+1]
      subchapterClick(next_subchapter_id.split('-')[0],next_subchapter_id.split('-')[1]);

    }
    //clicked left-arrow or up-arrow, and ignore edge case (first subchapter)
    else if((event.which == '37' || event.which == '38')&&(data_loader.subchapters.indexOf(data_loader.active_subchapter)-1 >0)){
      previous_subchapter_id = Object.keys(data_loader.subchapters)[Object.keys(data_loader.subchapters).indexOf(data_loader.active_subchapter.id)-1]
      subchapterClick(previous_subchapter_id.split('-')[0],previous_subchapter_id.split('-')[1]);
    }
  });
}
