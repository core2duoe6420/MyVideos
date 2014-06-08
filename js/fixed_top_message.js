function fixed_top_alert(type, message) {
    var thediv = document.getElementById("fixed-top-message");
    if(thediv == null) {
        thediv = document.createElement("div");
        thediv.id = "fixed-top-message";
        var thebody = document.getElementsByTagName("body")[0];
        thebody.appendChild(thediv);
    }
    thediv.className = "alert alert-" + type;
    thediv.style.zIndex = 2;
    thediv.style.width = "100%";
    thediv.style.paddingLeft = "20%";
    thediv.style.position = "fixed";
    thediv.style.top = 0;
    thediv.style.left = 0;
    thediv.style.opacity = 0;
    thediv.style.display = "block";
    thediv.innerHTML = '<strong>' + message + '</strong>';
    for(var i=0; i<10; i++){
        setTimeout((function(pos){
            return function(){
                document.getElementById("fixed-top-message").style.opacity = pos;
            }
        })(i/10),i*50);
    }
    setTimeout(function() {
        for(var i=0; i < 10; i++) {
            setTimeout((function (pos) {
                return function () {
                    var thediv = document.getElementById("fixed-top-message");
                    thediv.style.opacity = 0.9 - pos;
                    if(pos == 0.9)
                        thediv.style.display = "none";
                }
            })(i / 10), i * 50);
        }
    }, 1800);

}

function fixed_top_success(message) {
    fixed_top_alert("success", message);
}

function fixed_top_error(message) {
    fixed_top_alert("danger", message);
}

function fixed_top_warning(message) {
    fixed_top_alert("warning", message);
}