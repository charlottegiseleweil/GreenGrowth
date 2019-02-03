class Country{

    constructor(country){
        this.name = country["name"];
        this.summary = country['description'];
        this.loc_view = country['location_view'];
    }

    async click() {
      console.log(this.name)
        //clean dynamic figure on map (if any)
        clean_layers();
        //country clicked was active, go back back to default view
        if (this.name == data_loader.active_country){
          map.setView([20.0, 0.0], 2.3);
          data_loader.active_country = 'world';
          //reset to default style
          highlightFeature(e);
        }
        //new country was clicked
        else{
          //reset the style of previous active country if any
          if(data_loader.active_country!='world'){
            refreshLayers();
          }

          //set new active country
          data_loader.active_country =this;
          //zoom to country
          zoom_to(data_loader.active_country);


          console.log(data_loader.active_country);
        }
        //adapt the content
        await data_loader.prepareDataframes();
        //rebuild left and right menu
        buildRightMenu();
        buildLeftMenu();

    }

}

async function handleCountryClick(layer) {
    if(Object.keys(layer).includes('target'))
      layer = layer.target;

    //clean dynamic figure on map (if any)
    clean_layers();
    //country clicked was active, go back back to default view
    if (data_loader.active_country.name == layer.feature.properties.name){
      home_menu();
    }
    //new country was clicked
    else{

      //set new active country
      data_loader.active_country = data_loader.countries[layer.feature.properties.name];
      //set to active country highlight
      refreshLayers();
      //zoom to country
      zoom_to(data_loader.active_country);
      console.log("moved to: "+data_loader.active_country.name);
      //use all data again
      await data_loader.prepareDataframes()
      //rebuild left and right menu
      buildRightMenu();
      buildLeftMenu();

    }


}
