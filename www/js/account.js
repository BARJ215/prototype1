//This page consists of all the code that access, modifies or deletes account data. The account data is stored using Backendless.
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
    //This function is called when the main page is shown. This function checkes whether the user is currently logged in.
    //Based off code from https://backendless.com/documentation/users/js/users_get_current_user.htm
    Backendless.UserService.getCurrentUser().then(checkUser).catch(function(err){
        console.log("Error: "+err);
         $('#accountDiv').empty();
        $('#
          ').append("<h3 style='text-align: center; margin: 0px;'>Connect to the internet to access your profile.</h3>");
        $('#accountDiv').trigger("create");
    });
    
}
function accountInitP(){
    //This function is called when the the points page is shown. This function checkes whether the user is currently logged in.
    //Based off code from https://backendless.com/documentation/users/js/users_get_current_user.htm
    Backendless.UserService.getCurrentUser().then(checkUserP).catch(error);
    
}

function registerUser(){
    //This function will register the user with the Backendless user
    //Get entered name, email and password
    var name = $("#name").val();
    var email = $("#email").val();
    var pass = $("#password").val();
    //The following is based off code from https://backendless.com/feature-2-registering-app-users-with-the-user-registration-api/
    //Create Backendless user
    var newUser = new Backendless.User();
    //Add email, password and name
    newUser.email=email;
    newUser.password=pass;
    newUser.name=name;
    //Register user with Backendless
    Backendless.UserService.register(newUser).then(registered).catch(error);
}

function registerUserP(){
    //This function will register the user with the Backendless user on the points page
    //Get entered name, email and password
    var name = $("#nameP").val();
    var email = $("#emailP").val();
    var pass = $("#passwordP").val();
    //The following is based off code from https://backendless.com/feature-2-registering-app-users-with-the-user-registration-api/
    //Create Backendless user
    var newUser = new Backendless.User();
    //Add email, password and name
    newUser.email=email;
    newUser.password=pass;
    newUser.name=name;
    //Register user with Backendless
    Backendless.UserService.register(newUser).then(registeredP).catch(error);
}


function loginUser(){
    //This function logins in the user based off their entered email and password
    //Get entered email and password
    var email = $("#email").val();
    var pass = $("#password").val();
    //The following is based off code from https://backendless.com/documentation/users/js/users_login.htm
    Backendless.UserService.login(email,pass,true).then(loggedIn).catch(error);
    
}

function loginUserP(){
    //This function logins in the user based off their entered email and password on the points page
    //Get entered email and password
    var email = $("#emailP").val();
    var pass = $("#passwordP").val();
    //The following is based off code from https://backendless.com/documentation/users/js/users_login.htm
    Backendless.UserService.login(email,pass,true).then(loggedInP).catch(error);
    
}

function logoutUser(){
    Backendless.UserService.logout().then(loggedOut).catch(error); 
}

function loggedIn(account){
    //This function is called once the user has logged on the main page
    //Update current user info
    user= account;
    
    //Add profile page
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
    //This function is called once the user has logged on the points page
    //Update current user info
    user= account;
    
    //Add accept points dialog
    $('#accountPointsDiv').empty();
    $('#accountPointsDiv').append("<button id='acceptPoints'>Accept</button>");
    $('#accountDiv').trigger("create");
}

function loggedOut(){
    //This function is called once the user is logged out of the main page
    console.log("User logged out");
    checkUser(null);
}

function registered(){
    //This function is called once the user has been registered on the main page
    console.log("New User Registered");
    loginUser(); 
}

function registeredP(){
    //This function is called once the user has been registered on the points page
    console.log("New User Registered");
    loginUserP(); 
}


function checkUser(account){
    //If account doesn't exist
    if(account==null){
        console.log("User not logged in");
        //Add login/register options
        $('#accountDiv').empty();
        $('#accountDiv').append("<h3 style='text-align: center; margin: 0px;'>Welcome</h3><p>Please log in to access all the features.</p>");
        $('#accountDiv').append("<label for='email'>Email:</label><input name='email' id='email' value='' type='text'>");
        $('#accountDiv').append("<label for='password'>Password:</label><input name='password' id='password' value='' type='password'>");                
        $('#accountDiv').append("<button id='login'>Log In</button><p style='text-align: center; margin: 0px;'>OR</p><button id='register'>Register</button>");
        $('#accountDiv').trigger("create");
    }else{
        //There is a current user
        loggedIn(account);     
    }    
    
}

function checkUserP(account){
    //If account doesn't exist
    if(account==null){
        //Add points page
        $('#accountPointsDiv').empty();
        $('#accountPointsDiv').append("<h3 style='text-align: center; margin: 0px;'>Log in to save your points</h3><br>");
        $('#accountPointsDiv').append("<label for='email'>Email:</label><input name='email' id='emailP' value='' type='text'>");
        $('#accountPointsDiv').append("<label for='password'>Password:</label><input name='password' id='passwordP' value='' type='password'>");    
        $('#accountPointsDiv').append("<button id='loginP'>Log In</button><p style='text-align: center; margin: 0px;'>OR</p><button id='registerP'>Register</button>");
        $('#accountPointsDiv').trigger("create");
    }else{
        //There is a current user
        loggedInP(account);
    }
}

function registerScreen(){
    //This function adds a register screen to the main page
    //Get currently entered email and password values
    var email = $("#email").val();
    var pass = $("#password").val();
    //Add register screen
    $('#accountDiv').empty();
    $('#accountDiv').append("<h3 style='text-align: center; margin: 0px;'>Please enter your details</h3>");
    $('#accountDiv').append("<label for='email'>Email*:</label><input name='email' id='email' value='"+email+"' type='text' required>");
    $('#accountDiv').append("<label for='name'>Name:</label><input name='name' id='name' value='' type='text'>");
    $('#accountDiv').append("<label for='password'>Password*:</label><input name='password' id='password' value='"+pass+"' type='password'>");    
    $('#accountDiv').append("<button id='registerConfirm'>Register</button><button id='cancelRegister'>Cancel</button>");
    $('#accountDiv').trigger("create");
}

function registerScreenP(){
    //This function adds a register screen to the points page
    //Get currently entered email and password values
    var email = $("#emailP").val();
    var pass = $("#passwordP").val();
    //Add register screen
    $('#accountPointsDiv').empty();
    $('#accountPointsDiv').append("<h3 style='text-align: center; margin: 0px;'>Please enter your details</h3>");
    $('#accountPointsDiv').append("<label for='email'>Email*:</label><input name='email' id='emailP' value='"+email+"' type='text' required>");
    $('#accountPointsDiv').append("<label for='name'>Name:</label><input name='name' id='nameP' value='' type='text'>");
    $('#accountPointsDiv').append("<label for='password'>Password*:</label><input name='password' id='passwordP' value='"+pass+"' type='password'>");    
    $('#accountPointsDiv').append("<button id='registerConfirmP'>Register</button><button id='cancelRegisterP'>Cancel</button>");
    $('#accountPointsDiv').trigger("create");
}

function addPoints(pts){
    //This functions adds points to the current users account.
    redeemed=true;
    console.log("Adding points");
    console.log("From: "+user.points);
    user.points=user.points+pts;
    console.log("To: "+user.points);
    //The following is based off code from https://backendless.com/documentation/users/js/users_update_user_properties.htm
    Backendless.UserService.update(user).then(userUpdated).catch(error);
}

function userUpdated(){
    //This function is called once the user account has been updated
    console.log("User updated");
}

function loadLeaderboard(){
    //This function loads the leaderboard
    //BASED OFF CODE FROM https://backendless.com/docs/js/doc.html#data_search_with_where_clause
    var queryBuilder = Backendless.DataQueryBuilder.create();
    //This sorts the users by points
    queryBuilder.setSortBy("points");
    //This sets each page to contain 10 users - only 1 page is loaded
    queryBuilder.setPageSize(10);
    //Get Users and their corresponding points
    Backendless.Data.of("users").find(queryBuilder).then(processLeaderboard).catch(function(err){
        console.log("Error: "+err);
        $('#lb').empty();
        $('#lb').append("<h3 style='text-align: center; margin: 0px;'>Connect to the internet to access the leaderboard.</h3>");
        $('#lb').trigger("create");
    });
}

function processLeaderboard(users){
    //The following processes the user data to create the leaderboard
    //Clear leaderboard
    $("#lb").empty();
    //For each user from highest points to lowest
    for(var i=users.length-1; i>=0;i--){
        //Add user to leaderboard
        $("#lb").append("<li>"+users[i].name+"<span class='ui-li-count'>"+users[i].points+"</span></li>");
    }
    $("#lb").listview("refresh");
}