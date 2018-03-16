Backendless.initApp("1F116359-9934-2652-FF41-EC23042C0400","B59AA48F-500F-B1E8-FF7B-EACAB3399500");

var raceDisplay;
var raceDirectionService;

$(document).on("click","#uploadButton",saveMap);
$(document).on("click","#selectButton",selectCourse);
$(document).on('pageshow','#courseSelect',loadCourses);

function saveMap(){
    var geo = getGeo();
    upload(geo);
}

function upload(geo){
    console.log($('#courseNameInput'));
    var newCourse={
        courseName: $('#courseNameInput').val(),
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
    loadings=false;
    alert(err);   
}

function loadCourses(){
    Backendless.Data.of("courses").find().then(processResults).catch(error);   
}

function processResults(courses){
    //display the first task in an array of tasks/
    $('#courseList').empty();
    //Add checked course
    $('#courseList').append("<legend>Your Race Courses:</legend>");
    $('#courseList').append("<input type='radio' checked name='c' id='p0' value="+courses[0].objectId   +"><label for='p0'>"+courses[0].courseName+"</label>");
    //add each new tasks
    for(var i=1; i<courses.length;i++){
        $('#courseList').append("<input type='radio' name='c' id='p"+i+"' value="+courses[i].objectId   +"><label for='p"+i+"'>"+courses[i].courseName+"</label>");
    }
    //refresh the listview
    $('#courseList').trigger("create");
}

function selectCourse(){
    //Get ID
    var id = getSelection();
    Backendless.Data.of("courses").findById(id).then(loadRace).catch(error);
}

function loadRace(course){
    var rc={
        origin: placeMaker(course.origin),
        destination: placeMaker(course.destination),
        travelMode: google.maps.TravelMode['WALKING']
    };
    calcRoute(directionsService, raceDisplay, rc);
}

function placeMaker(id){
    var place = {
        placeId: id
    };
    return place;
}

function getSelection(){
    var objectId;
    var radios = document.getElementsByName('c');
    for(i=0;i<radios.length;i++){
        if(radios[i].checked==true){
            objectId= radios[i].value;
        }
    }
    return objectId;
}
