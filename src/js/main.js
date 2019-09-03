var data_loader = new DataLoader();
var intro;
async function load_data(){
    $('.mfp-close').on("click",function() {
        startKeyListener();
        console.log("Start key listener");
      });
  $( 'body' ).ready(async function() {
      // create progress bar
      $('.progress').bind('loaded',function(){
          $('.progress').hide();
          open_page();
    });
    //value="start";
        await data_loader.prepareDataframes();
        await data_loader.selectCases()
      //load and prepare dataframes
        await construct_cases();
      //preload the data of the dynamic figures (slow)
      // Comment line below, and uncomment following one for running locally w/o loading dynamic figs
       await data_loader.preloadDynamicFigures();
      //setTimeout(function(){$('.progress').trigger('loaded')}, 600)
  });
}

load_data();

//opening click after data loaded
function open_page() {

  $(".opening-page").fadeOut( 1000, function() {
      $(".opening-page").remove();
      map.addLayer(Esri_WorldImagery1);// add tile layer
      map.addLayer(CartoDB_VoyagerOnlyLabels);
      $(".mapbox").css({'display': 'block'});
      map.invalidateSize();

      $.getJSON('./data/countries.geojson', function(data) {//add layer of boundaries of filtered countries
          geojson = L.geoJson(data, {
              filter: filter_countries,
              style: countriesBaseStyle,
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
              intro: "Welcome to the Green Growth Explorer! This app will allow you to explore the case studies of Green Growth That Works by chapter and mechanism. In some cases, take a deep dive into the data behind the success story."
          },
          {
              element: '#left-menu',
              intro: 'Here, select cases to explore by chapter. The cases with a red border allow for interactive exploration of the data.',
              position: 'right'
          },
          {
              element: '#right-menu',
              intro: 'Details about the selected case will appear here. Click on buttons and images to discover more!',
              position: 'left'
          },

          {
              element: '#by-type-button',
              intro: 'To navigate between cases, use the left and right arrows on your keyboard or click on a case of interest by book chapter, by country, or by mechanism type (here)',
              position: 'left'
          },

          {
              element: '#buythebook',
              intro: 'Click below to buy the book. <br> <br> Happy exploring!',
              position: 'left'
          }

          ],
          showStepNumbers:false
    });
    //map.addLayer( markerClusters );
    //intro.start();//start user-guide

  });
  setGalleryStyle();
  $('.gallery').on("click",function(){
    console.log("click image");
    document.removeEventListener("keydown", keyboardInteraction);
});

}

function setGalleryStyle(){
    $(document).ready(function() {
        $('.image-link').magnificPopup({type:'image'});
      });
}
