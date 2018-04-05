$(document).on("swipeleft","#main", function(){
    $.mobile.changePage( "#courseList", { transition: "slideright", changeHash: false }); 
});
$(document).on("swiperight","#courseList", function(){
    $.mobile.changePage( "#main", { transition: "slideleft", changeHash: false }); 
});
$(document).on("swipeleft","#courseList", function(){
    $.mobile.changePage( "#leaderboard", { transition: "slideright", changeHash: false }); 
});
$(document).on("swiperight","#leaderboard", function(){
    $.mobile.changePage( "#courseList", { transition: "slideleft", changeHash: false }); 
});