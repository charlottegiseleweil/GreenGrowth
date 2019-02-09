class Chapter{

    constructor(id, title){
        this.id =id;
        this.title=title;
        this.cases = []
    }

    add_case(case_){
        this.cases.push(case_)
    }
}
