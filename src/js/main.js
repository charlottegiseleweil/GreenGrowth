var data_loader = new DataLoader();
var intro;
const load_data = async function(){
    $('.mfp-close').on("click",function() {
        startKeyListener();
        console.log("Start key listener");
      });
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
              intro: 'Here you can: <br> -Refresh the visualization <br> -Start the tutorial <br> -Read about us and the book <br>-See the chapters, and click them',
              position: 'right'
          },
          {
              element: '#right-menu',
              intro: 'You can use the left and right arrow keys to navigate between cases. When visualizing a case that contains a dynamic figure, you can use the buttons, sliders and checkboxes available.',
              position: 'left'
          },
          {
              element: '#bottom-menu',
              intro: 'You can select to explore cases by Chapter, Mechanism or Country. <br> When browsing by country it is possible to simply select them on the map. <br> Enjoy exploring!',              position: 'left'
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
