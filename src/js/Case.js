class Case{

    constructor(index,case_, group, country, mechanism){
        this.id  = case_["number"].replace(".","-");
        this.title = case_["name"];
        this.country = country;
        this.mechanism = mechanism;
        this.summary = case_['summary'];
        this.loc_view = case_['location_view'];
        this.group = group;
        this.has_image = case_["image"];
        this.index=index;
        this.has_static_fig = false;
        this.static_fig_title = "none";
        this.figures = []
    }
}
