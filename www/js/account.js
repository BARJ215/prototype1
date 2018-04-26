//USES CODE FROM https://backendless.com/docs/js/doc.html#dynanchor1
$(document).on("pageshow","#main",accountInit);
$(document).on("pageshow","#leaderboard",loadLeaderboard);
$(document).on("click","#login",loginUser);
$(document).on("click","#loginP",loginUserP);
$(document).on("click","#logout",logoutUser);
$(document).on("click","#logoutP",logoutUser);
$(document).on("click","#register",registerScreen);
$(document).on("click","#registerP",registerScreenP);
$(document).on("click","#registerConfirm",registerUser);
$(document).on("click","#registerConfirmP",registerUserP);
$(document).on("pageshow","#finishDialog",accountInitP)
$(document).on("click","#cancelRegister",function(){
    checkUser(null);
});
$(document).on("click","#cancelRegisterP",function(){
    checkUserP(null);
});
$(document).on("click","#finishDialog",function(){
    addPoints(reward);
    $.mobile.changePage($("#main"));
})
var user;

function accountInit(){
    Backendless.UserService.getCurrentUser().then(checkUser).catch(error);
    
}
function accountInitP(){
    Backendless.UserService.getCurrentUser().then(checkUserP).catch(error);
    
}

function registerUser(){
    var name = $("#name").val();
    var email = $("#email").val();
    var pass = $("#password").val();
    
    var newUser = new Backendless.User();
    newUser.email=email;
    newUser.password=pass;
    newUser.name=name;
    
    Backendless.UserService.register(newUser).then(registered).catch(error);
}

function registerUserP(){
    var name = $("#nameP").val();
    var email = $("#emailP").val();
    var pass = $("#passwordP").val();
    
    var newUser = new Backendless.User();
    newUser.email=email;
    newUser.password=pass;
    newUser.name=name;
    
    Backendless.UserService.register(newUser).then(registeredP).catch(error);
}


function loginUser(){
    var email = $("#email").val();
    var pass = $("#password").val();
    console.log("email: "+email+" password: "+pass);
    Backendless.UserService.login(email,pass,true).then(loggedIn).catch(error);
    
}

function loginUserP(){
    var email = $("#emailP").val();
    var pass = $("#passwordP").val();
    console.log("email: "+email+" password: "+pass);
    Backendless.UserService.login(email,pass,true).then(loggedInP).catch(error);
    
}

function logoutUser(){
    Backendless.UserService.logout().then(loggedOut).catch(error); 
}

function loggedIn(account){
    user= account;
    console.log("User logged in");
    console.log(user);
    //ADD PROFILE PAGE
    $('#accountDiv').empty();
    $('#accountDiv').append("<span><div id='points'>"+user.points+"<a class='ui-btn ui-shadow ui-corner-all ui-icon-star ui-btn-icon-notext ui-btn-b ui-btn-inline'></a></div>");
    $('#accountDiv').append("<div id='sidePoints'><h4>Welcome back "+user.name+"</h4><button id='logout' class='ui-btn ui-btn-inline'>Log out</button></div></span>");
    $('#accountDiv').trigger("create");
    //Check if they still redeem some points;
    if(redeemed==false){
        addPoints(reward);
    }
    
}


function loggedInP(account){
    user= account;
    console.log("User logged in");
    console.log(user);
    //Points dialog
    $('#accountPointsDiv').empty();
    $('#accountPointsDiv').append("<button id='acceptPoints'>Accept</button>");
    $('#accountDiv').trigger("create");
}

function loggedOut(){
    console.log("User logged out");
    checkUser(null);
}

function registered(){
    console.log("New User Registered");
    loginUser(); 
}

function registeredP(){
    console.log("New User Registered");
    loginUserP(); 
}


function checkUser(account){
    if(account==null){
        console.log("User not logged in");
        //ADD LOGIN/REGISTER OPTIONS
        $('#accountDiv').empty();
        $('#accountDiv').append("<h3 style='text-align: center; margin: 0px;'>Welcome</h3><p>Please log in to access all the features.</p>");
        $('#accountDiv').append("<label for='email'>Email:</label><input name='email' id='email' value='' type='text'>");
        $('#accountDiv').append("<label for='password'>Password:</label><input name='password' id='password' value='' type='password'>");                
        $('#accountDiv').append("<button id='login'>Log In</button><p style='text-align: center; margin: 0px;'>OR</p><button id='register'>Register</button>");
        $('#accountDiv').trigger("create");
    }else{
        loggedIn(account);     
    }    
    
}

function checkUserP(account){
    if(account==null){
        //Points Page
        $('#accountPointsDiv').empty();
        $('#accountPointsDiv').append("<h3 style='text-align: center; margin: 0px;'>Log in to save your points</h3><br>");
        $('#accountPointsDiv').append("<label for='email'>Email:</label><input name='email' id='emailP' value='' type='text'>");
        $('#accountPointsDiv').append("<label for='password'>Password:</label><input name='password' id='passwordP' value='' type='password'>");                
        $('#accountPointsDiv').append("<button id='loginP'>Log In</button><p style='text-align: center; margin: 0px;'>OR</p><button id='registerP'>Register</button>");
        $('#accountPointsDiv').trigger("create");
    }else{
        loggedInP(account);
    }
}

function registerScreen(){
    var email = $("#email").val();
    var pass = $("#password").val();
    //ADD REGISTER SCREEN
    $('#accountDiv').empty();
    $('#accountDiv').append("<h3 style='text-align: center; margin: 0px;'>Please enter your details</h3>");
    $('#accountDiv').append("<label for='email'>Email*:</label><input name='email' id='email' value='"+email+"' type='text' required>");
    $('#accountDiv').append("<label for='name'>Name:</label><input name='name' id='name' value='' type='text'>");
    $('#accountDiv').append("<label for='password'>Password*:</label><input name='password' id='password' value='"+pass+"' type='password'>");    
    $('#accountDiv').append("<button id='registerConfirm'>Register</button><button id='cancelRegister'>Cancel</button>");
    $('#accountDiv').trigger("create");
}

function registerScreenP(){
    var email = $("#emailP").val();
    var pass = $("#passwordP").val();
    //Add points Register Screen
    $('#accountPointsDiv').empty();
    $('#accountPointsDiv').append("<h3 style='text-align: center; margin: 0px;'>Please enter your details</h3>");
    $('#accountPointsDiv').append("<label for='email'>Email*:</label><input name='email' id='emailP' value='"+email+"' type='text' required>");
    $('#accountPointsDiv').append("<label for='name'>Name:</label><input name='name' id='nameP' value='' type='text'>");
    $('#accountPointsDiv').append("<label for='password'>Password*:</label><input name='password' id='passwordP' value='"+pass+"' type='password'>");    
    $('#accountPointsDiv').append("<button id='registerConfirmP'>Register</button><button id='cancelRegisterP'>Cancel</button>");
    $('#accountPointsDiv').trigger("create");
}

function addPoints(pts){
    redeemed=true;
    console.log("Adding points");
    console.log("From: "+user.points);
    user.points=user.points+pts;
    console.log("To: "+user.points);
    Backendless.UserService.update(user).then(userUpdated).catch(error);
}

function userUpdated(){
    console.log("User updated");
}

function loadLeaderboard(){
    //BASED OFF CODE FROM https://backendless.com/docs/js/doc.html#data_search_with_where_clause
    var queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setSortBy("points");
    queryBuilder.setPageSize(10);
    
    Backendless.Data.of("users").find(queryBuilder).then(processLeaderboard).catch(error); 
}

function processLeaderboard(users){
    console.log(users);
    $("#lb").empty();
    for(var i=users.length-1; i>=0;i--){
        $("#lb").append("<li>"+users[i].name+"<span class='ui-li-count'>"+users[i].points+"</span></li>");
    }
    $("#lb").listview("refresh");
}