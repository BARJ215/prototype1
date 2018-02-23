Backendless.initApp("1F116359-9934-2652-FF41-EC23042C0400","B59AA48F-500F-B1E8-FF7B-EACAB3399500");

$(document).on("click","#uploadButton",saveMap);

function saveMap(){
    var geo = getGeo();
    upload(geo);
}

function upload(geo){
    var newCourse={
        courseName: "Test",
        origin: geo[0].place_id,
        destination: geo[geo.length-1].place_id
    };
    if(geo.length>2){
        //Save optional waypoints as single string
        var waypoints =geo[1].place_id;
        for(i=2;i<geo.length-1;i++){
            //If does not exceed the limit
            if(waypoints.length+geo[i].place_id.length+1<=500){
               waypoints= String(waypoints+","+geo[i].place_id); 
            }
        }
        newCourse.waypoints=waypoints;
    }
    Backendless.Data.of("courses").save(newCourse).then(saved).catch(error);
}

function saved(savedCourse){
    console.log("uploaded " + savedCourse.objectId);
}

function error(err){
    alert(err);   
}


/*
function saveCourse(){
    
    var points=[];
    var geo = directionsDisplay.directions.geocoded_waypoints;
    //For everpoint on the map
    for(i=0; i<geo.length;i++){
        points[i]={placeId: geo[i].place_id};
        //If a waypoint...
        if(0<i&&i<geo.length-1){
           points[i]={location: {placeId: geo[i].place_id},stopover:false}; 
        }
    }
    
}


function load(){
    //Set inital point and destination
    route.origin=points[0];
    route.destination=points[points.length-1];
    //Optional waypoints...
    if(points.length>2){
        if(points.length==3){
          route.waypoints=[points[1]];  
        }else{
          route.waypoints=points.slice(1,points.length-1);
        }
    }
    //Calculate and display using new route
    calcRoute(directionsService, directionsDisplay, route);
}+
*/