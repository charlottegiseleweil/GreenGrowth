
//build scrollable right menu containing content of each case
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
  for (var i in cases){
        //case
        $('#right-menu-body').append("<p id=right-case-"+cases[i].id+" class=right-case></p>")
        //case title
        if (cases[i].id.split('-')[0]==0) //special case for arrival page
          $("#right-case-"+cases[i].id).append("<h5 id="+cases[i].id+"-title class=text-body><b>"+cases[i]["title"]+"</b></h5>")
        else
          $("#right-case-"+cases[i].id).append("<h5 id="+cases[i].id+"-title class=text-body><b>"+cases[i].id+": "+cases[i]["title"]+"</b></h5>")
        //case summary and (ambiance) images if available

        if (cases[i].num_images){ //
            $('#right-case-'+cases[i].id).append("<p id="+cases[i].id+'-summary+ class=text-body> <div class ="gallery'+cases[i].id+'" onclick="disableKeyboard();"></div>'+cases[i].summary+'<p>');
            //$('#right-case-'+cases[i].id +' .gallery'+cases[i].id).append('<a class="pin" href="#"><span class="far fa-images"></span></a>');
            $('#right-case-'+cases[i].id +' .gallery'+cases[i].id).append('<a href ="./static/figure_and_images/'+ cases[i].id + '/1.jpg"><img class="case-img"'+cases[i].id+' src="./static/figure_and_images/'+ cases[i].id + '/1.jpg" alt="case-image"></a>');

            for (var j=2;j<=parseInt(cases[i].num_images);j++){
                $('#right-case-'+cases[i].id+' .gallery'+cases[i].id).append('<a href ="./static/figure_and_images/'+ cases[i].id +'/'+ j +'.jpg" class="case-img-hidden><img class="case-img-hidden" src="./static/figure_and_images/'+ cases[i].id + '/'+j+'.jpg" alt="case-image"></a>');

            }
        }
        else {
            $('#right-case-'+cases[i].id).append("<p id="+cases[i].id+"-summary+ class=text-body>"+cases[i].summary+ "</p>")
        }
        //adds figures of right menu (static and dynamic)
        add_right_menu_figure(cases[i]);
        startGallery('gallery'+cases[i].id);
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
    //$('#right-case-'+cases[i].id +' .gallery'+cases[i].id).append('<a class="pin" href="#"><span class="far fa-images"></span></a>');

    $('#right-case-'+case_.id + ' .static-gallery'+case_.id).append('<a href ="'+fig_file+'"><img class="img-center" src="' + fig_file + '"></a>');
    //add figure title
    $('#right-case-'+case_.id).append('<p class="figure-text">Figure: ' + case_.static_fig_title+ '</p>');
    startGallery('static-gallery'+case_.id);

  }

  //add dynamic figure (special case, case 6-1)
  else if (case_.id == '6-1'){
    //div for figure (chart-container)
    $('#right-case-'+case_.id).append('<div id="chart-container" style="height: 300px;"></div>');
    $('#right-case-'+case_.id).append('<p class="figure-text">Figure: CRP Enrollments and Payments </p>');

    //fill chart-container
    case_6_1_fig1();
    //add the two buttons of the figure
    $('#right-case-'+case_.id).append('<div id="button-div"></div><br><br>');
    $('#button-div').append('<br><button type="button" class="btn btn-light case-6-1-button" id="button-1" onclick="case_6_1_fig2();">Enrollment per county</button>');
    $('#button-div').append('<button type="button" class="btn btn-light case-6-1-button" id="button-2" onclick="case_6_1_fig3();" style="float:right;">Soil rental rate per county</button><br>');
  }

}

//create line plot of case study 6.1
function case_6_1_fig1() {
    //set options of line plot
    var options={
        animationEnabled: true,
        title:{
            text: "CRP Enrollments and Payment"
        },
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
            enabled:true
          },
          callbacks: {
            close: function(){
               startKeyListener();
            }}

        // other options
      });
}
