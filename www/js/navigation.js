$(document).on("swipeleft","#main", function(){
    $.mobile.pageContainer.pagecontainer( "change","#courseList", { transition: "slideright"}); 
});
$(document).on("swiperight","#courseList", function(){
    $.mobile.pageContainer.pagecontainer( "change" "#main", { transition: "slideleft"}); 
});
$(document).on("swipeleft","#courseList", function(){
    $.mobile.pageContainer.pagecontainer( "change" "#leaderboard", { transition: "slideright" }); 
});
$(document).on("swiperight","#leaderboard", function(){
    $.mobile.pageContainer.pagecontainer( "change" "#courseList", { transition: "slideleft"}); 
});