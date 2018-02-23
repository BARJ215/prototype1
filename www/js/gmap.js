var map;
var markers= [];

function initMap(){
    /*
    detectBrowser();

     map = new google.maps.Map(document.getElementById('map'), {
        center:{lat: 0, lng: 0},
        zoom: 15
    });
    */
}

function initMap(pos){
    detectBrowser();

     map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 15
    });
    
    return map;
}

function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map");
    mapdiv.style.width = '100%';
    mapdiv.style.height = '800px';
}

function addMarker(location){
    //Create a new marker
    var marker = new google.maps.Marker({
        position: location,
        map: map,    
    });
    //Add marker to array
    markers.push(marker);
    console.log("add marker");
}

function deleteMarkers(){
    //Remove all markers from the map
    for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
    }
    //Clear markers array
    markers=[];
}