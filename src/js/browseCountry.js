async function handleCountryClick(e) {
    //clean dynamic figure on map (if any)
    clean_layers();
    //country clicked was active, go back back to default view
    if (data_loader.active_country == e.target.feature.properties.name){
      map.setView([20.0, 0.0], 2.3);
      data_loader.active_country = 'world';
      //reset to default style
      highlightFeature(e);

      //use all data again
      await data_loader.prepareDataframesAlt()



    }
    //new country was clicked
    else{
      //reset the style of previous active country if any
      if(data_loader.active_country!='world'){
        geojson.eachLayer(function(layer){
          if (layer.feature.properties.name==data_loader.active_country){
            geojson.resetStyle(e.target);
          }
        });
      }

      //set new active country
      data_loader.active_country = e.target.feature.properties.name;
      //zoom to country (should be changed to manually defined values)
      map.fitBounds(e.target.getBounds());
      //adapt the content
      await data_loader.prepareDataframesAlt();

      console.log(data_loader.active_country);
    }
    //rebuild left and right menu
    buildRightMenu();
    buildLeftMenu();

}
