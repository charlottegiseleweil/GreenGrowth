class Subchapter{

    constructor(index,subchapter, chapter, country){
        this.id  = subchapter["number"].replace(".","-");
        this.title = subchapter["name"];
        this.country = country;
        this.summary = subchapter['summary'];
        this.loc_view = subchapter['location_view'];
        this.chapter = chapter;
        this.has_image = subchapter["image"];
        this.index=index;
        this.has_static_fig = false;
        this.static_fig_title = "none";
        this.figures = []
    }
}
