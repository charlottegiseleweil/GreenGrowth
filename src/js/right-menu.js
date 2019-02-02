
//build scrollable right menu containing content of each case
function buildRightMenu(){
  //clear right menu, in case it's being overwritten
  $('#right-menu-body').html("");
  subchapters = data_loader.subchapters;
  //iterate over subchapters to add to right menu
  for (var i in subchapters){
        //Subchapter
        $('#right-menu-body').append("<p id=right-subchapter-"+subchapters[i].id+" class=right-subchapter></p>")
        //Subchapter title
        $("#right-subchapter-"+subchapters[i].id).append("<h5 id="+subchapters[i].id+"-title class=text-body>"+subchapters[i].id+": "+subchapters[i]["title"]+"</h5>")
        //Subchapter summary and (ambiance) images if available
        if (subchapters[i].has_image){ //
            $('#right-subchapter-'+subchapters[i].id).append("<p id="+subchapters[i].id+"-summary+ class=text-body>"+ '<img class="subchapter-img" src="./static/figure_and_images/'+ subchapters[i].id + '.jpg" alt="subchapter-image">'+subchapters[i].summary+ "</p>")
        }
        else {
            $('#right-subchapter-'+subchapters[i].id).append("<p id="+subchapters[i].id+"-summary+ class=text-body>"+subchapters[i].summary+ "</p>")
        }
        //adds figures of right menu (static and dynamic)
        add_right_menu_figure(subchapters[i]);
    }
    $(".right-subchapter").hide();
    $("#right-subchapter-"+data_loader.active_subchapter.id).show();
    /*
    $('#right-menu-body').append('<div style="padding:1%; text-align:justify;"><p><h3>Credits</h3>The case studies survey a range of policy and finance mechanisms that channel economic resources and other benefits towards securing and enhancing natural capital. These mechanisms typically also aim to increase equity and well-being, both through poverty alleviation and in access to ecosystem goods and services. Illustrative examples have been contributed by a range of experts who come from the natural and social sciences, government, private companies, financial institutions, and civil society organizations. These case studies were compiled by Lisa Mandle, James Salzman and Gretchen C. Daily and illustrated by Charlotte Weil. This application is developed by <b>Can Yilmaz Altinigne</b>, <b>Cyril van Schreven</b> and <b>Günes Yurdakul</b>.</p></div>')
    */
}

// add figures on right menu
function add_right_menu_figure(subchapter){
  //add static figure
  if (subchapter.has_static_fig){
    //load the figure
    fig_file = './static/figure_and_images/'+subchapter.id.toString().replace('-','_')+'-1.png';
    $('#right-subchapter-'+subchapter.id).append('<img class="img-center" src="' + fig_file + '">');
    //add figure title
    $('#right-subchapter-'+subchapter.id).append('<p class="figure-text">Figure: ' + subchapter.static_fig_title+ '</p>');
  }

  //add dynamic figure (special case, subchapter 6-1)
  else if (subchapter.id == '6-1'){
    //div for figure (chart-container)
    $('#right-subchapter-'+subchapter.id).append('<div id="chart-container" style="height: 300px;"></div>');
    //fill chart-container
    case_6_1_fig1();
    //add the two buttons of the figure
    $('#right-subchapter-'+subchapter.id).append('<div id="button-div"></div><br><br>');
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
