/*Only checking for one feature (3d), normally I would just use modernizr  */

(function(){
    var detect = document.createElement("div");
    detect.style.transformStyle = "preserve-3d";
    if(!detect.style.transformStyle.length) {
        $('body').addClass('no3d');
    }
})();