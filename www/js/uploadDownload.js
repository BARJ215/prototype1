//The purpose of this page is to implement the upload and download of maps using Backendless and the Google Maps API.
//The following is based off code from https://backendless.com/docs/js/doc.html
Backendless.initApp("1F116359-9934-2652-FF41-EC23042C0400","B59AA48F-500F-B1E8-FF7B-EACAB3399500");

var raceDisplay;
var raceDirectionService;
var raceCourse;
var estimate;

$(document).on("click","#uploadButton",saveMap);
$(document).on("click","#selectButton",selectCourse);
$(document).on('pageshow','#courseSelect',loadCourses);
$(document).on("click","#raceCenterA", function(){
    //Center the map based using place ID
    centerPlace(raceCourse.origin.placeId);
});
$(document).on("click","#raceCenterB", function(){
    //Center the map based using place ID
    centerPlace(raceCourse.destination.placeId);
});

function saveMap(){
    //IF a course name has been input..
    if($('#courseNameInput').val()!=""){
        //Get the geo data from the Google Maps API course creation map
        var geo = getGeo();
        //Upload the geo data.
        upload(geo);
    }else{
        alert("Please add a Name");
    }
    
}

function upload(geo){
    //Create new Course array
    var newCourse={
        courseName: $('#courseNameInput').val(),
        origin: geo[0].place_id,
        destination: geo[geo.length-1].place_id
    };

    //Upload new course to Backendless database
    Backendless.Data.of("courses").save(newCourse).then(saved).catch(error);
}

function saved(savedCourse){
    //This function is called once a course has been succesfully saved.
    console.log("uploaded");
}

function error(err){
    //This function is called if there has been an error in an upload
    loadings=false;
    alert(err);   
}

function loadCourses(){
    //BASED OFF CODE FROM https://backendless.com/docs/js/doc.html#data_search_with_where_clause
    var queryBuilder = Backendless.DataQueryBuilder.create();
    //The following sorts the courses by when they were created.
    queryBuilder.setSortBy("created");
    //The following increases the amount of Courses that can be loaded to 50 per page - only one page is loaded
    queryBuilder.setPageSize(50);
    //Get course data
    Backendless.Data.of("courses").find(queryBuilder).then(processResults).catch(function(err){
        console.log(err);
        $('#courseList').empty();
        $('#courseList').append("<legend>Connect to the internet to access the recent courses</legend>");
        $('#courseList').trigger("create");        
    });   
}

function processResults(courses){

    $('#courseList').empty();
    $('#courseList').append("<legend>Recent Courses:</legend>");
    //Add the most recent course and set it as the default selection
    $('#courseList').append("<input type='radio' checked name='c' id='p"+(courses.length-1)+"' value="+courses[courses.length-1].objectId   +"><label for='p"+(courses.length-1)+"'>"+courses[courses.length-1].courseName+"</label>");
    //For each course
    for(var i=courses.length-2; i>=0;i--){
        //Add all courses to the list where its value it the ID of its corresponding course.
        $('#courseList').append("<input type='radio' name='c' id='p"+i+"' value="+courses[i].objectId   +"><label for='p"+i+"'>"+courses[i].courseName+"</label>");
    }
    //The following code forces 'create' itself which forces it to follow its css.
    $('#courseList').trigger("create");
}

function selectCourse(){
    console.log("selecting course");
    //Get the ID for the selected course
    var id = getSelection();
    //Find the corresponding course by that ID
    Backendless.Data.of("courses").findById(id).then(loadRace).catch(error);
}

function loadRace(course){
    //Create new race course
    raceCourse={
        origin: placeReformat(course.origin),
        destination: placeReformat(course.destination),
        //The feature to change the travel mode should be added in the future
        travelMode: google.maps.TravelMode['WALKING']
    };
    //Update current position by initialising the maps.
    navigator.geolocation.getCurrentPosition(init, failPosition);
    //Calculate route of the new race course.
    calcRoute(directionsService, raceDisplay, raceCourse);
    //This uses the Google Maps API distance matrix service to calculate the estimated time to complete the race
    //The following is based off code from https://developers.google.com/maps/documentation/javascript/examples/distance-matrix
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {origins:[placeReformat(course.origin)],
         destinations: [placeReformat(course.destination)],
         travelMode: google.maps.TravelMode['WALKING']
        },function(serv,status){
            estimate=serv.rows[0].elements[0].duration.value;
            console.log(estimate);
        }
    )
}

function placeReformat(id){
    //This function reformats placeIDs so that they are usable by the Google Maps API.
    var place = {
        placeId: id
    };
    return place;
}

function getSelection(){
    //This function gets the ID of the selected course
    var objectId;
    //Get all the courses radio elements
    var radios = document.getElementsByName('c');
    //For each course radio
    for(i=0;i<radios.length;i++){
        //If selected
        if(radios[i].checked==true){
            //Get the ID from the radios value.
            objectId= radios[i].value;
        }
    }
    return objectId;
}

function centerPlace(pID){
    //The following code centers the map based off its place ID
    //The following is based off code from https://developers.google.com/maps/documentation/javascript/examples/place-details
    var placeServ = new google.maps.places.PlacesService(raceMap)
    placeServ.getDetails({placeId:pID},function(place,status){
        //Get the latititude and longitude of the place
        var pos= {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        }
        //Center map based off that position
        centerRaceMap(pos);
    })
}
