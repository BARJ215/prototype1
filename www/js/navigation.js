//The purpose of this JavaScript is to implement the gesture navigation using JQuery mobile.
//Based off code from https://api.jquerymobile.com/1.3/jQuery.mobile.changePage/

$(document).on("swipeleft","#main", function(){
    console.log("swipe");
    $.mobile.changePage($("#courseSelect"), { transition: "slideright", changeHash:true});
});
$(document).on("swiperight","#courseSelect", function(){
    console.log("swipe");
    $.mobile.changePage($("#main"), { transition: "slideleft"});
});
$(document).on("swipeleft","#courseSelect", function(){
    console.log("swipe");
    $.mobile.changePage($("#leaderboard"), { transition: "slideright"});
});
$(document).on("swiperight","#leaderboard", function(){
    console.log("swipe");
    $.mobile.changePage($("#courseSelect"), { transition: "slideleft"});
});
$(document).on("swipeleft","#mapEditor", function(){
    console.log("swipe");
    $("#mapPanel").panel("open");
});
$(document).on("swipeleft","#race", function(){
    $("#raceMapPanel").panel("open");
});