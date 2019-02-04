class Country{

    constructor(country){
        this.name = country["name"];
        this.summary = country['description'];
        this.loc_view = country['location_view'];
        this.country_code = country['country_code']
    }

}

async function handleCountryClick(layer) {
  //clean dynamic figure on map (if any)
  clean_layers();
  if(data_loader.browse_type=='Country'){
    if(Object.keys(layer).includes('target'))
      layer = layer.target;

    //country clicked was active, go back back to default view
    if (data_loader.active_country.name == layer.feature.properties.name){
      //resets layers
      refreshLayers()
      //go back to intro
      caseClick(Object.keys(data_loader.groups)[0],Object.keys(data_loader.cases)[0]);

    }
    //new country was clicked
    else{

      //set new active country
      data_loader.active_country = data_loader.countries[layer.feature.properties.name];
      //set to active country highlight
      refreshLayers();
      console.log("moved to: "+data_loader.active_country.name);
      //set active case
      data_loader.active_case=data_loader.groups[data_loader.active_country.country_code].cases[0]
      caseClick(data_loader.active_case.group.id,data_loader.active_case.id);
      //zoom to country
      zoom_to(data_loader.active_country);

    }
  }
}
