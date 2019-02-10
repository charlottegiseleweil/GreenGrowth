class Mechanism{

        constructor(name_, code_){
            this.name =name_;
            this.code =code_;
            this.chapters={};
        }

        add_case(case_){
            let chapter_ = case_.chapter;
            let key = chapter_.id+" "+chapter_.title;

            if (!([key] in this.chapters))
                this.chapters[[key]]=[];

            this.chapters[[key]].push(case_);
        }

        list_chapters_on_overlay(){
            //console.log("list chapters",this);
            $("#mechanism-chapters-list").html("");
            for(var key in this.chapters){
                let current_chapter = this.chapters[key];
                $("#mechanism-chapters-list").append('<li>'+key+'</li><ul id="'+key.split(" ")[0]+'"></ul>')
                current_chapter.forEach(function(current_case) {
                    //console.log("case:",current_case.id + ' ' + current_case.title);
                    $('#mechanism-chapters-list #'+key.split(" ")[0]).append("<li class='clickable' href='' onclick='mechanismCaseClick(\""+current_case.id+"\");'>"+ current_case.id + " " + current_case.title+"</li>")
                });
            }
        }


        change_image(){

            $(".mechanism-img-gallery").html("<a href ='./static/mechanisms/"+this.name.split(" ")[0].toLowerCase()+".png'><img class='img-mechanism' src='./static/mechanisms/"+this.name.split(" ")[0].toLowerCase()+".png'></a>");
            startGallery('mechanism-img-gallery');
        }

    }
