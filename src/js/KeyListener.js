
//add key-press event listener
function startKeyListener(){
  document.addEventListener("keydown", keyboardInteraction);
}
function keyboardInteraction(event){
  if ((event.which == '39' || event.which == '40')&&(data_loader.selected_case_ids.indexOf(data_loader.active_case.id)+1<data_loader.selected_case_ids.length)){
    next_case_id= data_loader.selected_case_ids[data_loader.selected_case_ids.indexOf(data_loader.active_case.id)+1]
    caseClick(data_loader.cases[next_case_id].chapter.id,next_case_id);
  }
  //clicked left-arrow or up-arrow, and ignore edge case (first subchapter)
  else if((event.which == '37' || event.which == '38')&&(data_loader.selected_case_ids.indexOf(data_loader.active_case.id)>0)){
    previous_case_id = data_loader.selected_case_ids[data_loader.selected_case_ids.indexOf(data_loader.active_case.id)-1]
    caseClick(data_loader.cases[previous_case_id].chapter.id,previous_case_id);
  }
}
