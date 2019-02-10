class Country{

    constructor(country){
        this.name = country["name"];
        this.summary = country['description'];
        this.loc_view = country['location_view'];
        this.country_code = country['country_code']
    }

}

async function handleCountryClick(layer) {
  if(Object.keys(layer).includes('target'))
    layer = layer.target;
  //clean dynamic figure on map (if any)
  clean_layers();
  //country clicked was active, go back back to default view
  if (data_loader.active_country.name == layer.feature.properties.name){
    //reset to world
    data_loader.active_country = data_loader.countries['World'];
    //resets map layers
    refreshLayers()
    //highlight layer of country left (in case still hovering)
    highlightFeature(layer);
    //remove country name display
    $("#country-display-panel").hide();
  }
  //new country was clicked
  else{
    //set new active country
    data_loader.active_country = data_loader.countries[layer.feature.properties.name];
    //resets map layers
    refreshLayers()
    //display country name
    $('#country-display-panel').slideDown( "slow",  function() {});
    $("#country-display").html(data_loader.active_country.name.toUpperCase());

  }
  //zoom to country
  zoom_to(data_loader.active_country, true);
  console.log("moved to: "+data_loader.active_country.name);
  //use all data again
  await data_loader.prepareDataframes()
  //rebuild left and right menu
  buildRightMenu();
  buildLeftMenu();
}
