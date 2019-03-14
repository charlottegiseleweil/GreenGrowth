
//build  right menu containing content of each case
function buildRightMenu(){
  //set the chaptertitle
  if (data_loader.active_case.chapter.id==0)
    $('#right-subtitle').html(data_loader.active_case.chapter.title)
  else
    $('#right-subtitle').html(data_loader.active_case.chapter.id +': '+data_loader.active_case.chapter.title)

  //clear it
  $('#right-menu-body').html('');


  cases = data_loader.cases;
  //iterate over cases to add to right menu
  for (var i in data_loader.selected_case_ids){
        let case_ = data_loader.cases[data_loader.selected_case_ids[i]]
        //console.log(case_)
        //case
        $('#right-menu-body').append("<p id=right-case-"+case_.id+" class=right-case></p>")
        //case title
        if (case_.id.split('-')[0]==0) //special case for overview page
          $("#right-case-"+case_.id).append("<h5 id="+case_.id+"-title class=text-body><b>"+case_.title+"</b></h5>")
        else
          $("#right-case-"+case_.id).append("<h5 id="+case_.id+"-title class=text-body><b>"+case_.id+": "+case_["title"]+"</b></h5>")
        //case summary and (ambiance) images if available

        if (case_.num_images){ //
            $('#right-case-'+case_.id).append("<div id="+case_.id+'-summary class=text-body> <div class ="gallery'+case_.id+'" onclick="disableKeyboard();"></div>'+case_.summary+'<div>');
            $('#right-case-'+case_.id).append("<div id="+case_.id+'-legend-holder></div>');
            //special case for external links
            if(case_.id=='9-2')
              $('#right-case-'+case_.id).append('<br><u><b><center><a href="https://charlottegiseleweil.github.io/webviz_natcap/intro.html" target="_blank" style="font-size:1.1vmax;"> --> More about The Upper Tana Nairobi Water Fund <-- </a></center></b></u><br>')
            else  if(case_.id=='16-3')
              $('#right-case-'+case_.id).append('<br><u><b><center><a href="http://www.myanmarnaturalcapital.org/en" target="_blank" style="font-size:1.1vmax;"> --> Explore Myanmar\'s Natural Capital <-- </a></center></b></u><br>')
            let credit='';
            if (case_.img_credit=="None"){
              $('#right-case-'+case_.id +' .gallery'+case_.id).append('<a href ="./static/figure_and_images/'+ case_.id + '/1.jpg" ><img class="case-img"'+case_.id+' src="./static/figure_and_images/'+ case_.id + '/1.jpg"  alt="case-image"></a>');
            }
            else{
              let credit=case_.img_credit;
              $('#right-case-'+case_.id +' .gallery'+case_.id).append('<a href ="./static/figure_and_images/'+ case_.id + '/1.jpg" credit="'+credit+'"><img class="case-img"'+case_.id+' src="./static/figure_and_images/'+ case_.id + '/1.jpg"  alt="case-image"><span class="img-credit">Credits:'+case_.img_credit+'</span></a>');
            
            }


            for (var j=2;j<=parseInt(case_.num_images);j++){
                $('#right-case-'+case_.id+' .gallery'+case_.id).append('<a href ="./static/figure_and_images/'+ case_.id +'/'+ j +'.jpg" class="case-img-hidden credit="'+credit+'"><img class="case-img-hidden" src="./static/figure_and_images/'+ case_.id + '/'+j+'.jpg" title="title" alt="case-image"></a>');

            }
        }
        else {
            $('#right-case-'+case_.id).append("<p id="+case_.id+"-summary class=text-body>"+case_.summary+ "</p>")
            $('#right-case-'+case_.id).append("<div id="+case_.id+'-legend-holder></div>')
            //special case for external links
            if(case_.id=='9-2')
              $('#right-case-'+case_.id).append('<br><u><b><center><a href="https://charlottegiseleweil.github.io/webviz_natcap/intro.html" target="_blank" style="font-size:1.1vmax;"> --> More about The Upper Tana Nairobi Water Fund <-- </a></center></b></u><br>')
            else  if(case_.id=='16-3')
              $('#right-case-'+case_.id).append('<br><u><b><center><a href="http://www.myanmarnaturalcapital.org/en" target="_blank" style="font-size:1.1vmax;"> --> Explore Myanmar\'s Natural Capital <-- </a></center></b></u><br>')


        }
        //add second summary to overview page
        if (case_.id.split('-')[0]==0){
          $("#right-case-"+case_.id).append("<h5 id="+case_.id+"-title class=text-body><b>"+case_.titleSecond+"</b></h5>")
          $('#right-case-'+case_.id).append("<p id="+case_.id+"-summary class=text-body>"+case_.summarySecond+ "</p>")
        }
        //adds figures of right menu (static and dynamic)
        add_right_menu_figure(case_);
        startGallery('gallery'+case_.id);
    }
    $(".right-case").hide();
    $("#right-case-"+data_loader.active_case.id).show();
    startGallery('mechanism-img-gallery');

}

// add figures on right menu
function add_right_menu_figure(case_){
  //add static figure
  if (case_.has_static_fig){
    //load the figure
    fig_file = './static/figure_and_images/'+case_.id.toString().replace('-','_')+'-1.png';

    $('#right-case-'+case_.id).append('<div class ="static-gallery'+case_.id+'" onclick="disableKeyboard();"></div>');
    let credit=case_.static_fig_credit;
    if(case_.static_fig_credit!='None'){
      $('#right-case-'+case_.id).append('<div class="static-fig-credit">Credits:'+case_.static_fig_credit+'</div>')
    }
    else{
      credit='';
    }

    if(case_.id=='9-2'){
      $('#right-case-'+case_.id + ' .static-gallery'+case_.id).append('<a href="https://charlottegiseleweil.github.io/webviz_natcap/index.html" target="_blank" credit="'+credit+'" title="'+case_.static_fig_title+'"> <img class="img-center" src="' + fig_file + '" title="title" alt="static-image"></a>');
    }
    else{
      $('#right-case-'+case_.id + ' .static-gallery'+case_.id).append('<a href ="'+fig_file+'" credit="'+credit+'" title="'+case_.static_fig_title+'"><img class="img-center" src="' + fig_file + '" title="title" alt="static-image"></a>');
      console.log(case_.static_fig_title);
      if(case_.id=='17-2'){
        fig_file_2 = './static/figure_and_images/'+case_.id.toString().replace('-','_')+'-2.png';
        $('#right-case-'+case_.id + ' .static-gallery'+case_.id).append('<a href ="'+fig_file_2+'" credit="'+credit+'" title="'+case_.static_fig_title+'"><img class="img-center case-img-hidden" src="' + fig_file_2 + '" title="title" alt="static-image"></a>');  
      }
      startGallery('static-gallery'+case_.id);
    }
    //add figure title
    $('#right-case-'+case_.id).append('<p class="figure-text">' + case_.static_fig_title+ '</p>');


  }

  //add dynamic figure (special case, case 6-1)
  else if (case_.id == '6-1'){
    //div for figure (chart-container)

    //add the two buttons of the figure
    $('#right-case-'+case_.id).append('<div id="button-div"></div><br><br>');
    $('#button-div').append('<br><button type="button" class="btn btn-light case-6-1-button" id="button-1" onclick="data_loader.cases['+"'6-1'"+'].show(1);">Enrollment per county</button>');
    $('#button-div').append('<button type="button" class="btn btn-light case-6-1-button" id="button-2" onclick="data_loader.cases['+"'6-1'"+'].show(2);" style="float:right;">Soil rental rate per county</button><br>');
      //div for figure (chart-container)
      $('#right-case-'+case_.id).append('<div id="chart-container" style="height: 300px;"></div>');
      $('#right-case-'+case_.id).append('<p class="figure-text" style="font-size: 0.85vw;">CRP Enrollments and Payments </p>');
  
      //fill chart-container
      case_6_1_fig1();
    }

}

//create line plot of case study 6.1
function case_6_1_fig1() {
    //set options of line plot
    var options={
        animationEnabled: true,
//        title:{
//            text: "CRP Enrollments and Payment"
//        },
        toolTip: {
            shared: true
        },
        axisX: {
            title: "Year",
            suffix : "",
            valueFormatString:"####"
        },
        axisY: {
            title: "Land Enrolled",
            titleFontColor: "#4F81BC",
            suffix : "M",
            lineColor: "#4F81BC",
            tickColor: "#4F81BC",
            valueFormatString:"####"
        },
        axisY2: {
            title: "CRP Payments",
            titleFontColor: "#C0504E",
            suffix : "M",
            lineColor: "#C0504E",
            tickColor: "#C0504E"
        },
        data: [{
            type: "spline",
            name: "Land Enrolled",
            xValueFormatString: "####",
            yValueFormatString: "#### million acres",
            dataPoints: data_points_acres
        },
        {
            type: "spline",
            axisYType: "secondary",
            name: "CRP Payments",
            yValueFormatString: "$####",
            xValueFormatString: "####",
            dataPoints: data_points_money
        }]
    };

    $("#chart-container").CanvasJSChart(options);

};

function disableKeyboard(image_class){
    console.log("Keyboard disabled");
    document.removeEventListener("keydown", keyboardInteraction);
    $('.mfp-close').on('click',function(){
        startKeyListener();
    });
}


function startGallery(id){
    $('.'+id).magnificPopup({
        delegate: 'a', // child items selector, by clicking on it popup will open
        type: 'image',
        gallery:{
            enabled:true,
            preload: [0,1] // Will preload 0 - before current, and 1 after the current image
          },
        callbacks: {
            close: function(){
            startKeyListener();
        }},
        image: {
              titleSrc: function(item) {
                if (item.el.attr('title')&&item.el.attr('credit'))
                  return item.el.attr('title')+ '<small>'+item.el.attr('credit')+'</small>';
                else if(item.el.attr('title')){
                  return item.el.attr('title');
                }
                else if(item.el.attr('credit')){
                  return item.el.attr('credit')
                }
                // + '<small>by Marsel Van Oosten</small> ->to add credit returm this
              } 
              // this tells the script which attribute has your caption
          }
        // other options
      });
}
