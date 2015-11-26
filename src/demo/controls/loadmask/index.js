$(document).ready(function(){
    $("#t-lm-process").bind("click", function () {
        $("#t-lm-content").loadmask({
            text: "加载中", 
            position: "overlay"
        });
    });
    
    $("#t-lm-cancel").bind("click", function () {
        $("#t-lm-content").loadmask('hide');
    });

});