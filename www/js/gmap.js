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
var estimate;

$(document).on("pageshow","#mapEditor", function() {
    newRoute=true;
    navigator.geolocation.getCurrentPosition(init, failPosition);
    
});


$(document).on("pageshow","#courseSelect","#race", function(){
    navigator.geolocation.getCurrentPosition(init, failPosition);
});

$(document).on("pageshow","#race", function(){
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
});

$(document).on("pagehide","#race", function(){
    if(racing==true){
        //SAVE RACE OR END IT
        racing=false;
        
    }
    navigator.geolocation.clearWatch(trackID);
    console.log("stopped tracking");
});

function init(position){
    console.log("init");

    //Get position
    var currentPos = convertPosition(position);

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

}

function initMap(pos){
    //detectBrowser();

     map = new google.maps.Map(document.getElementById("mapdiv"), {
        center: pos,
        zoom: 15,
        gestureHandling: 'cooperative'
        
    });
    
    raceMap = new google.maps.Map(document.getElementById("raceMap"), {
        center: pos,
        zoom: 15
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
    var currentPos= {
        lat: latitude,
        lng: longitude
    }

    return currentPos;
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
    if(racing==true){
        var currentTime=new Date();
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
        $('#time').append("<h1>"+h+":"+m+":"+s+"</h1>");
        //CHECK IF REACHED DESTINATION
        if((pos.lat<=(route.destination.lat+range))&&(pos.lat>=(route.destination.lat-range))&&(pos.lng<=(route.destination.lng+range))&&(pos.lng>=(route.destination.lng-range))){
            console.log("reached point b");
            racing=false;
        }
    }else{
        //CHECK IF READY TO START RACE
        if((pos.lat<=(route.origin.lat+range))&&(pos.lat>=(route.origin.lat-range))&&(pos.lng<=(route.origin.lng+range))&&(pos.lng>=(route.origin.lng-range))){
            racing=true;
            //Start Race
            startTime = new Date();
            startTime={
                h:startTime.getHours(),
                m:startTime.getMinutes(),
                s:startTime.getSeconds()
            }
            $('#time').empty();
            $('#time').append("<h1>0:0:0</h1>");
            $('#raceInfo').empty();
            $('#raceInfo').append("<h3><span id='infobg'>"+estimate+"</span></h3>");
        }else{
            $('#time').empty();
            $('#time').append("<h1><span id='timebg'>GET TO 'POINT A' TO START</span></h1>");
            $('#raceInfo').empty();
            estimate="00:00:00";
            $('#raceInfo').append("<h3><span id='infobg'>Estimated Time "+estimate+"</span></h3>");
            
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
