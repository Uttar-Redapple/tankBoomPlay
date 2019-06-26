var isShowConsole = false;
var Debug = {
    log : function(message){
        if(isShowConsole){
            console.log(message);
        }
    }
}