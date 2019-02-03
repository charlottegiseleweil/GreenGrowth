class Group{

    constructor(case_study){
        this.id =case_study["ch_no"];
        this.title=case_study["ch_title"];
        this.cases = []
    }

    add_case(case_){
        this.cases.push(case_)
    }
}
