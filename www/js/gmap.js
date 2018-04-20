var trackID;
var map;
var raceMap;
var directionsService;
var route;
var newRoute=false;
var loading = false;
var markers= [];
var directionsDisplay;
var raceDisplay;
var stopTracking=false;
var oldPos;
var racing;
var startTime;
var currentPos;
var currentTime;
var reward;

$(document).on("pageshow","#courseSelect", function(){
    navigator.geolocation.getCurrentPosition(init, failPosition);
});

$(document).on("pageshow","#mapEditor", function() {
    newRoute=true;
    navigator.geolocation.getCurrentPosition(init, failPosition);
    
});

$(document).on("pageshow","#race", function(){
    navigator.geolocation.getCurrentPosition(init, failPosition);
    var locationOptions = {
        //maximumAge: 10000,
        timeout: 10,
        //enableHighAccuracy: true
    };
    if(loading==true){
        oldPos={
            lat:0,
            lng:0
        }
        trackID=navigator.geolocation.watchPosition(track,failPosition,locationOptions);
    }
    centerRaceMap(currentPos);
});

$(document).on("pagehide","#race", function(){
    if(racing==true){
        //SAVE RACE OR END IT
        racing=false;
        
    }
    navigator.geolocation.clearWatch(trackID);
    console.log("stopped tracking");
});

$(document).on("click","#centerYou", function(){
    centerMap(currentPos);
});
$(document).on("click","#centerA", function(){
    centerMap(route.origin);
});
$(document).on("click","#centerB", function(){
    centerMap(route.destination);
});
$(document).on("click","#raceCenterYou", function(){
    centerRaceMap(currentPos);
});
$(document).on("click","#startRaceButton", function(){
    startRace();
});
$(document).on("click","#finishRaceButton", function(){
    endRace();
});



function init(position){
    console.log("init");

    //Get position
    currentPos = convertPosition(position);

    if(loading==false){
        initMap(currentPos);    
        initCalc(currentPos);
        //Add marker on current position
        addMarker(currentPos);
        loading=true;
        console.log("loaded");
    }
    if(newRoute==true){
        calcRoute(directionsService, directionsDisplay, route);
        newRoute=false;
    }
    
    centerMap(currentPos);

}

function initMap(pos){
    //detectBrowser();

    map = new google.maps.Map(document.getElementById("mapdiv"), {
        center: pos,
        zoom: 17,
        gestureHandling: 'cooperative',
        disableDefaultUI:true,
        zoomControl: true,
          zoomControlOptions: {
              position: google.maps.ControlPosition.TOP_RIGHT
        }
                 
    });
    
    raceMap = new google.maps.Map(document.getElementById("raceMap"), {
        center: pos,
        zoom: 17,
        disableDefaultUI:true,
        zoomControl: true,
          zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_CENTER
        }
        
    });
    
    return map;
}

function initCalc(pos){
    
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable:true,
        map: map
    });
    
    raceDisplay = new google.maps.DirectionsRenderer({
        draggable:false,
        map: raceMap
    });
    
        
    directionsService = new google.maps.DirectionsService;
    
    route ={
          origin: {lat: pos.lat,lng: pos.lng-0.003},  // Haight.
          destination: {lat: pos.lat,lng: pos.lng+0.003},  // Ocean Beach.
          // Note that Javascript allows us to access the constant
          // using square brackets and a string value as its
          // "property."
          travelMode: google.maps.TravelMode['WALKING']
    };
    
    console.log(directionsService);
}

function detectBrowser(id) {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("mapdiv");
    mapdiv.style.width = '100%';
    var racediv = document.getElementById("raceMap");
    racediv.style.width = '100%';
}

function addMarker(location){
    //Create a new marker
    var marker = new google.maps.Marker({
        position: location,
        label: "YOU",
        map: map    
    });
    //Add marker to array
    markers.push(marker);
    console.log("add marker");
}

function addRaceMarker(location){
    //Create a new marker
    var marker = new google.maps.Marker({
        position: location,
        label: "YOU",
        map: raceMap    
    });
    //Add marker to array
    markers.push(marker);
    console.log("add marker");
}

function deleteMarkers(){
    console.log("markers cleared");
    //Remove all markers from the map
    for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
    }
    //Clear markers array
    markers=[];
}



//called when the position is successfully determined
function convertPosition(position) {
	//lets get some stuff out of the position object
	var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    
    //Update current position
    var pos= {
        lat: latitude,
        lng: longitude
    }

    return pos;
}

//called if the position is not obtained correctly
function failPosition(error) {
	//change time box to show updated messageuklkh/lkhjlkhjlkh lkhlkhlkhlkhlk
	$('#m1longtext').val("Error getting data: " + error);
}


function calcRoute(directionsService, directionsDisplay, route) {
        //Attempt to calculate route
        console.log("calculating route");
        directionsService.route(route, function(response, status) {
          if (status == 'OK') {
            //If succesful, display route
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
        
}

function getGeo(){
    var geo = directionsDisplay.directions.geocoded_waypoints;
    return geo;
}

function resetEditor(){
    //loading=true;
    console.log("reload editor");
    
    directionsDisplay.set('directions',null);
    raceDisplay.set('directions',null);
    
    deleteMarkers();
    
}

function track(position){
    //console.log("tracking");
    
    var pos=convertPosition(position);
    var range=0.0015;
    //IF RACE HAS STARTED
    if(racing==true){
        updateTimer();
        //CHECK IF REACHED DESTINATION
        if((pos.lat<=(route.destination.lat+range))&&(pos.lat>=(route.destination.lat-range))&&(pos.lng<=(route.destination.lng+range))&&(pos.lng>=(route.destination.lng-range))){
            //RACE FINISHED
            endRace();
        }
    }else{
        //CHECK IF READY TO START RACE
        if((pos.lat<=(route.origin.lat+range))&&(pos.lat>=(route.origin.lat-range))&&(pos.lng<=(route.origin.lng+range))&&(pos.lng>=(route.origin.lng-range))){
            //START RACE
            startRace();
        }else{
            $('#time').empty();
            $('#time').append("<h1><span id='timebg'>GO TO 'POINT A'</span></h1>");
            var estH = Math.floor(estimate/3600);
            var estM = Math.floor((estimate/60)-estH*60);
            var estS = estimate-estM*60;
            $('#raceInfo').empty();
            $('#raceInfo').append("<h3><span id='infobg'>Estimated Time "+estH+":"+estM+":"+estS+"</span></h3>");
            
        }
    }
    //UPDATE LOCATION MARKER
    if(pos.lat!=oldPos.lat&&pos.lng!=oldPos.lng){
        deleteMarkers();
        addRaceMarker(pos);
        console.log("Position - Lat: "+ pos.lat+ " Lng: "+pos.lng);
        console.log("Euclidean Distance to Origin - Lat:"+(route.origin.lat-pos.lat)+" Lng: "+(route.origin.lng-pos.lng));
        console.log("Destination -  Lat: "+route.destination.lat+" Lng: "+route.destination.lng);
        oldPos=pos;
    }

}

function centerMap(pos){
    map.setCenter(pos);
    map.setZoom(17);
}
function centerRaceMap(pos){
    raceMap.setCenter(pos);
    raceMap.setZoom(17);
}
function startRace(){
    racing=true;
    startTime = new Date();
    startTime={
        utc: startTime.getTime(),
        h:startTime.getHours(),
        m:startTime.getMinutes(),
        s:startTime.getSeconds()
    }
    var estH = Math.floor(estimate/3600);
    var estM = Math.floor((estimate/60)-estH*60);
    var estS = estimate-estM*60;
    $('#raceInfo').empty();
    $('#raceInfo').append("<h3><span id='infobg'>"+estH+":"+estM+":"+estS+"</span></h3>");
    updateTimer();
}

function updateTimer(){
    currentTime=new Date();
    currentTime={
        h:currentTime.getHours(),
        m:currentTime.getMinutes(),
        s:currentTime.getSeconds()
    }
    //FORMAT STOPWATCH
    var h = currentTime.h-startTime.h;
    if(currentTime.m>=startTime.m){
        var m = currentTime.m-startTime.m
    }else{
        var m=60-startTime.m+currentTime.m
        h--;
    }
    if(currentTime.s>=startTime.s){
        var s = currentTime.s-startTime.s
    }else{
        var s=60-startTime.s+currentTime.s
        m--;
    }
    $('#time').empty();
    $('#time').append("<h1><span id='timebg'>"+h+":"+m+":"+s+"</span></h1>");
}
function endRace(){
    currentTime=new Date();
    currentTime=currentTime.getTime();
    racing=false;
    console.log("Finished");
    var totalTime = Math.round((currentTime-startTime.utc)/1000);
    console.log("Time: "+totalTime);
    console.log("Estimate: "+estimate);
    if (totalTime<estimate){
        reward=(estimate-totalTime)*10;
    }else{
        reward=0;
    }
    console.log("You got "+reward);
    $("#pointsText").empty();
    $("#pointsText").append(reward+"pts");
    $("#pointsText").trigger("create");
    $.mobile.changePage( "#finishDialog", { role: "dialog" } );
}
