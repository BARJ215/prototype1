var directionsDisplay;
var raceDisplay;
var directionsService;
var route;
//var points=[];

//$(document).on("click","#saveButton",saveCourse);
//$(document).on("click","#loadButton",load);

//when the jQuery Mobile page is initialised
$(document).on('pageinit', function() {
    ///instruct location service to get position with appropriate callbacks
    navigator.geolocation.getCurrentPosition(init, failPosition);
});



function init(position){
    //Get position
    var currentPos = getPosition(position);
    //Load map
    initMap(currentPos);
    
    initCalc(currentPos);
    
    calcRoute(directionsService, directionsDisplay, route);
    //Add marker on current position
    addMarker(currentPos);
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
function getPosition(position) {
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
