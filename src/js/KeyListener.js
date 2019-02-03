
//add key-press event listener
function startKeyListener(){
  document.addEventListener("keydown", function(event) {
    //clicked right-arrow or down-arrow, and ignore edge case (last case)
    if ((event.which == '39' || event.which == '40')&&(data_loader.active_case.index+1<Object.keys(data_loader.cases).length)){
      next_case_id= Object.keys(data_loader.cases)[Object.keys(data_loader.cases).indexOf(data_loader.active_case.id)+1]
      caseClick(next_case_id.split('-')[0],next_case_id.split('-')[1]);
      //console.log("down",event.which);

    }
    //clicked left-arrow or up-arrow, and ignore edge case (first subchapter)
    else if((event.which == '37' || event.which == '38')&&(data_loader.active_case.index>0)){
      previous_case_id = Object.keys(data_loader.cases)[Object.keys(data_loader.cases).indexOf(data_loader.active_case.id)-1]
      caseClick(previous_case_id.split('-')[0],previous_case_id.split('-')[1]);
      //console.log("up",event.which);
    }
  });
}
