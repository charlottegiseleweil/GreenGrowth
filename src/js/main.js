var data_loader = new DataLoader();
var intro;
const load_data = async function(){
  $( 'body' ).ready(function() {
      // create progress bar
      $('.progress').bind('loaded',function(){
          $('.progress').hide();
          open_page();          
    });

      //load and prepare dataframes
      data_loader.prepareDataframes();
      //preload the data of the dynamic figures (slow)
      data_loader.preloadDynamicFigures();
      //setTimeout(function(){$('.progress').trigger('loaded')}, 600)
  });
}

load_data();

//opening click after data loaded
function open_page() {
  $(".opening-page").fadeOut( 1000, function() {
      $(".opening-page").remove();
      map.addLayer(Esri_WorldImagery);// add tile layer
      $(".mapbox").css({'display': 'block'});
      map.invalidateSize();

      $.getJSON('./data/countries.geojson', function(data) {//add layer of boundaries of filtered countries
          geojson = L.geoJson(data, {
              filter: filter_countries,
              style: myStyle,
              onEachFeature: onEachFeature,
              scrollWheelZoom: false}).addTo(map);
      });

      //start key listener
      startKeyListener();

      //build left and right menu
      buildRightMenu();
      buildLeftMenu();

      //create user guide
      intro = introJs();

      intro.setOptions({
          steps: [
          {
              intro: "This help menu will guide you through the steps necessary to use the app properly."
          },
          {
              element: '#left-menu',
              intro: 'You can see the current chapter and subchapter here. You can click the chapter you want to see.',
              position: 'right'
          },
          {
              element: '#right-menu',
              intro: 'You can use your mouse or up and down array keys to navigate between chapters. You can use buttons, time sliders and checkboxes to see dynamic figures in specific chapters.',
              position: 'left'
          }
          ],
          showStepNumbers:false
    });

    //intro.start();//start user-guide

  });
}
