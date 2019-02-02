class Subchapter{

    constructor(subchapter, chapter){
        this.id  = subchapter["number"].replace(".","-");
        this.title = subchapter["name"];
        this.summary = subchapter['summary'];
        this.loc_view = subchapter['location_view'];
        this.chapter = chapter;
        this.has_image = subchapter["image"];

        this.has_static_fig = false;
        this.static_fig_title = "none";
        this.figures = []
    }
}
