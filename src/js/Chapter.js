class Chapter{
    
    constructor(case_study){
        this.id =case_study["ch_no"];
        this.title=case_study["ch_title"];
        this.subchapters = []
    }

    add_subchapter(subchapter){
        this.subchapters.push(subchapter)
    }
}
    