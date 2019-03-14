class Case{

    constructor(index,case_, chapter, country, mechanism){
        this.id  = case_["number"].replace(".","-");
        //console.log(this.id);
        this.title = case_["name"];
        this.country = country;
        this.mechanism = mechanism;
        this.summary = case_['summary'];
        this.loc_view = case_['location_view'];
        this.chapter = chapter;
        this.num_images=case_["num_images"];
        this.index=index;
        this.has_dynamic_fig = case_['dynamic'];
        this.has_static_fig = false;
        this.static_fig_title = "none";
        this.img_credit=case_['img_credits'];
        this.static_fig_credit=case_['static_fig_credits'];
        this.figures = [];
        this.files = [];
        this.layers = {};
        this.data=null;
        this.show = function(){}
        this.hide = function(){}
        this.create_data = function(){}
    }
}
