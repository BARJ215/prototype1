$(document).on("swipeleft","#main", function(){
    console.log("swipe");
    $.mobile.changePage("#courseList", { transition: "slideright"}); 
});
$(document).on("swiperight","#courseList", function(){
    $.mobile.changePage("#main", { transition: "slideleft"});
});
$(document).on("swipeleft","#courseList", function(){
    $.mobile.changePage("#leaderboard", { transition: "slideright"});
});
$(document).on("swiperight","#leaderboard", function(){
    $.mobile.changePage("#courseList", { transition: "slideleft"});
});