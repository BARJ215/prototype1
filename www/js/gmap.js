var map;
var raceMap;
var directionsService;
var route;
var newRoute=false;
var loading = false;
var markers= [];
var directionsDisplay;
var raceDisplay;

$(document).on("pageshow","#mapEditor", function() {
    newRoute=true;
    navigator.geolocation.getCurrentPosition(init, failPosition);
    
});
$(document).on("pageinit","#race","#courseSelect", function(){
    navigator.geolocation.getCurrentPosition(init, failPosition);
});

function initMap(pos){
    //detectBrowser();

     map = new google.maps.Map(document.getElementById("mapdiv"), {
        center: pos,
        zoom: 15,
        
    });
    
    raceMap = new google.maps.Map(document.getElementById("raceMap"), {
        center: pos,
        zoom: 15
    });
    
    return map;
}


function detectBrowser(id) {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("mapdiv");
    mapdiv.style.width = '100%';
    mapdiv.style.height = '800px';
    var racediv = document.getElementById("raceMap");
    racediv.style.width = '100%';
    racediv.style.height = '800px';
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

function deleteMarkers(){
    console.log("markers cleared");
    //Remove all markers from the map
    for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
    }
    //Clear markers array
    markers=[];
}


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
          origin: {lat: pos.lat,lng: pos.lng},  // Haight.
          destination: {lat: pos.lat,lng: pos.lng+0.003},  // Ocean Beach.
          // Note that Javascript allows us to access the constant
          // using square brackets and a string value as its
          // "property."
          travelMode: google.maps.TravelMode['WALKING']
    };

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